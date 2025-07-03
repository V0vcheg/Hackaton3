import { AppFile } from "@/types/files.types";

// Mock user ID for testing
const MOCK_USER_ID = "user-12345";

export const mockFilesData: AppFile[] = [
    {
        key: `/files/${MOCK_USER_ID}/documents/project-proposal.pdf`,
        name: "project-proposal.pdf",
        size: 2547834,
        type: "application/pdf",
        lastModified: "2024-12-15T14:30:22Z",
        downloadUrl: "https://my-bucket.s3.amazonaws.com/files/user-12345/documents/project-proposal.pdf"
    },
    {
        key: `/files/${MOCK_USER_ID}/images/screenshot-2024.png`,
        name: "screenshot-2024.png",
        size: 1024768,
        type: "image/png",
        lastModified: "2024-12-20T09:15:33Z",
        downloadUrl: "https://my-bucket.s3.amazonaws.com/files/user-12345/images/screenshot-2024.png"
    },
    {
        key: `/files/${MOCK_USER_ID}/spreadsheets/budget-analysis.xlsx`,
        name: "budget-analysis.xlsx",
        size: 456789,
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        lastModified: "2024-12-18T16:45:12Z",
        downloadUrl: "https://my-bucket.s3.amazonaws.com/files/user-12345/spreadsheets/budget-analysis.xlsx"
    },
    {
        key: `/files/${MOCK_USER_ID}/documents/meeting-notes.docx`,
        name: "meeting-notes.docx",
        size: 123456,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        lastModified: "2024-12-22T11:20:45Z",
        downloadUrl: "https://my-bucket.s3.amazonaws.com/files/user-12345/documents/meeting-notes.docx"
    },
    {
        key: `/files/${MOCK_USER_ID}/videos/demo-video.mp4`,
        name: "demo-video.mp4",
        size: 15728640,
        type: "video/mp4",
        lastModified: "2024-12-10T13:55:18Z",
        downloadUrl: "https://my-bucket.s3.amazonaws.com/files/user-12345/videos/demo-video.mp4"
    },
    {
        key: `/files/${MOCK_USER_ID}/code/main.js`,
        name: "main.js",
        size: 8192,
        type: "text/javascript",
        lastModified: "2024-12-25T08:30:00Z",
        downloadUrl: "https://my-bucket.s3.amazonaws.com/files/user-12345/code/main.js"
    },
    {
        key: `/files/${MOCK_USER_ID}/archives/backup-2024.zip`,
        name: "backup-2024.zip",
        size: 52428800,
        type: "application/zip",
        lastModified: "2024-12-01T20:15:30Z",
        downloadUrl: "https://my-bucket.s3.amazonaws.com/files/user-12345/archives/backup-2024.zip"
    },
    {
        key: `/files/${MOCK_USER_ID}/images/profile-photo.jpg`,
        name: "profile-photo.jpg",
        size: 204800,
        type: "image/jpeg",
        lastModified: "2024-12-23T14:45:22Z",
        downloadUrl: "https://my-bucket.s3.amazonaws.com/files/user-12345/images/profile-photo.jpg"
    },
    {
        key: `/files/${MOCK_USER_ID}/documents/contract.pdf`,
        name: "contract.pdf",
        size: 3145728,
        type: "application/pdf",
        lastModified: "2024-12-19T10:30:15Z",
        downloadUrl: "https://my-bucket.s3.amazonaws.com/files/user-12345/documents/contract.pdf"
    },
    {
        key: `/files/${MOCK_USER_ID}/data/analytics.csv`,
        name: "analytics.csv",
        size: 65536,
        type: "text/csv",
        lastModified: "2024-12-21T17:22:41Z",
        downloadUrl: "https://my-bucket.s3.amazonaws.com/files/user-12345/data/analytics.csv"
    }
];

// Helper function to generate additional mock data for a specific user
export const generateMockFilesForUser = (userId: string, count: number = 5): AppFile[] => {
    const fileTypes = [
        { ext: 'pdf', type: 'application/pdf', sizeRange: [100000, 5000000] },
        { ext: 'png', type: 'image/png', sizeRange: [50000, 2000000] },
        { ext: 'jpg', type: 'image/jpeg', sizeRange: [30000, 1500000] },
        { ext: 'docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', sizeRange: [20000, 500000] },
        { ext: 'xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', sizeRange: [15000, 800000] },
        { ext: 'txt', type: 'text/plain', sizeRange: [1000, 50000] },
        { ext: 'mp4', type: 'video/mp4', sizeRange: [5000000, 50000000] },
        { ext: 'zip', type: 'application/zip', sizeRange: [1000000, 100000000] }
    ];

    const folders = ['documents', 'images', 'videos', 'archives', 'data', 'code'];

    return Array.from({ length: count }, (_, index) => {
        const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        const folder = folders[Math.floor(Math.random() * folders.length)];
        const fileName = `file-${index + 1}.${fileType.ext}`;
        const size = Math.floor(Math.random() * (fileType.sizeRange[1] - fileType.sizeRange[0]) + fileType.sizeRange[0]);

        // Generate random date within last 30 days
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        return {
            key: `/files/${userId}/${folder}/${fileName}`,
            name: fileName,
            size,
            type: fileType.type,
            lastModified: date.toISOString(),
            downloadUrl: `https://my-bucket.s3.amazonaws.com/files/${userId}/${folder}/${fileName}`
        };
    });
};