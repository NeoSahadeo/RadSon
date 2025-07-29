import { Direction, Protocol, StatusType } from "./global";
export interface QueueApi {
	get({
		page,
		page_size,
		sort_key,
		sort_direction,
		include_unknown_movie_items,
		include_movie,
		movie_ids,
		protocol,
		languages,
		quality,
		status,
	}?: {
		page?: number;
		page_size?: number;
		sort_key?: string;
		sort_direction?: Direction;
		include_unknown_movie_items?: boolean;
		include_movie?: boolean;
		movie_ids?: number[];
		protocol?: Protocol;
		languages?: number[];
		quality?: number[];
		status?: StatusType[];
	}): Promise<unknown>;
	delete(
		id: number,
		{
			remove_from_client,
			blocklist,
			skip_redownload,
			change_category,
		}?: {
			remove_from_client?: boolean;
			blocklist?: boolean;
			skip_redownload?: boolean;
			change_category?: boolean;
		},
	): Promise<unknown>;
	delete_bulk(
		body: object,
		{
			remove_from_client,
			blocklist,
			skip_redownload,
			change_category,
		}?: {
			remove_from_client?: boolean;
			blocklist?: boolean;
			skip_redownload?: boolean;
			change_category?: boolean;
		},
	): Promise<unknown>;
	grab(id: number): Promise<unknown>;
	grab_bulk(body: object): Promise<unknown>;
	details({
		movie_id,
		include_movie,
	}?: {
		movie_id?: number;
		include_movie?: boolean;
	}): Promise<unknown>;
	status(): Promise<unknown>;
}
