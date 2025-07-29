interface MovieApi {
	get({
		include_recommendations,
		include_trending,
		include_popular,
	}?: {
		include_recommendations?: boolean;
		include_trending?: boolean;
		include_popular?: boolean;
	}): Promise<unknown>;
	post(body: object): Promise<unknown>;
}
export interface ImportListApi {
	movie: MovieApi;
}
