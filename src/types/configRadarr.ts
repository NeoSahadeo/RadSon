interface MetadataApi {
	get(id?: number): Promise<unknown>;
	put(body: object, id: string): Promise<unknown>;
}
export interface ConfigApi {
	metadata: MetadataApi;
}
