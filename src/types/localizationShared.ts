import type { ApiType } from "./global";
export interface LocalizationApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	language(type: ApiType, id?: number): Promise<unknown>;
}
