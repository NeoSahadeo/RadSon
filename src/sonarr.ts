import axios, { AxiosHeaders } from "axios";
import { CalendarApi } from "./types/calendarSonarr";
import { SeriesApi } from "./types/seriesSonarr";
import { WantedApi } from "./types/wantedSonarr";
import { EpisodeApi } from "./types/episodeSonarr";
import { EpisodeFileApi } from "./types/episodeFileSonarr";
import { HistoryApi } from "./types/historySonarr";
import { SonarrEventType } from "./types/global";
import { LocalizationApi } from "./types/localizationSonarr";
import { ImportListExclusionApi } from "./types/importListExclusionSonarr";
import { ReleaseApi } from "./types/releaseSonarr";
import { ReleaseProfileApi } from "./types/releaseProfileSonarr";
import { QueueApi } from "./types/queueSonarr";
import { BlockListApi } from "./types/blocklistSonarr";
import { ManualImportApi } from "./types/manualImportSonarr";

/**
 * SonarrApi class is the sonarr endpoint where sonarr specific endpoints
 * can be used
 *
 * @param sonarr_api_key
 * @param sonarr_addr - URI for the sonarr server, must end in a slash
 * */
class SonarrApi {
	NAMESPACE: string = "SonarrApi";
	sonarr_api_key: string;
	sonarr_addr: string;

	// endpoints
	calendar: CalendarApi;
	series: SeriesApi;
	wanted: WantedApi;
	episode: EpisodeApi;
	episodefile: EpisodeFileApi;
	history: HistoryApi;
	localization: LocalizationApi;
	importlistexclusion: ImportListExclusionApi;
	manualimport: ManualImportApi;
	release: ReleaseApi;
	releaseprofile: ReleaseProfileApi;
	queue: QueueApi;
	blocklist: BlockListApi;

	// once-off
	config: any;

	constructor({
		sonarr_api_key,
		sonarr_addr,
	}: {
		sonarr_api_key: string;
		sonarr_addr: string;
	}) {
		this.sonarr_api_key = sonarr_api_key;
		this.sonarr_addr = sonarr_addr;

		// register endpoints
		this.calendar = {} as any;
		this.register_calendar();

		this.series = {} as any;
		this.register_series();

		this.wanted = {} as any;
		this.register_wanted();

		this.episode = {} as any;
		this.register_episode();

		this.episodefile = {} as any;
		this.register_episodefile();

		this.history = {} as any;
		this.register_history();

		this.localization = {} as any;
		this.register_localization();

		this.importlistexclusion = {} as any;
		this.register_importlistexclusion();

		this.manualimport = {} as any;
		this.register_manualimport();

		this.release = {} as any;
		this.register_release();

		this.releaseprofile = {} as any;
		this.register_releaseprofile();

		this.manualimport = {} as any;
		this.register_manualimport();

		this.queue = {} as any;
		this.register_queue();

		this.blocklist = {} as any;
		this.register_blocklist();

		// register endpoints once-off
		this.config = {};
		this.register_once_off_config();
	}

	get_headers() {
		return {
			headers: {
				"X-Api-Key": this.sonarr_api_key,
			},
		};
	}

	async generic_get(endpoint: string, id?: number | undefined) {
		return await axios.get(
			this.sonarr_addr + endpoint + (id ? id : ""),
			this.get_headers(),
		);
	}
	async generic_post(endpoint: string, body: object) {
		return await axios.post(
			this.sonarr_addr + endpoint,
			body,
			this.get_headers(),
		);
	}
	async generic_put(endpoint: string, body: object, id: number) {
		return await axios.put(
			this.sonarr_addr + endpoint + id,
			body,
			this.get_headers(),
		);
	}
	async generic_delete(endpoint: string, id?: number | undefined) {
		return await axios.delete(
			this.sonarr_addr + endpoint + (id ? id : ""),
			this.get_headers(),
		);
	}

	register_calendar() {
		const endpoint = "api/v3/calendar";
		this.calendar.get = async (
			id,
			{
				start,
				end,
				unmonitored,
				include_series,
				include_episode_file,
				include_episode_images,
				tags,
			} = {},
		) => {
			if (id) {
				return this.generic_get(endpoint + "/", id);
			}

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
			if (include_series) {
				query_elements.push("includeSeries=" + include_series);
			}
			if (include_episode_file) {
				query_elements.push("includeEpisodeFile=" + include_episode_file);
			}
			if (include_episode_images) {
				query_elements.push("includeEpisodeImages=" + include_episode_images);
			}
			if (tags) {
				query_elements.push("tags=" + tags);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string);
		};
		this.calendar.sonarr.ics = ({
			past_days,
			future_days,
			tags,
			unmonitored,
			premieres_only,
			as_all_day,
		} = {}) => {
			const query_elements = [];
			if (past_days) {
				query_elements.push("pastDays=" + past_days);
			}
			if (future_days) {
				query_elements.push("futureDays=" + future_days);
			}
			if (tags) {
				query_elements.push("tags=" + tags);
			}
			if (unmonitored) {
				query_elements.push("unmonitored=" + unmonitored);
			}
			if (premieres_only) {
				query_elements.push("premieresOnly=" + premieres_only);
			}
			if (as_all_day) {
				query_elements.push("asAllDay=" + as_all_day);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + "/sonarr.ics" + query_string);
		};
	}
	register_series() {
		const endpoint = "api/v3/series";
		this.series.get = ({ tvdb_id, include_season_images, id } = {}) => {
			if (id) {
				return this.generic_get(endpoint + "/", id);
			}

			const query_elements = [];
			if (tvdb_id) {
				query_elements.push("tvdbId=" + tvdb_id);
			}
			if (include_season_images) {
				query_elements.push("includeSeasonImages=" + include_season_images);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string);
		};
		this.series.post = (body) => this.generic_post(endpoint, body);
		this.series.put = async (id, body, move_files) => {
			return axios.put(
				this.sonarr_addr + endpoint + "/" + id + move_files !== undefined
					? "?moveFiles=" + move_files
					: "",
				body,
				this.get_headers(),
			);
		};
		this.series.delete = (
			id,
			{ delete_files, add_import_list_exclusion } = {},
		) => {
			const query_elements = [];
			if (delete_files) {
				query_elements.push("deleteFiles=" + delete_files);
			}
			if (add_import_list_exclusion) {
				query_elements.push(
					"addImportListExclusion=" + add_import_list_exclusion,
				);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_delete(endpoint + "/" + query_string, id);
		};
		this.series.folder = (id) => {
			return this.generic_get(endpoint + "/" + id + "/folder");
		};
		this.series.lookup = (term) => {
			return this.generic_get(
				endpoint + "/lookup" + term !== undefined ? "?term=" + term : "",
			);
		};
		this.series.import = (body) =>
			this.generic_post(endpoint + "/import", body);
		this.series.editor.put = async (body) => {
			return axios.put(this.sonarr_addr + endpoint, body, this.get_headers());
		};
		this.series.editor.delete = async (body) => {
			const url = this.sonarr_addr + endpoint;
			const headers = this.get_headers() as any as AxiosHeaders;
			return await axios({
				url,
				headers,
				method: "DELETE",
				data: body,
			});
		};
	}

	register_wanted() {
		this.wanted.missing = (
			id?: number,
			{
				page,
				page_size,
				sort_key,
				sort_direction,
				include_series,
				include_images,
				monitored,
			} = {},
		) => {
			if (id) {
				return this.generic_get("api/v3/wanted/missing/", id);
			}
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
				query_elements.push("sortDirection=" + sort_direction);
			}
			if (include_series) {
				query_elements.push("includeSeries=" + include_series);
			}
			if (include_images) {
				query_elements.push("includeImages=" + include_images);
			}
			if (monitored) {
				query_elements.push("monitored=" + monitored);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get("api/v3/wanted/missing" + query_string);
		};
		this.wanted.cutoff = (
			id?: number,
			{
				page,
				page_size,
				sort_key,
				sort_direction,
				include_series,
				include_images,
				include_episode_file,
				monitored,
			} = {},
		) => {
			if (id) {
				return this.generic_get("api/v3/wanted/missing/", id);
			}
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
				query_elements.push("sortDirection=" + sort_direction);
			}
			if (include_series) {
				query_elements.push("includeSeries=" + include_series);
			}
			if (include_images) {
				query_elements.push("includeImages=" + include_images);
			}
			if (include_episode_file) {
				query_elements.push("includeEpisodeFile=" + include_episode_file);
			}
			if (monitored) {
				query_elements.push("monitored=" + monitored);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get("api/v3/wanted/cutoff" + query_string);
		};
	}

	seasonpass(body: object): Promise<unknown> {
		return this.generic_post("api/v3/seasonpass/", body);
	}

	register_episode() {
		const endpoint = "api/v3/episode";
		this.episode.get = async (
			id,
			{
				series_id,
				series_number,
				episode_ids,
				episode_file_id,
				include_series,
				include_episode_file,
				include_images,
			} = {},
		) => {
			if (id) {
				return this.generic_get(endpoint + "/", id);
			}
			const query_elements = [];
			if (series_id) {
				query_elements.push("seriesId=" + series_id);
			}
			if (series_number) {
				query_elements.push("seriesNumber=" + series_number);
			}
			if (episode_ids) {
				episode_ids.forEach((e) => {
					query_elements.push("episodeIds=" + e);
				});
			}
			if (episode_file_id) {
				query_elements.push("episodeFileId=" + episode_file_id);
			}
			if (include_episode_file) {
				query_elements.push("includeEpisodeFile=" + include_episode_file);
			}
			if (include_series) {
				query_elements.push("includeSeries=" + include_series);
			}
			if (include_images) {
				query_elements.push("includeImages=" + include_images);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string);
		};
		this.episode.put = (...args) => this.generic_put(endpoint + "/", ...args);
		this.episode.monitor = async (body, include_images) => {
			await axios.put(
				this.sonarr_addr + endpoint + "/monitor" + include_images !== undefined
					? "?includeImages=" + include_images
					: "",
				body,
				this.get_headers(),
			);
		};
	}
	register_episodefile() {
		const endpoint = "api/v3/episodefile";
		this.episodefile.get = async (id, { series_id, episode_file_ids } = {}) => {
			if (id) {
				return this.generic_get(endpoint + "/", id);
			}
			const query_elements = [];
			if (series_id) {
				query_elements.push("seriesId=" + series_id);
			}
			if (episode_file_ids) {
				episode_file_ids.forEach((e) => {
					query_elements.push("episodeFileIds=" + e);
				});
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string);
		};
		this.episodefile.put = (body, id) =>
			this.generic_put(endpoint + "/", body, id as any);
		this.episodefile.put_bulk = async (body) => {
			return await axios.put(
				this.sonarr_addr + endpoint + "/bulk/",
				body,
				this.get_headers(),
			);
		};
		this.episodefile.delete = (id) => this.generic_delete(endpoint, id);
		this.episodefile.delete_bulk = (body) => {
			const url = this.sonarr_addr + endpoint + "/bulk/";
			const headers = this.get_headers() as any as AxiosHeaders;
			return axios({
				url,
				headers,
				data: body,
				method: "DELETE",
			});
		};
		this.episodefile.editor = async (body) => {
			return await axios.put(
				this.sonarr_addr + endpoint + "/editor/",
				body,
				this.get_headers(),
			);
		};
	}

	register_history() {
		const endpoint = "api/v3/history";
		this.history.get = ({
			page,
			page_size,
			sort_key,
			sort_direction,
			include_series,
			include_episode,
			event_type,
			episode_id,
			download_id,
			series_ids,
			languages,
			quality,
		} = {}) => {
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
				query_elements.push("sortDirection=" + sort_direction);
			}
			if (include_episode) {
				query_elements.push("includeEpisode=" + include_episode);
			}
			if (include_series) {
				query_elements.push("includeSeries=" + include_series);
			}
			if (event_type) {
				event_type.forEach((e: SonarrEventType) => {
					query_elements.push("eventType=" + e);
				});
			}
			if (episode_id) {
				query_elements.push("episodeId=" + event_type);
			}
			if (download_id) {
				query_elements.push("downloadId=" + event_type);
			}
			if (series_ids) {
				series_ids.forEach((e) => {
					query_elements.push("seriesIds=" + e);
				});
			}
			if (languages) {
				languages.forEach((e) => {
					query_elements.push("languages=" + e);
				});
			}
			if (quality) {
				quality.forEach((e) => {
					query_elements.push("quality=" + e);
				});
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string);
		};
		this.history.since = ({
			date,
			event_type,
			include_series,
			include_episode,
		} = {}) => {
			const query_elements = [];
			if (date) {
				query_elements.push("date=" + date);
			}
			if (event_type) {
				query_elements.push("eventType=" + event_type);
			}
			if (include_series) {
				query_elements.push("includeSeries=" + include_series);
			}
			if (include_episode) {
				query_elements.push("includeEpisode=" + include_episode);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + "/since" + query_string);
		};
		this.history.series = ({
			series_id,
			season_number,
			event_type,
			include_series,
			include_episode,
		} = {}) => {
			const query_elements = [];
			if (series_id) {
				query_elements.push("seriesId=" + series_id);
			}
			if (season_number) {
				query_elements.push("seasonNumber=" + season_number);
			}
			if (event_type) {
				query_elements.push("eventType=" + event_type);
			}
			if (include_series) {
				query_elements.push("includeSeries=" + include_series);
			}
			if (include_episode) {
				query_elements.push("includeEpisode=" + include_episode);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + "/series" + query_string);
		};
		this.history.failed = (id) => {
			return this.generic_delete(endpoint + "/failed/", id);
		};
	}

	mediacover(series_id: number, filename: string) {
		return this.generic_get("api/v3/mediacover/" + series_id + "/" + filename);
	}

	register_localization() {
		const endpoint = "api/v3/localization/";
		this.localization.get = (id) => this.generic_get(endpoint, id);
		this.localization.language = () => this.generic_get(endpoint + "language/");
	}

	languageprofile(id: number) {
		return this.generic_get("api/v3/languageprofile/", id);
	}

	register_importlistexclusion() {
		const endpoint = "api/v3/importlistexclusion/";
		this.importlistexclusion.get = (id) => this.generic_get(endpoint, id);
		this.importlistexclusion.post = (body) => this.generic_post(endpoint, body);
		this.importlistexclusion.put = (...args) =>
			this.generic_put(endpoint, ...args);
		this.importlistexclusion.delete = (id) => this.generic_delete(endpoint, id);
		this.importlistexclusion.delete_bulk = async (body) => {
			const url = endpoint + "bulk/";
			const headers = this.get_headers() as any as AxiosHeaders;
			return await axios({
				url,
				headers,
				method: "DELETE",
				data: body,
			});
		};
		this.importlistexclusion.paged = (
			id,
			{ page, page_size, sort_key, sort_direction } = {},
		) => {
			if (id) {
				return this.generic_get(endpoint + "/", id);
			}

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
				query_elements.push("sortDirection=" + sort_direction);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + "paged" + query_string);
		};
	}

	rename({
		series_id,
		season_number,
	}: {
		series_id?: number;
		season_number?: number;
	} = {}) {
		const query_elements = [];
		if (series_id) {
			query_elements.push("seriesId=" + series_id);
		}
		if (season_number) {
			query_elements.push("seasonNumber=" + season_number);
		}

		let query_string = "";
		if (query_elements.length > 0) {
			query_string = "?" + query_elements.join("&");
		}
		return this.generic_get("api/v3/rename" + query_string);
	}

	register_manualimport() {
		const endpoint = "api/v3/manualimport";
		this.manualimport.get = ({
			folder,
			download_id,
			series_id,
			season_number,
			filter_existing_files,
		} = {}) => {
			const query_elements = [];
			if (folder) {
				query_elements.push("folder=" + folder);
			}
			if (download_id) {
				query_elements.push("downloadId=" + download_id);
			}
			if (filter_existing_files) {
				query_elements.push("filterExistingFiles=" + filter_existing_files);
			}
			if (series_id) {
				query_elements.push("seriesId=" + series_id);
			}
			if (season_number) {
				query_elements.push("seasonNumber=" + season_number);
			}

			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string);
		};
		this.manualimport.post = (body) => this.generic_post(endpoint, body);
	}

	register_once_off_config() {
		this.config.naming.examples = async ({
			rename_episodes,
			replace_illegal_characters,
			colon_replacement_format,
			custom_colon_replacement_format,
			multi_episode_style,
			standard_episode_format,
			daily_episode_format,
			anime_episode_format,
			series_folder_format,
			season_folder_format,
			specials_folder_format,
			id,
			resource_name,
		}: {
			rename_episodes?: boolean;
			replace_illegal_characters?: boolean;
			colon_replacement_format?: number;
			custom_colon_replacement_format?: string;
			multi_episode_style?: number;
			standard_episode_format?: string;
			daily_episode_format?: string;
			anime_episode_format?: string;
			series_folder_format?: string;
			season_folder_format?: string;
			specials_folder_format?: string;
			id?: number;
			resource_name?: string;
		} = {}) => {
			const query_elements = [];

			if (rename_episodes) {
				query_elements.push("renameEpisodes=" + rename_episodes);
			}
			if (replace_illegal_characters) {
				query_elements.push(
					"replaceIllegalCharacters=" + replace_illegal_characters,
				);
			}
			if (colon_replacement_format) {
				query_elements.push(
					"colonReplacementFormat=" + colon_replacement_format,
				);
			}
			if (custom_colon_replacement_format) {
				query_elements.push(
					"customColonReplacementFormat=" + custom_colon_replacement_format,
				);
			}
			if (multi_episode_style) {
				query_elements.push("multiEpisodeStyle=" + multi_episode_style);
			}
			if (standard_episode_format) {
				query_elements.push("standardEpisodeFormat=" + standard_episode_format);
			}
			if (daily_episode_format) {
				query_elements.push("dailyEpisodeFormat=" + daily_episode_format);
			}
			if (anime_episode_format) {
				query_elements.push("animeEpisodeFormat=" + anime_episode_format);
			}
			if (series_folder_format) {
				query_elements.push("seriesFolderFormat=" + series_folder_format);
			}
			if (season_folder_format) {
				query_elements.push("seasonFolderFormat=" + season_folder_format);
			}
			if (specials_folder_format) {
				query_elements.push("specialsFolderFormat=" + specials_folder_format);
			}
			if (id) {
				query_elements.push("id=" + id);
			}
			if (resource_name) {
				query_elements.push("resourceName=" + resource_name);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get("api/v3/config/naming/examples" + query_string);
		};
	}

	register_release() {
		const endpoint = "api/v3/release";
		this.release.get = ({ series_id, episode_id, season_number } = {}) => {
			const query_elements = [];
			if (series_id) {
				query_elements.push("seriesId=" + series_id);
			}
			if (episode_id) {
				query_elements.push("episodeId=" + episode_id);
			}
			if (season_number) {
				query_elements.push("seasonNumber=" + season_number);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string);
		};
		this.release.post = (body) => this.generic_post(endpoint, body);
		this.release.push = (body) => this.generic_post(endpoint + "/push/", body);
	}

	register_releaseprofile() {
		// might move to shared
		const endpoint = "api/v3/releaseprofile/";
		this.releaseprofile.get = (...args) => this.generic_get(endpoint, ...args);
		this.releaseprofile.post = (...args) =>
			this.generic_post(endpoint, ...args);
		this.releaseprofile.put = (body, id) =>
			this.generic_put(endpoint, body, id as any);
		this.releaseprofile.delete = (...args) =>
			this.generic_delete(endpoint, ...args);
	}

	register_queue() {
		const endpoint = "api/v3/queue";
		this.queue.delete = async (
			id,
			{ remove_from_client, blocklist, skip_redownload, change_category } = {},
		) => {
			const query_elements = [];
			if (remove_from_client) {
				query_elements.push("removeFromClient=" + remove_from_client);
			}
			if (blocklist) {
				query_elements.push("blocklist=" + blocklist);
			}
			if (skip_redownload) {
				query_elements.push("skipRedownload=" + skip_redownload);
			}
			if (change_category) {
				query_elements.push("changeCategory=" + change_category);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_delete(endpoint + "/" + id + query_string);
		};
		this.queue.delete_bulk = async (
			body,
			{ remove_from_client, blocklist, skip_redownload, change_category } = {},
		) => {
			const query_elements = [];
			if (remove_from_client) {
				query_elements.push("removeFromClient=" + remove_from_client);
			}
			if (blocklist) {
				query_elements.push("blocklist=" + blocklist);
			}
			if (skip_redownload) {
				query_elements.push("skipRedownload=" + skip_redownload);
			}
			if (change_category) {
				query_elements.push("changeCategory=" + change_category);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}

			const url = this.sonarr_addr + endpoint + "/bulk" + query_string;
			const headers = this.get_headers() as any as AxiosHeaders;
			return await axios({
				url,
				headers,
				method: "DELETE",
				data: body,
			});
		};
		this.queue.get = ({
			page,
			page_size,
			sort_key,
			sort_direction,
			include_unknown_series_items,
			include_series,
			include_episode,
			series_ids,
			protocol,
			languages,
			quality,
			status,
		} = {}) => {
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
				query_elements.push("sortDirection=" + sort_direction);
			}
			if (include_unknown_series_items) {
				query_elements.push(
					"includeUnknownSeriesItems=" + include_unknown_series_items,
				);
			}
			if (include_series) {
				query_elements.push("includeSeries=" + include_series);
			}
			if (include_episode) {
				query_elements.push("includeEpisode=" + include_episode);
			}
			if (series_ids) {
				series_ids.forEach((e) => {
					query_elements.push("seriesIds=" + e);
				});
			}
			if (protocol) {
				query_elements.push("protocol=" + protocol);
			}
			if (languages) {
				languages.forEach((e) => {
					query_elements.push("languages=" + e);
				});
			}
			if (quality) {
				quality.forEach((e) => {
					query_elements.push("quality=" + e);
				});
			}
			if (status) {
				status.forEach((e) => {
					query_elements.push("status=" + e);
				});
			}

			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string);
		};
		this.queue.grab = async (id) => {
			return await axios.post(
				endpoint + "/grab/" + id,
				undefined,
				this.get_headers(),
			);
		};
		this.queue.grab_bulk = (body) => {
			return this.generic_post(endpoint + "/grab/bulk/", body);
		};
		this.queue.details = ({
			series_id,
			episode_ids,
			include_series,
			include_episode,
		} = {}) => {
			const query_elements = [];

			if (series_id) {
				query_elements.push("seriesIds=" + series_id);
			}
			if (include_series) {
				query_elements.push("includeSeries=" + include_series);
			}
			if (include_episode) {
				query_elements.push("includeEpisode=" + include_episode);
			}
			if (episode_ids) {
				episode_ids.forEach((e) => {
					query_elements.push("episodeIds=" + e);
				});
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + "/details" + query_string);
		};
		this.queue.status = () => this.generic_get(endpoint + "/status");
	}

	register_blocklist() {
		const endpoint = "api/v3/blocklist";
		this.blocklist.get = ({
			page,
			page_size,
			sort_key,
			sort_direction,
			series_ids,
			protocols,
		} = {}) => {
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
			if (series_ids && series_ids.length > 0) {
				series_ids.forEach((e) => {
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
			return this.generic_get(endpoint + query_string);
		};
		this.blocklist.delete = (id) => {
			return this.generic_delete(endpoint + "/", id);
		};
		this.blocklist.delete_bulk = async (body) => {
			const url = this.sonarr_addr + endpoint + "/bulk";
			const headers = this.get_headers() as any as AxiosHeaders;
			return await axios({
				url,
				method: "DELETE",
				headers,
				data: body,
			});
		};
	}
}
export default SonarrApi;
