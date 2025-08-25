import { radson } from "../test_exports";

test.only("Test Movie and Series Lookups", async () => {
	await radson.monitor_series_tmdb(201992);
	const r_1 = await radson.fetch_local_data("series", "tmdb", 201992);
	// console.log(r_1.data);
	expect(r_1.status).toBe(200);

	// manual
	const r_2 = await radson.fetch_local_data("series", "local", 115);
	expect(r_2.status).toBe(200);
});

test.only("Test get episode", async () => {
	// manual
	const r_1 = await radson.get_episodes(148);
	expect(r_1.status).toBe(200);
});
