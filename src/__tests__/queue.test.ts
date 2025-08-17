import { radson } from "../test_exports";

test.only("Test queue fetch", async () => {
	// manual
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
