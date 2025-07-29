interface EditorApi {
	put(body: object): Promise<unknown>;
	delete(body: object): Promise<unknown>;
}
interface LookupApi {
	get(term: string): Promise<unknown>;
	tmdb(tmdb_id: number): Promise<unknown>;
	imdb(imdb_id: number): Promise<unknown>;
}

export interface MovieApi {
	get(
		id?: number,
		{
			tmdb_id,
			exclude_local_covers,
			language_id,
		}?: {
			tmdb_id?: number;
			exclude_local_covers?: boolean;
			language_id?: number;
		},
	): Promise<unknown>;
	post(body: object): Promise<unknown>;
	put(body: object, id: string, move_files?: boolean): Promise<unknown>;
	delete(
		id: number,
		{
			delete_files,
			add_import_exclusion,
		}: {
			delete_files?: boolean;
			add_import_exclusion?: boolean;
		},
	): Promise<unknown>;
	folder(id: number): Promise<unknown>;
	editor: EditorApi;
	import(body: object): Promise<unknown>;
	lookup: LookupApi;
}
