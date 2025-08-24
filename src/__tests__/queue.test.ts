import { radson } from "../test_exports";

test.only("Test queue fetch", async () => {
	const r_1 = await radson.get_queue_series_tmdb(119051);
	expect(r_1.status).toBe(200);

	const r_4 = await radson.get_queue_all();
	expect(r_4.status).toBe(200);

	const r_5 = await radson.get_queue_movie_imdb("tt4154796");
	expect(r_5.status).toBe(200);

	const r_6 = await radson.get_queue_movie_tmdb(299534);
	expect(r_6.status).toBe(200);
});

test.only("Test queue delete", async () => {
	// manual
	const r_1 = await radson.delete_queue_series([505836865]);
	expect(r_1.status).toBe(200);
});

test.only("Test search monitored", async () => {
	const r_1 = await radson.search_monitored_series_tmdb(119051);
	expect(r_1.status).toBe(201);

	const r_2 = await radson.search_monitored_movie_imdb("tt5950044");
	expect(r_2.status).toBe(201);
}, 20_000); // 20 secs

test.only("Test queue interactive search", async () => {
	const r_1 = await radson.get_interactive_queue_series_tmdb(119051, 2);
	expect(r_1.status).toBe(200);

	const r_2 = await radson.get_interactive_queue_movie_imdb("tt4154796");
	expect(r_2.status).toBe(200);
}, 20_000); // 20secs

test.only("Test queue interactive post", async () => {
	const d_1 = await radson.get_interactive_queue_series_tmdb(63726, 12);
	const r_1 = await radson.post_interactive_series(d_1.data[0]["guid"], 3);

	expect(r_1.status).toBe(200);
}, 20_000); // 20secs
