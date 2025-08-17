Missing
=======

Get missing episodes / movies from the request wanted queue.

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
