import type { ApiType } from "./global";
export interface RootFolderApi {
	get(type: ApiType, id: number): Promise<unknown>;
	post(type: ApiType, body: object): Promise<unknown>;
	delete(type: ApiType, id: number): Promise<unknown>;
}
