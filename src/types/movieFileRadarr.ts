export interface MovieFileApi {
	get(
		id?: number,
		{
			movie_id,
			movie_file_ids,
		}?: {
			movie_id?: number[];
			movie_file_ids?: number[];
		},
	): Promise<unknown>;
	put(body: object, id: number): Promise<unknown>;
	put_bulk(body: object): Promise<unknown>;
	delete(id: number): Promise<unknown>;
	delete_bulk(body: object): Promise<unknown>;
}
