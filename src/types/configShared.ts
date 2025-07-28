import type { ApiType } from "./global";

interface DownloadClientApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	put(type: ApiType, body: object, id: number): Promise<unknown>;
}
interface HostApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	put(type: ApiType, body: object, id: number): Promise<unknown>;
}
interface ImportListApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	put(type: ApiType, body: object, id: number): Promise<unknown>;
}
interface IndexerApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	put(type: ApiType, body: object, id: number): Promise<unknown>;
}
interface MediaManagementApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	put(type: ApiType, body: object, id: number): Promise<unknown>;
}
interface NamingApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	put(type: ApiType, body: object, id: number): Promise<unknown>;
	// examples will be put in the respective folders
}
interface UiApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	put(type: ApiType, body: object, id: number): Promise<unknown>;
}

export interface ConfigApi {
	downloadclient: DownloadClientApi;
	host: HostApi;
	importlist: ImportListApi;
	indexer: IndexerApi;
	mediamanagement: MediaManagementApi;
	naming: NamingApi;
	ui: UiApi;
}
