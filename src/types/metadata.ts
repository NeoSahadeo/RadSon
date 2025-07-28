import type { ApiType } from "./global";

export interface MetadataApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	schema(type: ApiType): Promise<unknown>;
	post(type: ApiType, body: object, force_save?: boolean): Promise<unknown>;
	put(
		type: ApiType,
		body: object,
		id: number,
		force_save?: boolean,
	): Promise<unknown>;
	delete(type: ApiType, id: number): Promise<unknown>;
	test(type: ApiType, body: object, force_test?: boolean): Promise<unknown>;
	test_all(type: ApiType): Promise<unknown>;
	action(type: ApiType, body: object, name: string): Promise<unknown>;
}
