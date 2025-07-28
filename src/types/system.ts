import type { ApiType } from "./global";
interface SystemBackupApi {
	get(type: ApiType): Promise<unknown>;
	restore(type: ApiType, id: number): Promise<unknown>;
	restore_upload(type: ApiType): Promise<unknown>;
	delete(type: ApiType, id: number): Promise<unknown>;
}

export interface SystemApi {
	task(type: ApiType, id?: number): Promise<unknown>;
	status(type: ApiType): Promise<unknown>;
	routes(type: ApiType): Promise<unknown>;
	routes_duplicate(type: ApiType): Promise<unknown>;
	shutdown(type: ApiType): Promise<unknown>;
	restart(type: ApiType): Promise<unknown>;
	backup: SystemBackupApi;
}
