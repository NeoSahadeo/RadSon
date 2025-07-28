export interface EpisodeApi {
	get(): Promise<unknown>;
	put(): Promise<unknown>;
	monitor(): Promise<unknown>;
}
