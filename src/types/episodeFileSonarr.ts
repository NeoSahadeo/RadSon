export interface EpisodeFileApi {
	get(
		id?: number,
		{
			series_id,
			episode_file_ids,
		}?: {
			series_id?: number;
			episode_file_ids?: number[];
		},
	): Promise<unknown>;
	put(body: object, id: string): Promise<unknown>;
	put_bulk(body: object): Promise<unknown>;
	delete(id: number): Promise<unknown>;
	delete_bulk(body: object): Promise<unknown>;
	editor(body: object): Promise<unknown>;
}
