import type { ApiType } from "./global";
export interface RemotePathMappingApi {
	get(type: ApiType, id: number): Promise<unknown>;
	post(type: ApiType, body: object): Promise<unknown>;
	delete(type: ApiType, id: number): Promise<unknown>;
	put(type: ApiType, body: object, id: number): Promise<unknown>;
}
