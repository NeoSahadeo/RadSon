export interface ReleaseProfileApi {
	post(body: object): Promise<unknown>;
	get(id?: number): Promise<unknown>;
	delete(id: number): Promise<unknown>;
	put(body: object, id: string): Promise<unknown>;
}
