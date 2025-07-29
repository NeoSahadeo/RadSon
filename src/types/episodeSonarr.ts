export interface EpisodeApi {
	get(
		id?: number,
		{
			series_id,
			series_number,
			episode_ids,
			episode_file_id,
			include_series,
			include_episode_file,
			include_images,
		}?: {
			series_id?: number;
			series_number?: number;
			episode_ids?: number[];
			episode_file_id?: number;
			include_series?: boolean;
			include_episode_file?: boolean;
			include_images?: boolean;
		},
	): Promise<unknown>;
	put(body: object, id: number): Promise<unknown>;
	monitor(body: object, include_images?: boolean): Promise<unknown>;
}
