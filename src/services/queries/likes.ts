import { itemsKey, userlikesKey } from '$services/keys';
import { client } from '$services/redis';
import { getItems } from './items';

const likeKey: string = 'likes';

// userLikesItem check whether user is like an item or not
export const userLikesItem = async (itemId: string, userId: string) => {
	return client.sIsMember(userlikesKey(userId), itemId);
};

export const likeItem = async (itemId: string, userId: string) => {
	const inserted = await client.sAdd(userlikesKey(userId), itemId);

	if (inserted) {
		return client.hIncrBy(itemsKey(itemId), likeKey, 1);
	}
};

export const unlikeItem = async (itemId: string, userId: string) => {
	const removed = await client.sRem(userlikesKey(userId), itemId);

	if (removed) {
		return client.hIncrBy(itemsKey(itemId), likeKey, -1);
	}
};

export const likedItems = async (userId: string) => {
	const ids = await client.sMembers(userlikesKey(userId));
	return getItems(ids);
};

// commonLikedItems also is intersection-set like between 2 users
export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
	const ids = await client.sInter([userlikesKey(userOneId), userlikesKey(userTwoId)]);
    return getItems(ids);
};
