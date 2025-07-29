import type { Direction } from "./global";
import { SonarrEventType } from "./global";
export interface HistoryApi {
	get({
		page,
		page_size,
		sort_key,
		sort_direction,
		include_series,
		include_episode,
		event_type,
		episode_id,
		download_id,
		series_ids,
		languages,
		quality,
	}?: {
		page?: number;
		page_size?: number;
		sort_key?: string;
		sort_direction?: Direction;
		include_series?: boolean;
		include_episode?: boolean;
		event_type?: SonarrEventType[];
		episode_id?: string;
		download_id?: string;
		series_ids?: number[];
		languages?: number[];
		quality?: number[];
	}): Promise<unknown>;
	since({
		date,
		event_type,
		include_series,
		include_episode,
	}?: {
		date?: string;
		event_type?: SonarrEventType;
		include_series?: boolean;
		include_episode?: boolean;
	}): Promise<unknown>;
	series({
		series_id,
		season_number,
		event_type,
		include_series,
		include_episode,
	}?: {
		series_id?: number;
		season_number?: number;
		event_type?: SonarrEventType;
		include_series?: boolean;
		include_episode?: boolean;
	}): Promise<unknown>;
	failed(id: number): Promise<unknown>;
}
