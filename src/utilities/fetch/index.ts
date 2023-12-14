const HOST_URL = process.env.NEXT_HOST_URL


export const createUser = async (newUser: string) => {
    console.log('user')
    const response = await fetch(`${HOST_URL}/api/user/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: newUser,
    });
    return response.json();
};

export const deleteTweet = async (tweetId: string, tweetAuthor: string, tokenOwnerId: string) => {
    const response = await fetch(`${HOST_URL}/api/tweet/${tweetAuthor}/${tweetId}/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: tokenOwnerId,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const checkUserExists = async (username: string) => {
    const response = await fetch(`${HOST_URL}/api/user/exist?q=${username}`);
    return response.json();
};

export const getUser = async (username: string) => {
    console.log('here')
    const response = await fetch(`${HOST_URL}/api/user/${username}`, {
        next: {
            revalidate: 0,
        },
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};


export const logIn = async (candidate: string) => {
    const response = await fetch(`${HOST_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: candidate,
    });
    return response.json();
};

export const getRandomThreeUsers = async () => {
    const response = await fetch(`${HOST_URL}/api/user/random`);
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const getUserTweets = async (username: string) => {
    console.log(username)
    const response = await fetch(`${HOST_URL}/api/tweet/${username}`, {
        next: {
            revalidate: 0,
        },
    });
    const json = await response.json();
    console.log('tweet2')
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const updateUserFollows = async (followedUsername: string, tokenOwnerId: string, isFollowed: boolean) => {
    const route = isFollowed ? "unfollow" : "follow";
    const response = await fetch(`${HOST_URL}/api/user/${followedUsername}/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: tokenOwnerId,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const editUser = async (updatedUser: string, username: string) => {
    console.log(username)
    const response = await fetch(`${HOST_URL}/api/user/${username}/editProfile`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: updatedUser,
    });
    return response.json();
};





export const getAllTweets = async (page = "1") => {
    const response = await fetch(`${HOST_URL}/api/tweet/all?page=${page}`, {
        next: {
            revalidate: 0,
        },
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const createTweet = async (tweet: string) => {
    console.log('Na here i dey to tweet')
    const response = await fetch(`${HOST_URL}/api/tweet/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: tweet,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const getUserTweet = async (tweetId: string, tweetAuthor: string) => {
    const response = await fetch(`${HOST_URL}/api/tweet/${tweetAuthor}/${tweetId}`, {
        next: {
            revalidate: 0,
        },
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const updateRetweets = async (tweetId: string, tweetAuthor: string, tokenOwnerId: string, isRetweeted: boolean) => {
    const route = isRetweeted ? "unretweet" : "retweet";
    const response = await fetch(`${HOST_URL}/api/tweet/${tweetAuthor}/${tweetId}/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: tokenOwnerId,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};

export const updateTweetLikes = async (tweetId: string, tweetAuthor: string, tokenOwnerId: string, isLiked: boolean) => {
    const route = isLiked ? "unlike" : "like";
    const response = await fetch(`${HOST_URL}/api/tweet/${tweetAuthor}/${tweetId}/${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: tokenOwnerId,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};
export const getRelatedTweets = async () => {
    const response = await fetch(`${HOST_URL}/api/tweet/related`, {
        next: {
            revalidate: 0,
        },
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};
export const search = async (text: string) => {
    const response = await fetch(`${HOST_URL}/api/search?q=${text}`);
    return response.json();
};








export const getNotifications = async () => {
    const response = await fetch(`${HOST_URL}/api/notification`, {
        next: {
            revalidate: 0,
        },
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};
export const markNotificationsRead = async () => {
    const response = await fetch(`${HOST_URL}/api/notification/read`, {
        next: {
            revalidate: 0,
        },
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};















export const createMessage = async (message: string) => {
    const response = await fetch(`${HOST_URL}/api/message/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: message,
    });
    const json = await response.json();
    if (!json.success) throw new Error(json.message ? json.message : "Something went wrong.");
    return json;
};