export interface ReleaseApi {
	get({
		series_id,
		episode_id,
		season_number,
	}?: {
		series_id?: number;
		episode_id?: number;
		season_number?: number;
	}): Promise<unknown>;
	post(body: object): Promise<unknown>;
	push(body: object): Promise<unknown>;
}
