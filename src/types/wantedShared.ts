import type { ApiType } from "./global";
export interface WantedApi {
	missing(type: ApiType, id?: number): Promise<unknown>;
	cutoff(type: ApiType, id?: number): Promise<unknown>;
}
