export type UserTypes = {
    id: string
    name: string
    username: string
    description: string
    location: string
    website: string
    isPremium: boolean
    createdAt: Date
    updatedAt: Date
    photoUrl: string
    headerUrl: string
    followers: UserTypes[]
    following: UserTypes[]
}

export type userResponse = {
    success: boolean
    user: UserTypes
}