import { itemsKey } from '$services/keys';
import { client } from '$services/redis';
import type { CreateItemAttrs } from '$services/types';
import { genId } from '$services/utils';
import { deserialize } from './deserialize';
import { serialize } from './serialize';

export const getItem = async (id: string) => {
	const item = await client.hGetAll(itemsKey(id));
	const found = Object.keys(item).length !== 0;
	if (!found) {
		return null;
	}

	return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
	const commands = ids.map((id: string) => {
		return client.hGetAll(itemsKey(id));
	});

	const results = await Promise.all(commands);

	results.map((res, i) => {
		const found = Object.keys(res).length !== 0;
		const itemID = ids[i];

		return found ? deserialize(itemID, res) : null;
	});
};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
	const id = genId();
	const serialized = serialize(attrs);

	await client.hSet(itemsKey(id), serialized);

	return id;
};
