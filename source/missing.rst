Missing
=======

Get missing episodes / movies from the request wanted queue.

The sonarr api does not work for individual series id's (as in, looking up
missing series items based on a series id, crazy).

To do this I added a custom ``episode_id`` parameter to the method.
This is the ``seriesId`` for a monitored series.

Methods
-------

.. code-block:: typescript

	async get_missing_series({
		episode_id?: number;
		page?: number;
		page_size?: number;
		sort_key?: string;
		sort_direction?: Direction;
		include_series?: boolean;
		include_images?: boolean;
		include_episode_file?: boolean;
		monitored?: boolean;
	})

	async get_missing_movies({
		page?: number;
		page_size?: number;
		sort_key?: string;
		sort_direction?: Direction;
		include_series?: boolean;
		monitored?: boolean;
	})
