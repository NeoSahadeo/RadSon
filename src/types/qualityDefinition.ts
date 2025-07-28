import type { ApiType } from "./global";

export interface QualityDefinitionApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	put(type: ApiType, body: object, id: number): Promise<unknown>;
	update(type: ApiType, body: object): Promise<unknown>;
	limits(type: ApiType): Promise<unknown>;
}
