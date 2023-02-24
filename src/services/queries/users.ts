import { usersKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	return deSerilize(id,user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const userID = genId();
	await client.hSet(usersKey(userID), serilize(attrs));

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
