import { radson } from "../test_exports";

test("Test Movie and Series Lookups", async () => {
	const r_1 = await radson.lookup_sonarr_tvdb(157239);
	const r_2 = await radson.lookup_sonarr_tmdb(157289);
	const r_3 = await radson.lookup_radarr_tmdb(537921);
	const r_4 = await radson.lookup_sonarr_tmdb("tt8785038");
	expect(r_1.status).toBe(200);
	expect(r_2.status).toBe(200);
	expect(r_3.status).toBe(200);
	expect(r_4.status).toBe(200);
});
