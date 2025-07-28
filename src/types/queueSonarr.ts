import type { ApiType } from "./global";

interface GrabApi {
	get(type: ApiType, id?: number): Promise<unknown>;
}

export interface QueueApi {
	get(type: ApiType, id?: number): Promise<unknown>;
}
