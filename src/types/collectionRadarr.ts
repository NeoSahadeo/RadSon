export interface CollectionApi {
	get({ id, tmdb_id }: { id?: number; tmdb_id?: number }): Promise<unknown>;
	put(body: object, id?: number): Promise<unknown>;
}
