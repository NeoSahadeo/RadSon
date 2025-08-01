export interface ManualImportApi {
	get({
		folder,
		download_id,
		series_id,
		season_number,
		filter_existing_files,
	}?: {
		folder?: string;
		download_id?: string;
		series_id?: number;
		season_number?: number;
		filter_existing_files?: boolean;
	}): Promise<unknown>;
	post(body: object): Promise<unknown>;
}
