import prisma from "@/lib/prisma";

export default async function FilesPage() {
    const users = await prisma.user.findMany()
    return (
        <>
            <h1>Files Page</h1>
            <p>Please log in to continue.</p>
        </>
    )
}