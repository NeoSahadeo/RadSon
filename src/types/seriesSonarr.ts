interface EditorApi {
	put(body: object): Promise<unknown>;
	delete(body: object): Promise<unknown>;
}

export interface SeriesApi {
	get({
		tvdb_id,
		include_season_images,
		id,
	}?: {
		tvdb_id?: number;
		include_season_images?: boolean;
		id?: number;
	}): Promise<unknown>;
	post(body: object): Promise<unknown>;
	put(id: string, body: object, move_files?: boolean): Promise<unknown>;
	delete(
		id: number,
		{
			delete_files,
			add_import_list_exclusion,
		}?: {
			delete_files?: boolean;
			add_import_list_exclusion?: boolean;
		},
	): Promise<unknown>;
	folder(id: number): Promise<unknown>;
	import(body: object): Promise<unknown>;
	lookup(term?: string): Promise<unknown>;
	editor: EditorApi;
}
