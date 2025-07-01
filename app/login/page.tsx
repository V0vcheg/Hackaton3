import {api} from "@/libs/api";

export default async function LoginPage() {
    const test = await api('/api/auth', 'GET')

    return (
        <>
            <h1>Login Page</h1>
            <p>Please log in to continue.</p>
        </>
    )
}