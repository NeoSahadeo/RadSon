export type ApiType = "sonarr" | "radarr";
export type Direction = "default" | "ascending" | "descending";
export type Protocol = "unknown" | "usenet" | "torrent";

export const ParamsMap: Record<string, string> = {
	page: "page",
	page_size: "pageSize",
	sort_key: "sortKey",
	sort_direction: "sortDirection",
	include_series: "includeSeries",
	include_images: "includeImages",
	include_episode_file: "includeEpisodeFile",
	monitored: "monitored",
	episode_ids: "episodeIds",
	episodeFileId: "episodeFileId",
	series_id: "seriesId",
};
