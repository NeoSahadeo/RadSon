import { radson } from "../test_exports";

test.only("Test missing series", async () => {
	await radson.monitor_series_tmdb(119051, true, [1, 2]);

	const r_1 = await radson.get_missing_series();
	expect(r_1.status).toBe(200);

	// manually test -- or run test twice!
	// const r_2 = await radson.get_missing_series({
	// 	episode_id: (await radson.get_missing_series()).data["records"][0].id,
	// });
	// expect(r_2.status).toBe(200);
});

test.only("Test missing movies", async () => {
	const r_1 = await radson.get_missing_movies();
	expect(r_1.status).toBe(200);
});
