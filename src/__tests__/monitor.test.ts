import { radson } from "../test_exports";

test.only("Test monitoring for series", async () => {
	const r_1 = await radson.monitor_series_tvdb(397060, false);
	expect([200, 201, 202]).toContain(r_1.status);

	const r_2 = await radson.monitor_series_tvdb(397060, true);
	expect(r_2.status).toBe(202);

	const r_3 = await radson.lookup_sonarr_tvdb(397060);
	const o_1 = (r_3.data[0]["seasons"] as any[]).filter((e) => !e["monitored"]);
	expect(o_1.length).toBe(0);

	const r_5 = await radson.monitor_series_tmdb(119051, true, [2]);
	expect(r_5.status).toBe(202);

	const r_4 = await radson.monitor_series_tmdb(119051, false);
	expect(r_4.status).toBe(202);

	const r_6 = await radson.lookup_sonarr_tmdb(119051);
	const o_2 = (r_6.data[0]["seasons"] as any[]).filter((e) => !e["monitored"]);
	expect(o_2.length).toBe(r_6.data[0]["seasons"].length);
});

test.only("Test monitoring for movies", async () => {
	const r_2 = await radson.monitor_movie_tmdb(1061474, true);
	expect(r_2.status).toBe(202);

	const r_1 = await radson.monitor_movie_tmdb(1061474, false);
	expect(r_1.status).toBe(202);
});

test.only("Test monitoring invid series", async () => {
	// manual
	const r_1 = await radson.monitor_series_individual([11391], true);
	expect(r_1.status).toBe(202);

	const r_2 = await radson.monitor_series_individual([11391], false);
	expect(r_2.status).toBe(202);
}, 20_000);
