import type { ApiType } from "./global";
export interface AutoTaggingApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	post(type: ApiType, body: JSON): Promise<unknown>;
	put(type: ApiType, body: JSON, id: number): Promise<unknown>;
	delete(type: ApiType, id: number): Promise<unknown>;
	schema(type: ApiType): Promise<unknown>;
}
