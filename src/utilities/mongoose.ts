import moongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
    moongoose.set('strictQuery', true)

    if(!process.env.MONGODB_URL) return console.log('Missing mongodb url')

    if (isConnected) {
        console.log("mongodb connected already")

        return
    }

    try {
        await moongoose.connect(process.env.MONGODB_URL)

        isConnected = true
        console.log("mongodb connected successfully")
    } catch (error) {
        console.log(error)
    }
}