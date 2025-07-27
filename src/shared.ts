import axios, { AxiosHeaders } from "axios";
import type { AutoTaggingApi } from "./types/autotagging";
import type { ApiType } from "./types/global";
import { IndexerApi } from "./types/indexer";
import { SystemApi } from "./types/system";
import { BlockListApi } from "./types/blocklistShared";
import { CommandApi } from "./types/command";
import { CustomFilterApi } from "./types/customFilter";
import { CustomFormatApi } from "./types/customFormat";

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
	indexer: IndexerApi;
	system: SystemApi;
	blocklist: BlockListApi;
	command: CommandApi;
	customfilter: CustomFilterApi;
	customformat: CustomFormatApi;

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
		this.autotagging = {} as any;
		this.register_autotagging();

		this.indexer = {} as any;
		this.register_indexer();

		this.system = {} as any;
		this.register_system();

		this.blocklist = {} as any;
		this.register_blocklist();

		this.command = {} as any;
		this.register_command();

		this.customfilter = {} as any;
		this.register_customfilter();

		this.customformat = {} as any;
		this.register_customformat();
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
	POST_options(type: ApiType) {
		return {
			headers: {
				"X-Api-Key":
					type === "sonarr" ? this.sonarr_api_key : this.radarr_api_key,
			},
		};
	}
	PUT_options(type: ApiType) {
		return {
			headers: {
				"X-Api-Key":
					type === "sonarr" ? this.sonarr_api_key : this.radarr_api_key,
			},
		};
	}

	get_url(type: ApiType) {
		return type === "sonarr" ? this.sonarr_addr : this.radarr_addr;
	}

	async api(type: ApiType) {
		return await axios.get(this.get_url(type) + "api/", this.GET_options(type));
	}

	async generic_get(endpoint: string, type: ApiType, id?: number | undefined) {
		return await axios.get(
			this.get_url(type) + endpoint + (id ? id : ""),
			this.GET_options(type),
		);
	}
	async generic_post(endpoint: string, type: ApiType, body: object) {
		return await axios.post(
			this.get_url(type) + endpoint,
			body,
			this.POST_options(type),
		);
	}
	async generic_put(
		endpoint: string,
		type: ApiType,
		body: object,
		id: number | undefined,
	) {
		return await axios.put(
			this.get_url(type) + endpoint + id,
			body,
			this.PUT_options(type),
		);
	}
	async generic_delete(
		endpoint: string,
		type: ApiType,
		id?: number | undefined,
	) {
		return await axios.delete(
			this.get_url(type) + endpoint + (id ? id : ""),
			this.DELETE_options(type),
		);
	}

	register_autotagging() {
		const endpoint = "api/v3/autotagging/";
		this.autotagging.get = (...args) => {
			return this.generic_get(endpoint, ...args);
		};
		this.autotagging.post = (...args) => {
			return this.generic_post(endpoint, ...args);
		};
		this.autotagging.put = async (...args) => {
			return this.generic_put(endpoint, ...args);
		};
		this.autotagging.delete = async (...args) => {
			return this.generic_delete(endpoint, ...args);
		};
		this.autotagging.schema = (...args) => {
			return this.generic_get(endpoint + "schema/", ...args);
		};
	}

	diskspace(type: ApiType) {
		return this.generic_get("api/v3/diskspace/", type);
	}

	register_indexer() {
		const endpoint = "api/v3/indexer/";
		this.indexer.get = (...args) => {
			return this.generic_get(endpoint, ...args);
		};
		this.indexer.post = async (...args) => {
			return this.generic_post(endpoint, ...args);
		};
		this.indexer.schema = (...args) => {
			return this.generic_get(endpoint + "schema/", ...args);
		};
		this.indexer.put = (...args) => {
			return this.generic_put(endpoint, ...args);
		};
		this.indexer.delete = (...args) => {
			return this.generic_delete(endpoint, ...args);
		};
		this.indexer.put_bulk = async (type, body) => {
			return await axios.put(
				this.get_url(type) + endpoint + "bulk/",
				body,
				this.PUT_options(type),
			);
		};
		this.indexer.delete_bulk = async (type, body) => {
			const url = this.get_url(type) + endpoint + "bulk/";
			const headers = this.DELETE_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "DELETE",
				headers,
				data: body,
			});
		};
		this.indexer.test = async (type, body, force_test) => {
			return this.generic_post(
				endpoint +
				"test" +
				(force_test !== undefined ? "?forceTest=" + force_test : "/"),
				type,
				body,
			);
		};
		this.indexer.test_all = async (type) => {
			const url = this.get_url(type) + "testall/";
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "POST",
				headers,
			});
		};
		this.indexer.action = async (type, body, name) => {
			const url = this.get_url(type) + "action/" + name;
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "POST",
				headers,
				data: body,
			});
		};
	}

	register_system() {
		const endpoint = "api/v3/system/";
		this.system.backup.get = (...args) => {
			return this.generic_get(endpoint + "backup/", ...args);
		};
		this.system.backup.delete = (...args) => {
			return this.generic_delete(endpoint + "backup/", ...args);
		};
		this.system.backup.restore = async (type, id) => {
			const url = this.get_url(type) + "backup/restore/" + id;
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({ url, method: "POST", headers });
		};
		this.system.backup.restore_upload = async (type) => {
			const url = this.get_url(type) + "backup/restore/upload";
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({ url, method: "POST", headers });
		};

		this.system.task = (...args) => {
			return this.generic_get(endpoint + "task/", ...args);
		};
		this.system.status = (...args) => {
			return this.generic_get(endpoint + "status/", ...args);
		};
		this.system.routes = (...args) => {
			return this.generic_get(endpoint + "routes/", ...args);
		};
		this.system.routes_duplicate = (...args) => {
			return this.generic_get(endpoint + "routes/duplicate/", ...args);
		};
		this.system.shutdown = async (type) => {
			const url = this.get_url(type) + "shutdown/";
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({ url, method: "POST", headers });
		};
		this.system.restart = async (type) => {
			const url = this.get_url(type) + "restart/";
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({ url, method: "POST", headers });
		};
	}

	register_blocklist() {
		const endpoint = "api/v3/blocklist";
		this.blocklist.get = ({
			type,
			page,
			page_size,
			sort_key,
			sort_direction,
			series_id,
			protocols,
		}) => {
			const query_elements = [];
			if (page) {
				query_elements.push("page=" + page);
			}
			if (page_size) {
				query_elements.push("pageSize=" + page_size);
			}
			if (sort_key) {
				query_elements.push("sortKey=" + sort_direction);
			}
			if (sort_direction) {
				query_elements.push("sortDirection=" + sort_direction);
			}
			if (series_id && series_id.length > 0) {
				series_id.forEach((e) => {
					query_elements.push("seriesIds=" + e);
				});
			}
			if (protocols && protocols.length > 0) {
				protocols.forEach((e) => {
					query_elements.push("protocols=" + e);
				});
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string, type);
		};
		this.blocklist.delete = (type, id) => {
			return this.generic_delete(endpoint + "/", type, id);
		};
		this.blocklist.delete_bulk = async (type, body) => {
			const url = this.get_url(type) + endpoint + "/bulk";
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "DELETE",
				headers,
				data: body,
			});
		};
	}
	calendar({
		type,
		start,
		end,
		unmonitored,
		tags,
	}: {
		type: ApiType;
		start?: any;
		end?: any;
		unmonitored?: boolean;
		tags?: string;
	}) {
		const endpoint = "api/v3/calendar";
		const query_elements = [];
		if (start) {
			query_elements.push("start=" + start);
		}
		if (end) {
			query_elements.push("end=" + end);
		}
		if (unmonitored) {
			query_elements.push("unmonitored=" + unmonitored);
		}
		if (tags) {
			query_elements.push("tags=" + tags);
		}
		let query_string = "";
		if (query_elements.length > 0) {
			query_string = "?" + query_elements.join("&");
		}
		return this.generic_get(endpoint + query_string, type);
	}

	register_command() {
		const endpoint = "api/v3/command/";
		this.command.get = (...args) => {
			return this.generic_get(endpoint, ...args);
		};
		this.command.post = (...args) => {
			return this.generic_post(endpoint, ...args);
		};
		this.command.delete = (...args) => {
			return this.generic_delete(endpoint, ...args);
		};
	}

	register_customfilter() {
		const endpoint = "api/v3/customfilter/";
		this.customfilter.get = (...args) => {
			return this.generic_get(endpoint, ...args);
		};
		this.customfilter.post = (...args) => {
			return this.generic_post(endpoint, ...args);
		};
		this.customfilter.put = (...args) => {
			return this.generic_put(endpoint, ...args);
		};
		this.customfilter.delete = (...args) => {
			return this.generic_delete(endpoint, ...args);
		};
	}

	register_customformat() {
		const endpoint = "api/v3/customformat/";
		this.customformat.get = (...args) => {
			return this.generic_get(endpoint, ...args);
		};
		this.customformat.post = (...args) => {
			return this.generic_post(endpoint, ...args);
		};
		this.customformat.put = (...args) => {
			return this.generic_put(endpoint, ...args);
		};
		this.customformat.put_bulk = async (type, body) => {
			return await axios.put(
				this.get_url(type) + endpoint + "bulk/",
				body,
				this.PUT_options(type),
			);
		};
		this.customformat.delete = (...args) => {
			return this.generic_delete(endpoint, ...args);
		};
		this.customformat.delete_bulk = async (type, body) => {
			const url = this.get_url(type) + endpoint + "bulk/";
			const headers = this.DELETE_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "DELETE",
				headers,
				data: body,
			});
		};
		this.customformat.schema = (...args) => {
			return this.generic_get(endpoint + "schema/", ...args);
		};
	}
}

export default SharedAPI;
