import type { Direction } from "./global";
import { RadarrEventType } from "./global";
export interface HistoryApi {
	get({
		page,
		page_size,
		sort_key,
		sort_direction,
		include_movie,
		event_type,
		download_id,
		movies_ids,
		languages,
		quality,
	}?: {
		page?: number;
		page_size?: number;
		sort_key?: string;
		sort_direction?: Direction;
		include_movie?: boolean;
		event_type?: RadarrEventType[];
		download_id?: string;
		movies_ids?: number[];
		languages?: number[];
		quality?: number[];
	}): Promise<unknown>;
	since({
		date,
		event_type,
		include_movie,
	}?: {
		date?: string;
		event_type?: RadarrEventType;
		include_movie?: boolean;
	}): Promise<unknown>;
	movie({
		movie_id,
		event_type,
		include_movie,
	}?: {
		movie_id?: number;
		event_type?: RadarrEventType;
		include_movie?: boolean;
	}): Promise<unknown>;
	failed(id: number): Promise<unknown>;
}
