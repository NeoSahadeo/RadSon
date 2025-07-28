export interface WantedApi {
	cutoff(
		id?: number,
		{
			page,
			page_size,
			sort_key,
			sort_direction,
			include_series,
			include_images,
			include_episode_file,
			monitored,
		}?: {
			page?: number;
			page_size?: number;
			sort_key?: string;
			sort_direction?: string;
			include_series?: boolean;
			include_images?: boolean;
			include_episode_file?: boolean;
			monitored?: boolean;
		},
	): Promise<unknown>;
	missing(
		id?: number,
		{
			page,
			page_size,
			sort_key,
			sort_direction,
			include_series,
			include_images,
			monitored,
		}?: {
			page?: number;
			page_size?: number;
			sort_key?: string;
			sort_direction?: string;
			include_series?: boolean;
			include_images?: boolean;
			monitored?: boolean;
		},
	): Promise<unknown>;
}
