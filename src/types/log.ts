import type { ApiType } from "./global";

interface UpdateApi {
	get(type: ApiType, file_name?: string): Promise<unknown>;
}

interface FileApi {
	get(type: ApiType, file_name?: string): Promise<unknown>;
	update: UpdateApi;
}
export interface LogApi {
	get(
		type: ApiType,
		{
			page,
			page_size,
			sort_key,
			sort_direction,
			level,
		}?: {
			page?: number;
			page_size?: number;
			sort_key?: string;
			sort_direction?: string;
			level?: string;
		},
	): Promise<unknown>;
	file: FileApi;
}
