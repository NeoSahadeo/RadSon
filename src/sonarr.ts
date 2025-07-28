import axios, { AxiosHeaders } from "axios";
import { CalendarApi } from "./types/calendarSonarr";
import { SeriesApi } from "./types/seriesSonarr";
import { WantedApi } from "./types/wantedSonarr";

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
		return await axios.post(endpoint, body, this.get_headers());
	}
	async generic_put(endpoint: string, body: object, id: number | undefined) {
		return await axios.put(endpoint + id, body, this.get_headers());
	}
	async generic_delete(endpoint: string, id?: number | undefined) {
		return await axios.delete(endpoint + (id ? id : ""), this.get_headers());
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
			return this.generic_delete("api/v3/wanted/missing" + query_string);
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
			return this.generic_delete("api/v3/wanted/cutoff" + query_string);
		};
	}
}
export default SonarrApi;
