import { Direction, Protocol, SonarrStatusType } from "./global";
export interface QueueApi {
	get({
		page,
		page_size,
		sort_key,
		sort_direction,
		include_unknown_series_items,
		include_series,
		include_episode,
		series_ids,
		protocol,
		languages,
		quality,
		status,
	}?: {
		page?: number;
		page_size?: number;
		sort_key?: string;
		sort_direction?: Direction;
		include_unknown_series_items?: boolean;
		include_series?: boolean;
		include_episode?: boolean;
		series_ids?: number[];
		protocol?: Protocol;
		languages?: number[];
		quality?: number[];
		status?: SonarrStatusType[];
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
		series_id,
		episode_ids,
		include_series,
		include_episode,
	}?: {
		series_id?: number;
		episode_ids?: number[];
		include_series?: boolean;
		include_episode?: boolean;
	}): Promise<unknown>;
	status(): Promise<unknown>;
}
