import { radson } from "../test_exports";

test("Test Movie and Series Lookups", async () => {
	const r_1 = await radson.fetch_local_data("series", "tmdb", 157289);
	// console.log(r_1.data);
	expect(r_1.status).toBe(200);
});
