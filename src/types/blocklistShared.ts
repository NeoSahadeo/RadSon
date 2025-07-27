import type { ApiType, Direction, Protocol } from "./global";
export interface BlockListApi {
	get({
		type,
		page,
		page_size,
		sort_key,
		sort_direction,
		series_id,
		protocols,
	}: {
		type: ApiType;
		page?: number;
		page_size?: number;
		sort_key?: string;
		sort_direction?: Direction;
		series_id?: number[];
		protocols?: Protocol[];
	}): Promise<unknown>;
	delete(type: ApiType, id: number): Promise<unknown>;
	delete_bulk(type: ApiType, body: object): Promise<unknown>;
}
