import {NextRequest, NextResponse} from "next/server";
import {Bucket, s3Client} from "@/lib/s3";
import {_Object, GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand} from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";
import {AppFile} from "@/types/files.types";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";


/**
 * Handles file upload via POST request.
 *
 * Expects a multipart/form-data request with:
 * - 'file': The file to upload.
 * - 'userId': The ID of the user uploading the file.
 *
 * Steps:
 * 1. Validates the presence of the file and userId.
 * 2. Checks if the user exists in the database.
 * 3. Uploads the file to S3 under a user-specific path.
 * 4. Returns a success or error response.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} The response with upload status.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
        return NextResponse.json({error: 'No file uploaded'}, {status: 400});
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/\s/g, '-');

    const userId = formData.get('userId') as string | null;
    if (!userId) {
        return NextResponse.json({error: 'No user provided'}, {status: 400});
    }

    const user = await prisma.user.findFirst({
        where: {id: userId}
    })
    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    // Upload the file to S3
    const command = new PutObjectCommand({
        Bucket: Bucket,
        Key: `files/${user.id}/${filename}`,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
            'uploaded-by': user.id,
            'filename': filename,
        }
    });

    try {
        await s3Client.send(command);
        return NextResponse.json({
            message: 'File uploaded successfully',
            filename,
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({error: 'Error uploading file'}, {status: 500});
    }
}

/**
 * Retrieves files for a specific user from S3 bucket.
 *
 * @param request - The incoming request object
 * @returns Promise<NextResponse> - List of files or error response
 */
export async function GET(request: NextRequest): Promise<NextResponse> {

    // Get userId from the URL search params
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({error: 'User ID is required'}, {status: 400});
    }

    // Retourner une liste vide au lieu des données de test
    return NextResponse.json({
        files: [],
        count: 0
    });

    // Verify user exists
    const user = await prisma.user.findFirst({
        where: {id: userId}
    });

    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    try {
        const command = new ListObjectsV2Command({
            Bucket: Bucket,
            Prefix: `files/${userId}/`,
        });

        const response = await s3Client.send(command);

        // Transform the response to include only relevant file information
        const files = await processFiles(response.Contents ?? []);

        return NextResponse.json({
            files,
            count: files.length
        });
    } catch (error) {
        console.error('Error listing files:', error);
        return NextResponse.json({error: 'Error retrieving files'}, {status: 500});
    }
}

async function processFiles(s3Files: _Object[]): Promise<AppFile[]> {
    const processedFiles: AppFile[] = [];

    const filePromises = s3Files.map(async (file) => {
        if (!file.Key) {
            return false
        }
        try {
            const headCommand = new HeadObjectCommand({
                Bucket: Bucket,
                Key: file.Key
            });

            const headResult = await s3Client.send(headCommand);

            const getObjectCommand = new GetObjectCommand({
                Bucket: Bucket,
                Key: file.Key
            });

            const downloadUrl = await getSignedUrl(s3Client, getObjectCommand, {
                expiresIn: 3600 // 1 hour
            });

            return {
                key: file.Key,
                size: file.Size,
                lastModified: file.LastModified?.toDateString() || 'Unknown',
                type: headResult.ContentType ?? 'application/octet-stream',
                name: file.Key.split('/').pop() || 'Unknown',
                downloadUrl: downloadUrl
            };
        } catch (error) {
            console.error(`Error getting metadata for file ${file.Key}:`, error);
            return {
                key: file.Key,
                size: file.Size,
                lastModified: file.LastModified?.toDateString() || 'Unknown',
                type: 'application/octet-stream', // Fallback
                name: file.Key.split('/').pop() || 'Unknown',
                downloadUrl: ''
            };
        }
    });

    const results = await Promise.all(filePromises);
    const filteredResults = results.filter(Boolean) as AppFile[]
    processedFiles.push(...filteredResults);

    return processedFiles;
}