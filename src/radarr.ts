import axios, { AxiosHeaders } from "axios";
import { MovieApi } from "./types/movieRadarr";
import { MovieFileApi } from "./types/movieFileRadarr";
import { BlockListApi } from "./types/blockListRadarr";
import { CollectionApi } from "./types/collectionRadarr";
import { HistoryApi } from "./types/historyRadarr";
import { RadarrEventType } from "./types/global";
import { ExclusionApi } from "./types/exclusionsRadarr";
import { ImportListApi } from "./types/importListRadarr";
import { ConfigApi } from "./types/configRadarr";
import { ManualImportApi } from "./types/manualImportRadarr";
import { ReleaseApi } from "./types/releaseRadarr";
import { ReleaseProfileApi } from "./types/releaseProfileRadarr";
import { QueueApi } from "./types/queueRadarr";

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

	// endpoints
	movie: MovieApi;
	moviefile: MovieFileApi;
	blocklist: BlockListApi;
	collection: CollectionApi;
	history: HistoryApi;
	exclusion: ExclusionApi;
	importlist: ImportListApi;
	config: ConfigApi; // once-off
	manualimport: ManualImportApi;
	release: ReleaseApi;
	releaseprofile: ReleaseProfileApi;
	queue: QueueApi;

	constructor({
		radarr_api_key,
		radarr_addr,
	}: {
		radarr_api_key: string;
		radarr_addr: string;
	}) {
		this.radarr_api_key = radarr_api_key;
		this.radarr_addr = radarr_addr;

		// register endpoints
		this.movie = {} as any;
		this.register_movie();

		this.moviefile = {} as any;
		this.register_moviefile();

		this.blocklist = {} as any;
		this.register_blocklist();

		this.collection = {} as any;
		this.register_collection();

		this.history = {} as any;
		this.register_history();

		this.exclusion = {} as any;
		this.register_exclusion();

		this.importlist = {} as any;
		this.register_importlist();

		this.config = {} as any;
		this.register_config();

		this.manualimport = {} as any;
		this.register_manualimport();

		this.release = {} as any;
		this.register_release();

		this.releaseprofile = {} as any;
		this.register_releaseprofile();

		this.queue = {} as any;
		this.register_queue();

		// register endpoints once-off
		this.config = {} as any;
		this.register_once_off_config();
	}
	get_headers() {
		return {
			headers: {
				"X-Api-Key": this.radarr_api_key,
			},
		};
	}

	async generic_get(endpoint: string, id?: number | undefined) {
		return await axios.get(
			this.radarr_addr + endpoint + (id ? id : ""),
			this.get_headers(),
		);
	}
	async generic_post(endpoint: string, body: object) {
		return await axios.post(
			this.radarr_addr + endpoint,
			body,
			this.get_headers(),
		);
	}
	async generic_put(endpoint: string, body: object, id: number) {
		return await axios.put(
			this.radarr_addr + endpoint + id,
			body,
			this.get_headers(),
		);
	}
	async generic_delete(endpoint: string, id?: number | undefined) {
		return await axios.delete(
			this.radarr_addr + endpoint + (id ? id : ""),
			this.get_headers(),
		);
	}

	register_movie() {
		const endpoint = "api/v3/movie";
		this.movie.get = async (
			id,
			{ tmdb_id, exclude_local_covers, language_id } = {},
		) => {
			if (id) {
				return this.generic_get(endpoint + "/", id);
			}

			const query_elements = [];
			if (tmdb_id) {
				query_elements.push("tmdbId=" + tmdb_id);
			}
			if (exclude_local_covers) {
				query_elements.push("excludeLocalCovers=" + exclude_local_covers);
			}
			if (language_id) {
				query_elements.push("languageId=" + language_id);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string);
		};
		this.movie.post = (body) => this.generic_post(endpoint, body);
		this.movie.put = async (body, id, move_files) => {
			return await axios.put(
				this.radarr_addr + endpoint + "/" + id + move_files !== undefined
					? "?moveFiles=" + move_files
					: "",
				body,
				this.get_headers(),
			);
		};
		this.movie.delete = (id, { delete_files, add_import_exclusion } = {}) => {
			const query_elements = [];
			if (delete_files) {
				query_elements.push("deleteFiles=" + delete_files);
			}
			if (add_import_exclusion) {
				query_elements.push("addImportExclusion=" + add_import_exclusion);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_delete(endpoint + "/" + id + query_string);
		};
		this.movie.folder = (id) =>
			this.generic_get(endpoint + "/" + id + "/folder/");
		this.movie.import = (body) =>
			this.generic_post(endpoint + "/import/", body);
		this.movie.lookup.get = (term) =>
			this.generic_get(endpoint + "/lookup?term=" + term);
		this.movie.lookup.tmdb = (tmdb_id) =>
			this.generic_get(endpoint + "/lookup/tmdb?tmdbId=" + tmdb_id);
		this.movie.lookup.imdb = (imdb_id) =>
			this.generic_get(endpoint + "/lookup/imdb?imdbId=" + imdb_id);
	}
	register_moviefile() {
		const endpoint = "api/v3/moviefile";
		this.moviefile.get = (id, { movie_id, movie_file_ids } = {}) => {
			if (id) {
				return this.generic_get(endpoint + "/", id);
			}

			const query_elements: string[] = [];
			if (movie_id) {
				movie_id.forEach((e) => {
					query_elements.push("movieId=" + e);
				});
			}
			if (movie_file_ids) {
				movie_file_ids.forEach((e) => {
					query_elements.push("movieFileIds=" + e);
				});
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string);
		};
		this.moviefile.put = (...args) => this.generic_put(endpoint + "/", ...args);
		this.moviefile.put_bulk = async (body) => {
			return await axios.put(
				this.radarr_addr + endpoint + "/bulk/",
				body,
				this.get_headers(),
			);
		};
		this.moviefile.delete = (id) => this.generic_delete(endpoint + "/", id);
		this.moviefile.delete_bulk = async (body) => {
			const url = this.radarr_addr + endpoint + "/bulk";
			const headers = this.get_headers() as any as AxiosHeaders;
			return await axios({
				url,
				headers,
				method: "DELETE",
				data: body,
			});
		};
	}

	alttitle(
		id?: number,
		{
			movie_id,
			movie_metadata_id,
		}: {
			movie_id?: number;
			movie_metadata_id?: number;
		} = {},
	) {
		const endpoint = "api/v3/alttitle";
		if (id) {
			return this.generic_get(endpoint + "/", id);
		}
		const query_elements = [];
		if (movie_id) {
			query_elements.push("movieId=" + movie_id);
		}
		if (movie_metadata_id) {
			query_elements.push("movieMetadataId=" + movie_metadata_id);
		}
		let query_string = "";
		if (query_elements.length > 0) {
			query_string = "?" + query_elements.join("&");
		}
		return this.generic_get(endpoint + query_string);
	}

	register_blocklist() {
		const endpoint = "api/v3/blocklist";
		this.blocklist.get = ({
			page,
			page_size,
			sort_key,
			sort_direction,
			movie_ids,
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
			if (movie_ids) {
				movie_ids.forEach((e) => {
					query_elements.push("movieIds=" + e);
				});
			}
			if (protocols) {
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
			const url = this.radarr_addr + endpoint + "/bulk";
			const headers = this.get_headers() as any as AxiosHeaders;
			return await axios({
				url,
				method: "DELETE",
				headers,
				data: body,
			});
		};
		this.blocklist.movie = (movie_id) => {
			return this.generic_get(endpoint + "/movie?movieId=" + movie_id);
		};
	}

	register_collection() {
		const endpoint = "api/v3/collection";
		this.collection.get = ({ id, tmdb_id }) => {
			if (id) {
				return this.generic_get(endpoint, id);
			} else {
				return this.generic_get(endpoint + "?tmdbId=" + tmdb_id);
			}
		};
		this.collection.put = async (body, id) => {
			if (id) {
				return await this.generic_put(endpoint + "/", body, id);
			} else {
				return await axios.put(
					this.radarr_addr + endpoint,
					body,
					this.get_headers(),
				);
			}
		};
	}

	credit(
		id?: number,
		{
			movie_id,
			movie_metadata_id,
		}: {
			movie_id?: number;
			movie_metadata_id?: number;
		} = {},
	) {
		if (id) {
			return this.generic_get("api/v3/credit/", id);
		} else {
			const query_elements = [];
			if (movie_id) {
				query_elements.push("movieId=" + movie_id);
			}
			if (movie_metadata_id) {
				query_elements.push("movieMetadataId=" + movie_metadata_id);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get("api/v3/credit" + query_string);
		}
	}

	extrafile(movie_id: number) {
		return this.generic_get(
			"api/v3/extrafile" + movie_id !== undefined ? "?movieId=" + movie_id : "",
		);
	}

	register_history() {
		const endpoint = "api/v3/history";
		this.history.get = ({
			page,
			page_size,
			sort_key,
			sort_direction,
			include_movie,
			event_type,
			download_id,
			movies_ids,
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
			if (include_movie) {
				query_elements.push("includeMovie=" + include_movie);
			}
			if (event_type) {
				event_type.forEach((e: RadarrEventType) => {
					query_elements.push("eventType=" + e);
				});
			}
			if (download_id) {
				query_elements.push("downloadId=" + event_type);
			}
			if (movies_ids) {
				movies_ids.forEach((e) => {
					query_elements.push("movieIds=" + e);
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
		this.history.since = ({ date, event_type, include_movie } = {}) => {
			const query_elements = [];
			if (date) {
				query_elements.push("date=" + date);
			}
			if (event_type) {
				query_elements.push("eventType=" + event_type);
			}
			if (include_movie) {
				query_elements.push("includeMovie=" + include_movie);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + "/since" + query_string);
		};
		this.history.movie = ({ movie_id, event_type, include_movie } = {}) => {
			const query_elements = [];
			if (movie_id) {
				query_elements.push("movieId=" + movie_id);
			}
			if (event_type) {
				query_elements.push("eventType=" + event_type);
			}
			if (include_movie) {
				query_elements.push("includeMovie=" + include_movie);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + "/movie" + query_string);
		};
		this.history.failed = (id) => {
			return this.generic_delete(endpoint + "/failed/", id);
		};
	}

	register_exclusion() {
		const endpoint = "api/v3/exclusion/";
		this.exclusion.get = (id) => this.generic_get(endpoint, id);
		this.exclusion.post = (body) => this.generic_post(endpoint, body);
		this.exclusion.post_bulk = (body) => this.generic_post(endpoint, body);
		this.exclusion.put = (...args) => this.generic_put(endpoint, ...args);
		this.exclusion.delete = (id) => this.generic_delete(endpoint, id);
		this.exclusion.delete_bulk = async (body) => {
			const url = endpoint + "bulk/";
			const headers = this.get_headers() as any as AxiosHeaders;
			return await axios({
				url,
				headers,
				method: "DELETE",
				data: body,
			});
		};
		this.exclusion.paged = (
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

	register_importlist() {
		const endpoint = "api/v3/importlist/movie";
		this.importlist.movie.get = ({
			include_recommendations,
			include_trending,
			include_popular,
		} = {}) => {
			const query_elements = [];
			if (include_recommendations) {
				query_elements.push(
					"includeRecommendations=" + include_recommendations,
				);
			}
			if (include_trending) {
				query_elements.push("includeTrending=" + include_trending);
			}
			if (include_popular) {
				query_elements.push("includePopular=" + include_popular);
			}

			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string);
		};
		this.importlist.movie.post = (body) => this.generic_post(endpoint, body);
	}

	mediacover(movie_id: number, filename: string) {
		this.generic_get("api/v3/mediacover/" + movie_id + "/" + filename);
	}

	register_config() {
		this.config.metadata.get = (id) =>
			this.generic_get("api/v3/config/metadata/", id);
		this.config.metadata.put = (object, id) =>
			this.generic_put("api/v3/config/metadata/", object, id as any);
	}

	register_manualimport() {
		const endpoint = "api/v3/manualimport";
		this.manualimport.get = ({
			folder,
			download_id,
			movie_id,
			filter_existing_files,
		} = {}) => {
			const query_elements = [];
			if (folder) {
				query_elements.push("folder=" + folder);
			}
			if (download_id) {
				query_elements.push("downloadId=" + download_id);
			}
			if (movie_id) {
				query_elements.push("movieId=" + download_id);
			}
			if (filter_existing_files) {
				query_elements.push("filterExistingFiles=" + filter_existing_files);
			}

			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + query_string);
		};
		this.manualimport.post = (body) => this.generic_post(endpoint, body);
	}

	rename({
		movie_id,
	}: {
		movie_id?: number;
	} = {}) {
		return this.generic_get(
			"api/v3/rename" + movie_id !== undefined ? "?movieId=" + movie_id : "",
		);
	}

	register_release() {
		const endpoint = "api/v3/release";
		this.release.get = (movie_id) =>
			this.generic_get(
				endpoint + movie_id !== undefined ? "?movieId=" + movie_id : "",
			);
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

			const url = this.radarr_addr + endpoint + "/bulk" + query_string;
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
			include_unknown_movie_items,
			include_movie,
			movie_ids,
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
			if (include_movie) {
				query_elements.push("includeMovie=" + include_movie);
			}
			if (include_unknown_movie_items) {
				query_elements.push(
					"includeUnknownMovieItems=" + include_unknown_movie_items,
				);
			}
			if (movie_ids) {
				movie_ids.forEach((e) => {
					query_elements.push("movieIds=" + e);
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
		this.queue.details = ({ movie_id, include_movie } = {}) => {
			const query_elements = [];

			if (movie_id) {
				query_elements.push("movieId=" + movie_id);
			}
			if (include_movie) {
				query_elements.push("includeMovie=" + include_movie);
			}
			let query_string = "";
			if (query_elements.length > 0) {
				query_string = "?" + query_elements.join("&");
			}
			return this.generic_get(endpoint + "/details" + query_string);
		};
		this.queue.status = () => this.generic_get(endpoint + "/status");
	}

	register_once_off_config() {
		(this.config as any).naming.examples = async ({
			rename_movies,
			replace_illegal_characters,
			colon_replacement_format,
			custom_colon_replacement_format,
			standard_movie_format,
			movie_folder_format,
			id,
			resource_name,
		}: {
			rename_movies?: boolean;
			replace_illegal_characters?: boolean;
			colon_replacement_format?: number;
			custom_colon_replacement_format?: string;
			standard_movie_format?: string;
			movie_folder_format?: string;
			id?: number;
			resource_name?: string;
		} = {}) => {
			const query_elements = [];

			if (rename_movies) {
				query_elements.push("renameMovies=" + rename_movies);
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
			if (standard_movie_format) {
				query_elements.push("standardMovieFormat=" + standard_movie_format);
			}
			if (movie_folder_format) {
				query_elements.push("movieFolderFormat=" + movie_folder_format);
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
}
export default RadarrApi;
