export interface ManualImportApi {
	get({
		folder,
		download_id,
		movie_id,
		filter_existing_files,
	}: {
		folder?: string;
		download_id?: string;
		movie_id?: number;
		filter_existing_files?: boolean;
	}): Promise<unknown>;
	post(body: object): Promise<unknown>;
}
