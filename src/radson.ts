import axios, { AxiosResponse } from "axios";
import { SonarrConfig } from "./types/sonarrTypes";
import { RadarrConfig } from "./types/radarrTypes";
import { Direction, ParamsMap } from "./types/global";

type RadsonConfig = SonarrConfig | RadarrConfig;

type type = "series" | "movie";
type DBType = "tmdb" | "imdb" | "tvdb";

const normalize_address = (addr: string) => {
	const base = new URL(addr);
	base.pathname = base.pathname.endsWith("/")
		? base.pathname + "api/v3"
		: base.pathname + "/api/v3";
	return base.toString();
};

const prepare_headers = (api_key: string) => {
	return {
		"Content-Type": "application/json",
		accept: "application/json",
		"X-Api-Key": api_key,
	};
};

const prepare_query = (args: IArguments) => {
	return Object.entries(ParamsMap)
		.filter(([key]) => {
			const value = (args[0] as any)[key];
			// To also allow false boolean params like monitored = false to be sent,
			// check explicitly for undefined or null
			return value !== undefined && value !== null;
		})
		.map(([param_key, query_key]) => {
			let value = (args[0] as any)[param_key];
			// If boolean, convert to string lowercase
			if (typeof value === "boolean") {
				value = value.toString().toLowerCase();
			}
			return `${query_key}=${encodeURIComponent(value)}`;
		});
};

export default class Radson {
	sonarr_api_key?: string;
	sonarr_address?: string;
	radarr_api_key?: string;
	radarr_address?: string;

	constructor(config: RadsonConfig) {
		if ("sonarr_api_key" in config && "sonarr_address" in config) {
			this.sonarr_api_key = config.sonarr_api_key;
			this.sonarr_address = normalize_address(config.sonarr_address);
		}
		if ("radarr_api_key" in config && "radarr_address" in config) {
			this.radarr_api_key = config.radarr_api_key;
			this.radarr_address = normalize_address(config.radarr_address);
		}
	}

	async fetch_local_data(type: type, db_type: DBType | "local", id: any) {
		if (db_type === "local") {
			const r = axios.get(
				`${type === "series" ? this.sonarr_address : this.radarr_address}/${type}/${id}`,
				{
					headers: prepare_headers(
						type === "series" ? this.sonarr_api_key! : this.radarr_api_key!,
					),
				},
			);
			return r;
		}

		const r = await axios.get(
			`${type === "series" ? this.sonarr_address : this.radarr_address}/${type}`,
			{
				headers: prepare_headers(
					type === "series" ? this.sonarr_api_key! : this.radarr_api_key!,
				),
			},
		);
		// this endpoint is broken so this is the best fix
		r.data = r.data.filter((e: any) => e[`${db_type}Id`] === id);
		if (r.data.length > 0) {
			r.data = r.data[0];
		}
		return r;
	}

	private async lookup_data(
		type: type,
		db_type: DBType,
		id: number,
		include_id = false,
	) {
		let url = null;
		// retards made this api endpoint. why the hell are
		// the endpoints so different and so random?!
		if (type === "series") {
			if (db_type === "tvdb") {
				url = `${this.sonarr_address}/${type}/lookup?term=${id}`;
			}
			if (db_type === "tmdb") {
				url = `${this.sonarr_address}/${type}/lookup?term=tmdbId:${id}`;
			}
		} else {
			// This also returns a different result for some reason. Literally how is their
			// codebase so garbage???
			if (include_id)
				url = `${this.radarr_address}/${type}/lookup?term=${db_type}Id:${id}`;
			else
				url = `${this.radarr_address}/${type}/lookup/${db_type}?${db_type}Id=${id}`;
		}
		return await axios.get(url as string, {
			headers: prepare_headers(
				type === "series" ? this.sonarr_api_key! : this.radarr_api_key!,
			),
		});
	}

	lookup_sonarr_tmdb = async (id: any) =>
		await this.lookup_data("series", "tmdb", id);
	lookup_sonarr_tvdb = async (id: number) =>
		await this.lookup_data("series", "tvdb", id);
	lookup_radarr_tmdb = async (id: number) =>
		await this.lookup_data("movie", "tmdb", id);
	lookup_radarr_imdb = async (id: number) =>
		await this.lookup_data("movie", "imdb", id);

	private async monitor_series(
		db_type: DBType,
		id: any,
		monitor: boolean,
		seasons: number[],
	) {
		const r = await this.lookup_data("series", db_type, id);
		if (r.status !== 200)
			throw `[Radson Monitor Series] Data status: ${r.status}, id: ${id}, db_type: ${db_type}`;
		const data = { ...r.data[0] };

		if (seasons.length == 0) {
			for (let x = 0; x < data["seasons"].length; x++) {
				data["seasons"][x]["monitored"] = monitor;
			}
		} else {
			if (!data.id) {
				for (let x = 0; x < data["seasons"].length; x++) {
					data["seasons"][x]["monitored"] = false;
				}
			}
			for (let x = 0; x < data["seasons"].length; x++) {
				if (seasons.includes(data["seasons"][x]["seasonNumber"])) {
					data["seasons"][x]["monitored"] = monitor;
				}
			}
		}

		// No id exists on items that
		// have not been previously tracked
		if (!data.id) {
			const root_folder = await axios.get(`${this.sonarr_address}/rootfolder`, {
				headers: prepare_headers(this.sonarr_api_key!),
			});
			if (root_folder.status !== 200)
				throw `[Radson Monitor Series] Root folder status: ${root_folder.status}`;
			data["rootFolderPath"] = root_folder.data[0].path;
			data["addOptions"] = {
				searchForMissingEpisodes: false,
				searchForCutoffUnmetEpisodes: false,
			};
			data["qualityProfileId"] = 1;
			return await axios({
				url: `${this.sonarr_address}/series`,
				data: data,
				method: "POST",
				headers: prepare_headers(this.sonarr_api_key!),
			});
		}
		return await axios({
			url: `${this.sonarr_address}/series/${data.id}`,
			data: data,
			method: "PUT",
			headers: prepare_headers(this.sonarr_api_key!),
		});
	}

	monitor_series_tvdb = async (
		id: any,
		monitor?: boolean,
		seasons?: number[],
	) => await this.monitor_series("tvdb", id, monitor ?? true, seasons ?? []);
	monitor_series_tmdb = async (
		id: any,
		monitor?: boolean,
		seasons?: number[],
	) => await this.monitor_series("tmdb", id, monitor ?? true, seasons ?? []);

	private async monitor_movie(db_type: DBType, id: any, monitor: boolean) {
		let r = await this.lookup_data("movie", db_type, id);
		if (r.status !== 200)
			throw `[Radson Monitor Movie] Data status: ${r.status}, id: ${id}, db_type: ${db_type}`;
		const data = { ...r.data };

		const root_folder = await axios.get(`${this.radarr_address}/rootfolder`, {
			headers: prepare_headers(this.radarr_api_key!),
		});
		if (root_folder.status !== 200)
			throw `[Radson Monitor Series] Root folder status: ${root_folder.status}`;
		data["rootFolderPath"] = root_folder.data[0].path;
		data["qualityProfileId"] = 1;

		await axios({
			url: `${this.radarr_address}/movie`,
			data: data,
			method: "POST",
			headers: prepare_headers(this.radarr_api_key!),
			// why does this function not the same as sonarr? Don't know, seen more logic
			// by climate activists glueing their hands to the roads!
			validateStatus: function(status) {
				return (status >= 200 && status < 300) || status === 400;
			},
		});

		let r_2 = await this.lookup_data("movie", db_type, id, true);
		if (r_2.status !== 200)
			throw `[Radson Monitor Movie] Data status, after d_1: ${r_2.status}, id: ${id}, db_type: ${db_type}`;
		const updated_data = { ...r_2.data[0] };
		updated_data["monitored"] = monitor;
		updated_data["qualityProfileId"] = 1;
		updated_data["path"] = updated_data["folderName"];
		return await axios({
			url: `${this.radarr_address}/movie/${updated_data.id}`,
			data: updated_data,
			method: "PUT",
			headers: prepare_headers(this.radarr_api_key!),
		});
	}

	monitor_movie_tmdb = async (id: any, monitor?: boolean) =>
		this.monitor_movie("tmdb", id, monitor ?? true);
	monitor_movie_imdb = async (id: any, monitor?: boolean) =>
		this.monitor_movie("imdb", id, monitor ?? true);

	async get_missing_series({
		episode_id,
		page,
		page_size,
		sort_key,
		sort_direction,
		include_series,
		include_images,
		monitored,
	}: {
		episode_id?: number;
		page?: number;
		page_size?: number;
		sort_key?: string;
		sort_direction?: Direction;
		include_series?: boolean;
		include_images?: boolean;
		include_episode_file?: boolean;
		monitored?: boolean;
	} = {}) {
		if (episode_id) {
			const data: any[] = [];
			let x = 1;
			for (; ;) {
				const r: any = await this.get_missing_series({
					page: x++,
				});
				r.data["records"].forEach((e: any, i: number) => {
					if (Number(e["seriesId"]) == episode_id) {
						data.push(r.data["records"][i]);
					}
				});

				// The last page has no records :)
				if (r.data["records"].length == 0) {
					break;
				}
			}
			return {
				data: data,
				status: 200,
			};
			// Sonarr does not implement this well and it does not work. Suprising...
			// return await axios.get(
			// 	`${this.sonarr_address}/wanted/missing/${episode_id}`,
			// 	{
			// 		headers: prepare_headers(this.sonarr_api_key!),
			// 	},
			// );
		}

		if (arguments[0] === undefined) {
			return await axios.get(`${this.sonarr_address}/wanted/missing`, {
				headers: prepare_headers(this.sonarr_api_key!),
			});
		}

		const query_params = prepare_query(arguments);
		return await axios.get(
			`${this.sonarr_address}/wanted/missing?${query_params.join("&")}`,
			{
				headers: prepare_headers(this.sonarr_api_key!),
			},
		);
	}

	async get_missing_movies({
		page,
		page_size,
		sort_key,
		sort_direction,
		monitored,
	}: {
		page?: number;
		page_size?: number;
		sort_key?: string;
		sort_direction?: Direction;
		include_series?: boolean;
		monitored?: boolean;
	} = {}) {
		let query_params: any[] = [];
		if (arguments[0] !== undefined) {
			query_params = prepare_query(arguments);
		}
		return await axios.get(
			`${this.radarr_address}/wanted/missing?${query_params.join("&")}`,
			{
				headers: prepare_headers(this.radarr_api_key!),
			},
		);
	}

	private async get_queue(
		type: type | "all",
		db_type?: DBType | null,
		id?: number | null,
		override?: boolean, // specify all data
	) {
		if (override) {
			const _get_series = async () => {
				return await axios.get(`${this.sonarr_address}/queue/details`, {
					headers: prepare_headers(this.sonarr_api_key!),
				});
			};
			const _get_movie = async () => {
				return await axios.get(`${this.radarr_address}/queue/details`, {
					headers: prepare_headers(this.radarr_api_key!),
				});
			};

			const arr = [];
			if (type === "series") {
				arr.push(await _get_series());
			} else if (type === "movie") {
				arr.push(await _get_movie());
			} else {
				arr.push(await _get_series());
				arr.push(await _get_movie());
			}

			let obj = {} as AxiosResponse;
			arr.forEach((e) => (obj = { ...e, ...obj }));
			return obj;
		}

		let id_prefix = "";

		if (id) {
			if (type === "series") {
				id_prefix = "?seriesId=";
			} else if (type === "movie") {
				id_prefix = "?movieId=";
			}
			const r = await this.fetch_local_data(type as type, db_type!, id);
			id = r.data["id"];
		}

		return await axios.get(
			`${type === "series" ? this.sonarr_address : this.radarr_address}/queue/details${id_prefix}${id !== null ? id : ""}`,
			{
				headers: prepare_headers(
					type === "series" ? this.sonarr_api_key! : this.radarr_api_key!,
				),
			},
		);
	}
	get_queue_series_tvdb = async (id?: number) =>
		this.get_queue("series", "tvdb", id ?? null);
	get_queue_series_tmdb = async (id?: number) =>
		this.get_queue("series", "tmdb", id ?? null);
	get_queue_movie_tmdb = async (id?: number) =>
		this.get_queue("movie", "tmdb", id ?? null);
	get_queue_movie_imdb = async (id?: any) =>
		this.get_queue("movie", "imdb", id ?? null);
	get_queue_all = async () => this.get_queue("all", null, null, true);

	private async delete_queue(type: type, ids: number[]) {
		return await axios.delete(
			`${this.sonarr_address}/queue/bulk?removeFromClient=true&blocklist=false&skipRedownload=false&changeCategory=false`,
			{
				data: { ids: ids },
				headers: prepare_headers(
					type === "series" ? this.sonarr_api_key! : this.radarr_api_key!,
				),
			},
		);
	}
	delete_queue_series = async (ids: number[]) =>
		this.delete_queue("series", ids);
	delete_queue_movie = async (ids: number[]) => this.delete_queue("movie", ids);

	private async search_monitored(type: type, db_type: DBType, id: number) {
		const r = await this.fetch_local_data(type, db_type, id);
		id = r.data["id"];

		let command;
		if (type === "series") {
			command = { name: "SeriesSearch", seriesId: id };
		} else {
			command = { name: "MoviesSearch", movieIds: [id] };
		}

		return axios({
			url: `${type === "series" ? this.sonarr_address : this.radarr_address}/command`,
			method: "POST",
			data: command,
			headers: prepare_headers(
				type === "series" ? this.sonarr_api_key! : this.radarr_api_key!,
			),
		});
	}

	search_monitored_series_tmdb = async (id: number) =>
		this.search_monitored("series", "tmdb", id);
	search_monitored_series_tvdb = async (id: number) =>
		this.search_monitored("series", "tmdb", id);
	search_monitored_movie_tmdb = async (id: number) =>
		this.search_monitored("movie", "tmdb", id);
	search_monitored_movie_imdb = async (id: any) =>
		this.search_monitored("movie", "imdb", id);

	private async get_interactive_queue(
		type: type,
		db_type: DBType,
		id: number,
		season?: number,
	) {
		const r = await this.fetch_local_data(type, db_type, id);
		id = r.data["id"];

		let query = "?";
		if (type === "movie") {
			query += `movieId=${id}`;
		} else {
			query += `seriesId=${id}&seasonNumber=${season}`;
		}

		return await axios.get(
			`${type === "series" ? this.sonarr_address : this.radarr_address}/release${query}`,
			{
				headers: prepare_headers(
					type === "series" ? this.sonarr_api_key! : this.radarr_api_key!,
				),
			},
		);
	}

	get_interactive_queue_series_tmdb = async (id: number, season: number) =>
		this.get_interactive_queue("series", "tmdb", id, season);
	get_interactive_queue_series_tvdb = async (id: number, season: number) =>
		this.get_interactive_queue("series", "tvdb", id, season);
	get_interactive_queue_movie_tmdb = async (id: number) =>
		this.get_interactive_queue("movie", "tmdb", id);
	get_interactive_queue_movie_imdb = async (id: any) =>
		this.get_interactive_queue("movie", "imdb", id);

	private async post_interactive(type: type, guid: string, indexer_id: number) {
		return axios({
			url: `${type === "series" ? this.sonarr_address : this.radarr_address}/release`,
			method: "POST",
			headers: prepare_headers(
				type === "series" ? this.sonarr_api_key! : this.radarr_api_key!,
			),
			data: {
				guid: guid,
				indexerId: indexer_id,
			},
		});
	}

	post_interactive_series = async (guid: string, indexer_id: number) =>
		this.post_interactive("series", guid, indexer_id);

	post_interactive_movie = async (guid: string, indexer_id: number) =>
		this.post_interactive("movie", guid, indexer_id);

	async monitor_series_individual(episode_ids: number[], monitor: boolean) {
		return axios({
			url: `${this.sonarr_address}/episode/monitor`,
			method: "PUT",
			headers: prepare_headers(this.sonarr_api_key!),
			data: {
				episodeIds: episode_ids,
				monitored: monitor,
			},
		});
	}
}
