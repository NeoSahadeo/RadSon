Monitor
=======

Monitoring series and movies will **NOT** start
the search for the request. It will just add it to
the tracked items.

For ``monitor_series_individual``, the series has to be already monitored.
The episode id's can be queries by querying the missing episodes in the season.


Methods
-------

.. code-block:: typescript

	async monitor_series_tvdb (id: any, monitor?: boolean, seasons?: number[])

	async monitor_series_tmdb (id: any, monitor?: boolean, seasons?: number[])

	async monitor_movie_tmdb (id: any, monitor?: boolean)

	async monitor_movie_imdb (id: any, monitor?: boolean)

	async monitor_series_individual (episode_ids: number[], monitor: boolean)

.. important::

	Leaving the seasons array empty means either add all or remove all seasons from
	being tracked.


Example code:

.. code-block:: typescript

	radson.monitor_movie_tmdb(1061474, false)

	// add all seasons
	radson.monitor_series_tmdb(119051, true);

	// add just season 2
	radson.monitor_series_tmdb(119051, true, [2]);

	// remove just season 2
	radson.monitor_series_tmdb(119051, false, [2]);
