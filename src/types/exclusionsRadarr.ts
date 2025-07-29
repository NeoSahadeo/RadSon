import type { Direction } from "./global";
export interface ExclusionApi {
	get(id: number): Promise<unknown>;
	post(body: object): Promise<unknown>;
	post_bulk(body: object): Promise<unknown>;
	delete(id: number): Promise<unknown>;
	delete_bulk(body: object): Promise<unknown>;
	paged(
		id?: number,
		{
			page,
			page_size,
			sort_key,
			sort_direction,
		}?: {
			page?: number;
			page_size?: number;
			sort_key?: string;
			sort_direction?: Direction;
		},
	): Promise<unknown>;
	put(body: object, id: number): Promise<unknown>;
}
