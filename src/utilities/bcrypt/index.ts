const bcrypt = require('bcrypt')

export const hashPassword = async (unHashedPassword: string): Promise<string> => {
    console.log(unHashedPassword)
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword: string = await bcrypt.hash(unHashedPassword, salt)
    return hashedPassword
}

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    try {
        const passwordMatch: boolean = await bcrypt.compare(plainPassword, hashedPassword)
        return passwordMatch
    } catch (error) {
        return false;
    }
}