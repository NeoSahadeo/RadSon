import type { ApiType } from "./global";
export interface FileSystemApi {
	get({
		type,
		path,
		include_files,
		allow_folder_without_trailing_slashes,
	}: {
		type: ApiType;
		path?: string;
		include_files?: boolean;
		allow_folder_without_trailing_slashes?: boolean;
	}): Promise<unknown>;
	type(type: ApiType, path?: string): Promise<unknown>;
	media_files(type: ApiType, path?: string): Promise<unknown>;
}
