export interface Dummy {
	ics({
		past_days,
		future_days,
		tags,
		unmonitored,
		premieres_only,
		as_all_day,
	}?: {
		past_days?: number;
		future_days?: number;
		tags?: string;
		unmonitored?: boolean;
		premieres_only?: boolean;
		as_all_day?: boolean;
	}): Promise<unknown>;
}

export interface CalendarApi {
	get(
		id?: number,
		{
			start,
			end,
			unmonitored,
			include_series,
			include_episode_file,
			include_episode_images,
			tags,
		}?: {
			start?: string;
			end?: string;
			unmonitored?: boolean;
			include_series?: boolean;
			include_episode_file?: boolean;
			include_episode_images?: boolean;
			tags?: string;
		},
	): Promise<unknown>;
	sonarr: Dummy;
}
