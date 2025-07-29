export interface LocalizationApi {
	get(id?: number): Promise<unknown>;
	language(): Promise<unknown>;
}
