export function GET() {
   /* res.status(200).json({ message: 'Hello from Next.js!' })*/
    // query is "hello" for /api/search?query=hello
    return new Response(
        JSON.stringify({ message: 'Hello from Next.js!' }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )
}