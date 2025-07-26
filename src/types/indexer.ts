import type { ApiType } from "./global";
export interface IndexerApi {
	get(type: ApiType, id?: number): Promise<unknown>;
	post(type: ApiType, body: object): Promise<unknown>;
	put(type: ApiType, body: object, id: number): Promise<unknown>;
	put_bulk(type: ApiType, body: object): Promise<unknown>;
	delete(type: ApiType, id: number): Promise<unknown>;
	delete_bulk(type: ApiType, body: object): Promise<unknown>;
	schema(type: ApiType): Promise<unknown>;
	test(type: ApiType, body: object, force_test?: boolean): Promise<unknown>;
	test_all(type: ApiType): Promise<unknown>;
	action(type: ApiType, body: object, name: string): Promise<unknown>;
}
