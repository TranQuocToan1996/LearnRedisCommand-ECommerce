export const pageCacheKey = (id: string) => `pagecache#${id}`;
export const usersKey = (userID: string) => `users#${userID}`;
export const sessionsKey = (sessionID: string) => `sessions#${sessionID}`;
export const itemsKey = (itemID: string) => `items#${itemID}`;
export const usernamesUniqueKey = () => `usernames:unique`;
export const userlikesKey = (userID: string) => `users:likes#${userID}`;