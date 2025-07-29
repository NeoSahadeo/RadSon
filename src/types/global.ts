export type ApiType = "sonarr" | "radarr";
export type Direction = "default" | "ascending" | "descending";
export type Protocol = "unknown" | "usenet" | "torrent";
export type SonarrEventType =
	| "unknown"
	| "grabbed"
	| "seriesFolderImported"
	| "downloadFolderImported"
	| "downloadFailed"
	| "episodeFileDeleted"
	| "episodeFileRenamed"
	| "downloadIgnored";
export type StatusType =
	| "unknown"
	| "queued"
	| "paused"
	| "downloading"
	| "completed"
	| "failed"
	| "warning"
	| "delay"
	| "downloadClientUnavailable"
	| "fallbacK";
export type RadarrEventType =
	| "unknown"
	| "grabbed"
	| "downloadFolderImported"
	| "downloadFailed"
	| "movieFileDeleted"
	| "movieFolderImported"
	| "movieFileRenamed"
	| "downloadIgnore";
