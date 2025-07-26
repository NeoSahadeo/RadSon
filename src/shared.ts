import axios from "axios";
import type { AutoTaggingApi } from "./types/autotagging";
import type { ApiType } from "./types/global";

/**
 * SharedAPI class is the shared endpoint where both endpoints
 * correlate to the same fetch request type.
 *
 * @param radarr_api_key
 * @param sonarr_api_key
 * @param sonarr_addr - URI for the sonarr server, must end in a slash
 * @param radarr_addr - URI for the radarr server, must end in a slash
 * */
class SharedAPI {
	NAMESPACE: string = "SharedAPI";
	sonarr_api_key: string;
	radarr_api_key: string;
	sonarr_addr: string;
	radarr_addr: string;

	// endpoints
	autotagging: AutoTaggingApi;

	constructor({
		radarr_api_key,
		sonarr_api_key,
		sonarr_addr,
		radarr_addr,
	}: {
		radarr_api_key: string;
		sonarr_api_key: string;
		sonarr_addr: string;
		radarr_addr: string;
	}) {
		this.sonarr_api_key = sonarr_api_key;
		this.radarr_api_key = radarr_api_key;
		this.sonarr_addr = sonarr_addr;
		this.radarr_addr = radarr_addr;

		// register endpoints
		this.autotagging = null as any;
		this.register_autotagging();
	}

	DELETE_options(type: ApiType) {
		return {
			headers: {
				"X-Api-Key":
					type === "sonarr" ? this.sonarr_api_key : this.radarr_api_key,
			},
		};
	}
	GET_options(type: ApiType) {
		return {
			headers: {
				"X-Api-Key":
					type === "sonarr" ? this.sonarr_api_key : this.radarr_api_key,
			},
		};
	}
	POST_options(type: ApiType, body?: JSON) {
		return {
			headers: {
				"X-Api-Key":
					type === "sonarr" ? this.sonarr_api_key : this.radarr_api_key,
			},
			body: JSON.stringify(body),
		};
	}
	PUT_options(type: ApiType, body?: JSON) {
		return {
			headers: {
				"X-Api-Key":
					type === "sonarr" ? this.sonarr_api_key : this.radarr_api_key,
			},
			body: JSON.stringify(body),
		};
	}

	get_url(type: ApiType) {
		return type === "sonarr" ? this.sonarr_addr : this.radarr_addr;
	}

	/**
	 *
	 * Looks like it returns the API version number and a list of deprecated functions
	 * ```json
	 *{
	 *	"current": "v3",
	 *	"deprecated": []
	 *}
	 *```
	 */
	async api(type: ApiType) {
		return await axios.get(this.get_url(type) + "api/", this.GET_options(type));
	}

	register_autotagging() {
		this.autotagging.get = async (type: ApiType, id?: number) => {
			return await axios.get(
				this.get_url(type) + "api/v3/autotagging" + (id ? "/" + id : ""),
				this.GET_options(type),
			);
		};
		this.autotagging.post = async (type: ApiType, body: JSON) => {
			return await axios.post(
				this.get_url(type) + "api/v3/autotagging",
				this.POST_options(type, body),
			);
		};
		this.autotagging.put = async (type: ApiType, body: JSON, id: number) => {
			return await axios.put(
				this.get_url(type) + "api/v3/autotagging/" + id,
				this.PUT_options(type, body),
			);
		};
		this.autotagging.delete = async (type: ApiType, id: number) => {
			return await axios.delete(
				this.get_url(type) + "api/v3/autotagging/" + id,
				this.DELETE_options(type),
			);
		};
		this.autotagging.schema = async (type: ApiType) => {
			return await axios.get(
				this.get_url(type) + "api/v3/autotagging/schema",
				this.GET_options(type),
			);
		};
	}
}

export default SharedAPI;
