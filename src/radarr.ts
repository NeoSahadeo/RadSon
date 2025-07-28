/**
 * RadarrApi class is the sonarr endpoint where sonarr specific endpoints
 * can be used
 *
 * @param sonarr_api_key
 * @param sonarr_addr - URI for the sonarr server, must end in a slash
 * */
class RadarrApi {
	NAMESPACE: string = "RadarrApi";
	radarr_api_key: string;
	radarr_addr: string;

	constructor({
		radarr_api_key,
		radarr_addr,
	}: {
		radarr_api_key: string;
		radarr_addr: string;
	}) {
		this.radarr_api_key = radarr_api_key;
		this.radarr_addr = radarr_addr;
	}
}
export default RadarrApi;
