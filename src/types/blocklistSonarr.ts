import type { Direction, Protocol } from "./global";
export interface BlockListApi {
	get({
		page,
		page_size,
		sort_key,
		sort_direction,
		series_ids,
		protocols,
	}: {
		page?: number;
		page_size?: number;
		sort_key?: string;
		sort_direction?: Direction;
		series_ids?: number[];
		protocols?: Protocol[];
	}): Promise<unknown>;
	delete(id: number): Promise<unknown>;
	delete_bulk(body: object): Promise<unknown>;
}
