import type { Direction, Protocol } from "./global";
export interface BlockListApi {
	get({
		page,
		page_size,
		sort_key,
		sort_direction,
		movie_ids,
		protocols,
	}?: {
		page?: number;
		page_size?: number;
		sort_key?: string;
		sort_direction?: Direction;
		movie_ids?: number[];
		protocols?: Protocol[];
	}): Promise<unknown>;
	movie(movie_id: number): Promise<unknown>;
	delete(id: number): Promise<unknown>;
	delete_bulk(body: object): Promise<unknown>;
}
