import axios, { AxiosHeaders } from "axios";
import type { AutoTaggingApi } from "./types/autotagging";
import type { ApiType } from "./types/global";
import { IndexerApi } from "./types/indexer";
import { SystemApi } from "./types/system";
import { BlockListApi } from "./types/blocklistShared";
import { CommandApi } from "./types/command";
import { CustomFilterApi } from "./types/customFilter";
import { CustomFormatApi } from "./types/customFormat";
import { DelayProfileApi } from "./types/delayProfile";
import { WantedApi } from "./types/wantedShared";
import { DownloadClientApi } from "./types/downloadClient";
import { ConfigApi } from "./types/configShared";
import { FileSystemApi } from "./types/fileSystem";
import { ImportListApi } from "./types/importListShared";
import { LocalizationApi } from "./types/localizationShared";
import { LogApi } from "./types/log";
import { TagApi } from "./types/tag";
import { MetadataApi } from "./types/metadata";
import { NotificationApi } from "./types/notification";
import { QualityDefinitionApi } from "./types/qualityDefinition";
import { QualityProfileApi } from "./types/qualityProfile";
import { RemotePathMappingApi } from "./types/remotePathMapping";
import { RootFolderApi } from "./types/rootFolder";

/**
 * SharedAPI class is the shared endpoint where both endpoints
 * correlate to the same fetch request type.
 *
 * @param radarr_api_key
 * @param sonarr_api_key
 * @param sonarr_addr - URI for the sonarr server, must end in a slash
 * @param radarr_addr - URI for the radarr server, must end in a slash
 * */
class SharedApi {
	NAMESPACE: string = "SharedApi";
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
	delayprofile: DelayProfileApi;
	wanted: WantedApi;
	downloadclient: DownloadClientApi;
	config: ConfigApi;
	filesystem: FileSystemApi;
	importlist: ImportListApi;
	localization: LocalizationApi;
	log: LogApi;
	tag: TagApi;
	metadata: MetadataApi;
	notification: NotificationApi;
	qualitydefinition: QualityDefinitionApi;
	qualityprofile: QualityProfileApi;
	remotepathmapping: RemotePathMappingApi;
	rootfolder: RootFolderApi;

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

		this.delayprofile = {} as any;
		this.register_delayprofile();

		this.wanted = {} as any;
		this.register_wanted();

		this.downloadclient = {} as any;
		this.register_downloadclient();

		this.config = {} as any;
		this.register_config();

		this.filesystem = {} as any;
		this.register_filesystem();

		this.importlist = {} as any;
		this.register_importlist();

		this.localization = {} as any;
		this.register_localization();

		this.log = {} as any;
		this.register_log();

		this.tag = {} as any;
		this.register_tag();

		this.metadata = {} as any;
		this.register_metadata();

		this.notification = {} as any;
		this.register_notification();

		this.qualitydefinition = {} as any;
		this.register_qualitydefinition();

		this.qualityprofile = {} as any;
		this.register_qualityprofile();

		this.remotepathmapping = {} as any;
		this.register_remotepathmapping();

		this.rootfolder = {} as any;
		this.register_rootfolder();
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
			const url = this.get_url(type) + endpoint + "testall/";
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "POST",
				headers,
			});
		};
		this.indexer.action = async (type, body, name) => {
			const url = this.get_url(type) + endpoint + "action/" + name;
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
			const url = this.get_url(type) + endpoint + "backup/restore/" + id;
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({ url, method: "POST", headers });
		};
		this.system.backup.restore_upload = async (type) => {
			const url = this.get_url(type) + endpoint + "backup/restore/upload";
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
			const url = this.get_url(type) + endpoint + "shutdown/";
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({ url, method: "POST", headers });
		};
		this.system.restart = async (type) => {
			const url = this.get_url(type) + endpoint + "restart/";
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({ url, method: "POST", headers });
		};
	}

	register_blocklist() {
		const endpoint = "api/v3/blocklist";
		this.blocklist.get = (
			type,
			{ page, page_size, sort_key, sort_direction, series_id, protocols } = {},
		) => {
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
	register_delayprofile() {
		const endpoint = "api/v3/delayprofile/";
		this.delayprofile.get = (...args) => {
			return this.generic_get(endpoint, ...args);
		};
		this.delayprofile.post = (...args) => {
			return this.generic_post(endpoint, ...args);
		};
		this.delayprofile.put = (...args) => {
			return this.generic_put(endpoint, ...args);
		};
		this.delayprofile.reorder = (...args) => {
			return this.generic_put(endpoint + "reorder/", ...args);
		};
		this.delayprofile.delete = (...args) => {
			return this.generic_delete(endpoint, ...args);
		};
	}

	register_wanted() {
		const endpoint = "api/v3/wanted/";
		this.wanted.missing = (...args) => {
			return this.generic_get(endpoint + "missing/", ...args);
		};
		this.wanted.cutoff = (...args) => {
			return this.generic_get(endpoint + "cutoff/", ...args);
		};
	}

	register_downloadclient() {
		const endpoint = "api/v3/downloadclient";
		this.downloadclient.get = (...args) => {
			return this.generic_get(endpoint, ...args);
		};
		this.downloadclient.post = async (type, body, force_save) => {
			return axios.post(
				this.get_url(type) + endpoint + force_save !== undefined
					? "?forceSave=" + force_save
					: "",
				body,
				this.POST_options(type),
			);
		};
		this.downloadclient.put = (type, body, id, force_save) => {
			return axios.put(
				this.get_url(type) + endpoint + "/" + id + force_save !== undefined
					? "?forceSave=" + force_save
					: "",
				body,
				this.PUT_options(type),
			);
		};
		this.downloadclient.put_bulk = (type, body) => {
			return axios.put(
				this.get_url(type) + endpoint,
				body,
				this.PUT_options(type),
			);
		};
		this.downloadclient.delete = (...args) => {
			return this.generic_delete(endpoint, ...args);
		};
		this.downloadclient.delete_bulk = async (type, body) => {
			const url = this.get_url(type) + endpoint + "/bulk/";
			const headers = this.DELETE_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "DELETE",
				headers,
				data: body,
			});
		};
		this.downloadclient.test = (type, body, force_save) => {
			return axios.post(
				this.get_url(type) + endpoint + "/test" + force_save !== undefined
					? "?forceSave=" + force_save
					: "",
				body,
				this.POST_options(type),
			);
		};
		this.downloadclient.test_all = async (type) => {
			const url = this.get_url(type) + endpoint + "/testall/";
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "POST",
				headers,
			});
		};
		this.downloadclient.action = async (type, body, name) => {
			const url = this.get_url(type) + endpoint + "/action/" + name;
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "POST",
				headers,
				data: body,
			});
		};
		this.downloadclient.schema = (...args) => {
			return this.generic_get(endpoint + "/schema/", ...args);
		};
	}
	register_config() {
		const endpoint = "api/v3/config/";
		this.config.downloadclient.get = (...args) =>
			this.generic_get(endpoint + "downloadclient/", ...args);
		this.config.downloadclient.put = (...args) =>
			this.generic_put(endpoint + "downloadclient/", ...args);

		this.config.ui.get = (...args) =>
			this.generic_get(endpoint + "ui/", ...args);
		this.config.ui.put = (...args) =>
			this.generic_put(endpoint + "ui/", ...args);

		this.config.host.get = (...args) =>
			this.generic_get(endpoint + "host/", ...args);
		this.config.host.put = (...args) =>
			this.generic_put(endpoint + "host/", ...args);

		this.config.naming.get = (...args) =>
			this.generic_get(endpoint + "naming/", ...args);
		this.config.naming.put = (...args) =>
			this.generic_put(endpoint + "naming/", ...args);

		this.config.indexer.get = (...args) =>
			this.generic_get(endpoint + "indexer/", ...args);
		this.config.indexer.put = (...args) =>
			this.generic_put(endpoint + "indexer/", ...args);

		this.config.importlist.get = (...args) =>
			this.generic_get(endpoint + "importlist/", ...args);
		this.config.importlist.put = (...args) =>
			this.generic_put(endpoint + "importlist/", ...args);

		this.config.mediamanagement.get = (...args) =>
			this.generic_get(endpoint + "mediamanagement/", ...args);
		this.config.mediamanagement.put = (...args) =>
			this.generic_put(endpoint + "mediamanagement/", ...args);
	}

	register_filesystem() {
		const endpoint = "api/v3/filesystem";
		this.filesystem.get = (
			type,
			{ path, include_files, allow_folder_without_trailing_slashes } = {},
		) => {
			const query_elements = [];
			if (path) {
				query_elements.push("path=" + path);
			}
			if (include_files) {
				query_elements.push("includeFiles=" + include_files);
			}
			if (allow_folder_without_trailing_slashes) {
				query_elements.push(
					"allowFoldersWithoutTrailingSlashes=" +
					allow_folder_without_trailing_slashes,
				);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string, type);
		};
		this.filesystem.type = (type, path) => {
			return this.generic_get(
				endpoint + "/type" + path !== undefined ? "?path=" + path : "",
				type,
			);
		};
		this.filesystem.media_files = (type, path) => {
			return this.generic_get(
				endpoint + "/mediafiles" + path !== undefined ? "?path=" + path : "",
				type,
			);
		};
	}
	health(type: ApiType) {
		return this.generic_get("api/v3/health/", type);
	}
	register_importlist() {
		const endpoint = "api/v3/importlist";
		this.importlist.get = (...args) =>
			this.generic_get(endpoint + "/", ...args);

		this.importlist.post = async (type, body, force_save) => {
			return axios.post(
				this.get_url(type) + endpoint + force_save !== undefined
					? "?forceSave=" + force_save
					: "",
				body,
				this.POST_options(type),
			);
		};
		this.importlist.put = (type, body, id, force_save) => {
			return axios.put(
				this.get_url(type) + endpoint + "/" + id + force_save !== undefined
					? "?forceSave=" + force_save
					: "",
				body,
				this.PUT_options(type),
			);
		};
		this.importlist.put_bulk = (type, body) => {
			return axios.put(
				this.get_url(type) + endpoint,
				body,
				this.PUT_options(type),
			);
		};
		this.importlist.delete = (...args) => {
			return this.generic_delete(endpoint, ...args);
		};
		this.importlist.delete_bulk = async (type, body) => {
			const url = this.get_url(type) + endpoint + "/bulk/";
			const headers = this.DELETE_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "DELETE",
				headers,
				data: body,
			});
		};
		this.importlist.test = (type, body, force_save) => {
			return axios.post(
				this.get_url(type) + endpoint + "/test" + force_save !== undefined
					? "?forceSave=" + force_save
					: "",
				body,
				this.POST_options(type),
			);
		};
		this.importlist.test_all = async (type) => {
			const url = this.get_url(type) + endpoint + "/testall/";
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "POST",
				headers,
			});
		};
		this.importlist.action = async (type, body, name) => {
			const url = this.get_url(type) + endpoint + "/action/" + name;
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "POST",
				headers,
				data: body,
			});
		};
		this.importlist.schema = (...args) => {
			return this.generic_get(endpoint + "/schema/", ...args);
		};
	}

	indexerflag(type: ApiType) {
		return this.generic_get("api/v3/indexerflag/", type);
	}

	language(type: ApiType, id?: number) {
		return this.generic_get("api/v3/language/", type, id);
	}

	register_localization() {
		const endpoint = "api/v3/localization/";
		this.localization.get = (...args) => this.generic_get(endpoint, ...args);
		this.localization.language = (type: ApiType) =>
			this.generic_get(endpoint, type);
	}

	register_log() {
		const endpoint = "api/v3/log";
		this.log.get = (
			type,
			{ page, page_size, sort_key, sort_direction, level } = {},
		) => {
			const query_elements = [];
			if (page) {
				query_elements.push("page=" + page);
			}
			if (page_size) {
				query_elements.push("pageSize=" + page_size);
			}
			if (sort_key) {
				query_elements.push("sortKey=" + sort_key);
			}
			if (sort_direction) {
				query_elements.push("sortDirection=" + sort_key);
			}
			if (level) {
				query_elements.push("level=" + level);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string, type);
		};
		this.log.file.get = async (type, file_name) => {
			const url =
				this.get_url(type) + endpoint + "/file" + file_name !== undefined
					? "/" + file_name
					: "";
			const headers = this.GET_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				headers,
				method: "GET",
			});
		};
		this.log.file.update.get = async (type, file_name) => {
			const url =
				this.get_url(type) + endpoint + "/file/update" + file_name !== undefined
					? "/" + file_name
					: "";
			const headers = this.GET_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				headers,
				method: "GET",
			});
		};
	}

	update(type: ApiType) {
		return this.generic_get("api/v3/update/", type);
	}

	register_tag() {
		const endpoint = "api/v3/tag/";
		this.tag.get = (...args) => this.generic_get(endpoint, ...args);
		this.tag.post = (...args) => this.generic_post(endpoint, ...args);
		this.tag.put = (...args) => this.generic_put(endpoint, ...args);
		this.tag.delete = (...args) => this.generic_delete(endpoint, ...args);
	}

	register_metadata() {
		const endpoint = "api/v3/metadata";
		this.metadata.get = (...args) => this.generic_get(endpoint, ...args);
		//
		this.metadata.post = async (type, body, force_save) => {
			return axios.post(
				this.get_url(type) + endpoint + force_save !== undefined
					? "?forceSave=" + force_save
					: "",
				body,
				this.POST_options(type),
			);
		};
		this.metadata.put = (type, body, id, force_save) => {
			return axios.put(
				this.get_url(type) + endpoint + "/" + id + force_save !== undefined
					? "?forceSave=" + force_save
					: "",
				body,
				this.PUT_options(type),
			);
		};
		this.metadata.delete = (...args) => {
			return this.generic_delete(endpoint, ...args);
		};
		this.metadata.test = (type, body, force_save) => {
			return axios.post(
				this.get_url(type) + endpoint + "/test" + force_save !== undefined
					? "?forceSave=" + force_save
					: "",
				body,
				this.POST_options(type),
			);
		};
		this.metadata.test_all = async (type) => {
			const url = this.get_url(type) + endpoint + "/testall/";
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "POST",
				headers,
			});
		};
		this.metadata.action = async (type, body, name) => {
			const url = this.get_url(type) + endpoint + "/action/" + name;
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "POST",
				headers,
				data: body,
			});
		};
		this.metadata.schema = (...args) => {
			return this.generic_get(endpoint + "/schema/", ...args);
		};
	}

	register_notification() {
		const endpoint = "api/v3/notification";
		this.notification.get = (...args) => this.generic_get(endpoint, ...args);
		//
		this.notification.post = async (type, body, force_save) => {
			return axios.post(
				this.get_url(type) + endpoint + force_save !== undefined
					? "?forceSave=" + force_save
					: "",
				body,
				this.POST_options(type),
			);
		};
		this.notification.put = (type, body, id, force_save) => {
			return axios.put(
				this.get_url(type) + endpoint + "/" + id + force_save !== undefined
					? "?forceSave=" + force_save
					: "",
				body,
				this.PUT_options(type),
			);
		};
		this.notification.delete = (...args) => {
			return this.generic_delete(endpoint, ...args);
		};
		this.notification.test = (type, body, force_save) => {
			return axios.post(
				this.get_url(type) + endpoint + "/test" + force_save !== undefined
					? "?forceSave=" + force_save
					: "",
				body,
				this.POST_options(type),
			);
		};
		this.notification.test_all = async (type) => {
			const url = this.get_url(type) + endpoint + "/testall/";
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "POST",
				headers,
			});
		};
		this.notification.action = async (type, body, name) => {
			const url = this.get_url(type) + endpoint + "/action/" + name;
			const headers = this.POST_options(type) as any as AxiosHeaders;
			return await axios({
				url,
				method: "POST",
				headers,
				data: body,
			});
		};
		this.notification.schema = (...args) => {
			return this.generic_get(endpoint + "/schema/", ...args);
		};
	}

	async parse(type: ApiType, title?: string, path?: string) {
		const query_elements = [];
		if (title) {
			query_elements.push("title=" + title);
		}
		if (path) {
			query_elements.push("path=" + path);
		}
		let query_string = "";
		if (query_elements.length > 0) {
			query_string = "?" + query_elements.join("&");
		}
		const url = "api/v3/parse" + query_string;
		const headers = this.GET_options(type) as any as AxiosHeaders;
		return await axios({
			url,
			headers,
			method: "GET",
		});
	}

	register_qualitydefinition() {
		const endpoint = "api/v3/qualitydefinition/";
		this.qualitydefinition.get = (...args) =>
			this.generic_get(endpoint, ...args);
		this.qualitydefinition.put = (...args) =>
			this.generic_put(endpoint, ...args);
		this.qualitydefinition.update = async (type, body) => {
			return axios.put(
				this.get_url(type) + endpoint + "update/",
				body,
				this.PUT_options(type),
			);
		};
		this.qualitydefinition.limits = (...args) =>
			this.generic_get(endpoint + "limits/", ...args);
	}

	register_qualityprofile() {
		const endpoint = "api/v3/qualityprofile/";
		this.qualityprofile.get = (...args) => this.generic_get(endpoint, ...args);
		this.qualityprofile.post = (...args) =>
			this.generic_post(endpoint, ...args);
		this.qualityprofile.put = (...args) => this.generic_put(endpoint, ...args);
		this.qualityprofile.delete = (...args) =>
			this.generic_delete(endpoint, ...args);
		this.qualityprofile.schema = (type) => this.generic_get(endpoint, type);
	}

	register_remotepathmapping() {
		const endpoint = "api/v3/remotepathmapping/";
		this.remotepathmapping.get = (...args) =>
			this.generic_get(endpoint, ...args);
		this.remotepathmapping.post = (...args) =>
			this.generic_post(endpoint, ...args);
		this.remotepathmapping.put = (...args) =>
			this.generic_put(endpoint, ...args);
		this.remotepathmapping.delete = (...args) =>
			this.generic_delete(endpoint, ...args);
	}

	register_rootfolder() {
		const endpoint = "api/v3/rootfolder/";
		this.rootfolder.get = (...args) => this.generic_get(endpoint, ...args);
		this.rootfolder.post = (...args) => this.generic_post(endpoint, ...args);
		this.rootfolder.delete = (...args) =>
			this.generic_delete(endpoint, ...args);
	}
}

export default SharedApi;
