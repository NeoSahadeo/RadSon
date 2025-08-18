Monitor
=======

Monitoring series and movies will **NOT** start
the search for the request. It will just add it to
the tracked items.


Methods
-------

.. code-block:: typescript

	async monitor_series_tvdb (id: any, monitor?: boolean, seasons?: number[])

	async monitor_series_tmdb = async (id: any, monitor?: boolean, seasons?: number[])

	async monitor_movie_tmdb = (id: any, monitor?: boolean)

	async monitor_movie_imdb = async (id: any, monitor?: boolean)

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
