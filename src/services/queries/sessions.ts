import { sessionsKey } from '$services/keys';
import { client } from '$services/redis';
import type { Session } from '$services/types';

export const getSession = async (id: string) => {
	const session = await client.hGetAll(sessionsKey(id));
	console.log(session);

	const found = Object.keys(session).length !== 0;

	if (!found) {
		return null;
	}

	return deserilize(id, session);
};

export const saveSession = async (session: Session) => {
    console.log("save session")
	return client.hSet(
        sessionsKey(session.id),
        serilize(session)
    )
};

const serilize = (session: Session) => {
	return {
		userId: session.userId,
		username: session.username
	};
};

const deserilize = (id: string, session: { [key: string]: string }) => {
	return {
		id,
		userId: session.userId,
		username: session.username
	};
};
