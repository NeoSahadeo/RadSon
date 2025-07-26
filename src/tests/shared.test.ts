import SharedAPI from "../shared";

let api: SharedAPI;

beforeAll(() => {
	api = new SharedAPI({
		sonarr_addr: "http://localhost:8989/",
		radarr_addr: "http://localhost:7878/",
		sonarr_api_key: "3b0b523d29bc4df1baf30dbb2d5d6c48",
		radarr_api_key: "4f2a6fc3453f4106a75159ab987ae3eb",
	});
});

test("api", async () => {
	const sonarr = await api.api("sonarr");
	const radarr = await api.api("radarr");
	expect(sonarr.data).toStrictEqual({
		current: "v3",
		deprecated: [],
	});
	expect(radarr.data).toStrictEqual({
		current: "v3",
		deprecated: [],
	});
});

test("autotagging", async () => {
	const sonarr_get = await api.autotagging.get("sonarr");
	const radarr_radarr = await api.autotagging.get("radarr");
	expect(sonarr_get).toBeDefined();
	expect(radarr_radarr).toBeDefined();

	// const sonarr_post;
	// const radarr_post;
	// const sonarr_put;
	// const radarr_put;
});
