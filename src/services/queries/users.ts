import { usernamesKey, usernamesUniqueKey, usersKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';

export const getUserByUsername = async (username: string) => {
	const decimalID = await client.zScore(usernamesKey(), username)
	if (!decimalID) {
		throw new Error('username doesnt exist')
	}

	const userID = decimalID.toString(16)

	const user = await client.hGetAll(userID)

	return deSerilize(userID, user)
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	return deSerilize(id,user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const userID = genId();

	const exist = await client.sIsMember(usernamesUniqueKey(), attrs.username);

	if (exist) {
		throw new Error('username is taken')
	}

	await client.sAdd(usernamesUniqueKey(), attrs.username)
	await client.hSet(usersKey(userID), serilize(attrs));
	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(userID, 16)
	});

	return userID;
};

const serilize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const deSerilize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
