import SharedAPI from "../shared";
import SonarrApi from "../sonarr";
import RadarrApi from "../radarr";

let api: SharedAPI;
let sonarr: SonarrApi;
let radarr: RadarrApi;

beforeAll(() => {
	sonarr = new SonarrApi({
		sonarr_addr: "http://localhost:8989/",
		sonarr_api_key: "3b0b523d29bc4df1baf30dbb2d5d6c48",
	});
	// api = new SharedAPI({
	// 	sonarr_addr: "http://localhost:8989/",
	// 	radarr_addr: "http://localhost:7878/",
	// 	sonarr_api_key: "3b0b523d29bc4df1baf30dbb2d5d6c48",
	// 	radarr_api_key: "4f2a6fc3453f4106a75159ab987ae3eb",
	// });
});

test("get", async () => {
	const response = await sonarr.generic_get("api/");
	expect(response.status).toEqual(200);
});

test("lookup", async () => {
	const response = (await sonarr.series.lookup("tmdbId:119051")) as any;
	expect(response.status).toEqual(200);
});

// test("api", async () => {
// 	const sonarr = await api.api("sonarr");
// 	const radarr = await api.api("radarr");
// 	expect(sonarr.data).toStrictEqual({
// 		current: "v3",
// 		deprecated: [],
// 	});
// 	expect(radarr.data).toStrictEqual({
// 		current: "v3",
// 		deprecated: [],
// 	});
// });
//
// test("autotagging_get", async () => {
// 	const sonarr_get: any = await api.autotagging.get("sonarr");
// 	const radarr_radarr: any = await api.autotagging.get("radarr");
// 	expect(sonarr_get.status).toBe(200);
// 	expect(radarr_radarr.status).toBe(200);
// });
//
// test("autotagging_post", async () => {
// 	const sonarr_post: any = await api.autotagging.post(
// 		"sonarr",
// 		JSON.parse(
// 			`{ "removeTagsAutomatically": false, "tags": [1], "name": "test", "specifications": [{ "implementation": "StatusSpecification", "implementationName": "Status", "negate": false, "required": false, "fields": [{ "order": 0, "name": "status", "label": "Status", "value": 1, "type": "select", "advanced": false, "selectOptions": [{ "value": -1, "name": "Deleted", "order": -1 }, { "value": 0, "name": "Continuing", "order": 0 }, { "value": 1, "name": "Ended", "order": 1 }, { "value": 2, "name": "Upcoming", "order": 2 }], "privacy": "normal", "isFloat": false }], "id": 3, "name": "x123" }] }`,
// 		),
// 	);
// 	const radarr_post: any = await api.autotagging.post(
// 		"radarr",
// 		JSON.parse(
// 			`{ "removeTagsAutomatically": false, "tags": [1], "name": "test", "specifications": [{ "implementation": "StatusSpecification", "implementationName": "Status", "negate": false, "required": false, "fields": [{ "order": 0, "name": "status", "label": "Status", "value": 1, "type": "select", "advanced": false, "selectOptions": [{ "value": -1, "name": "Deleted", "order": -1 }, { "value": 0, "name": "Continuing", "order": 0 }, { "value": 1, "name": "Ended", "order": 1 }, { "value": 2, "name": "Upcoming", "order": 2 }], "privacy": "normal", "isFloat": false }], "id": 3, "name": "x123" }] }`,
// 		),
// 	);
// 	expect(sonarr_post.status).toBe(201);
// 	expect(radarr_post.status).toBe(201);
// });

// test("autotagging_put", async () => {
// });
//
// test("autotagging_delete", async () => {
// });
//
// test("autotagging_schema", async () => {
// });

// test("diskspace", async () => {
// 	const sonarr: any = await api.diskspace("sonarr");
// 	const radarr: any = await api.diskspace("sonarr");
// 	expect(sonarr.status === 200 || `Sonarr: ${sonarr}`).toBe(true);
// 	expect(radarr.status === 200 || `Radarr: ${radarr}`).toBe(true);
// });

// test()
