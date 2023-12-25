const verifyToken = async (token:string) => {
    const URL = process.env.NEXT_URL

    const response = await fetch(`https://x-clone-f4l1.onrender.com/api/auth/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(token)
    })

    return response.json()
}


export const getJwtSecretKey = () => {
    const key = process.env.JWT_SECRET_KEY

    if(!key) throw new Error('no jwt secret key')
    return new TextEncoder().encode(key)
}

export const verifyJwtToken = async (token:string) => {
    const response = await verifyToken(token);
    if (!response) return null
    return response
}