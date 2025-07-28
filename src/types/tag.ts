import type { ApiType } from "./global";
export interface TagApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	post(type: ApiType, body: object): Promise<unknown>;
	put(type: ApiType, body: object, id: number): Promise<unknown>;
	delete(type: ApiType, id: number): Promise<unknown>;
}
