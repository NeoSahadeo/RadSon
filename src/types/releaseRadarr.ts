export interface ReleaseApi {
	get(movie_id?: number): Promise<unknown>;
	post(body: object): Promise<unknown>;
	push(body: object): Promise<unknown>;
}
