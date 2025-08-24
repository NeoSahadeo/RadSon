Queue
#####

Get the current its in the queue.


GET Methods
***********

Get Items in Queue
==================

.. code-block:: typescript

	async get_queue_series_tvdb (id?: number)

	async get_queue_series_tmdb (id?: number)

	async get_queue_movie_tmdb (id?: number)

	async get_queue_movie_imdb (id?: any)

	async get_queue_all ()


.. note::

	 Leaving the ID empty (null) means get all of that type
	 from the queue.


Example code:

.. code-block:: typescript

	radson.get_queue_series_tmdb(119051);

	radson.get_queue_all();

	radson.get_queue_movie_imdb("tt4154796");

	radson.get_queue_movie_tmdb(299534);

.. _is:

Interactive Search
==================

The interactive search is used to get torrent links, below how to send
post requests `Using interactive search results`_.

.. code-block:: typescript

	async get_interactive_queue_series_tmdb (id: number, season: number)

	async get_interactive_queue_series_tvdb (id: number, season: number)

	async get_interactive_queue_movie_tmdb (id: number)

	async get_interactive_queue_movie_imdb (id: any)


DELETE Methods
**************

The IDs refers to the internal mappings of the queue.
They cannot be known without first quering what is in
the queue.

.. code-block:: typescript

	async delete_queue_series (ids: number[])

	async delete_queue_movie (ids: number[])

Example Code:

.. code-block:: typescript

	radson.delete_queue_series([505836865]); // 505836865 is the internal id of one of the queue items.

POST Methods
************

There is 1 POST method provided. This is a generic command
to search for the monitored series / movie.

Monitored Search
================

These methods will start the search and download of monitored series.

.. code-block:: typescript

	async search_monitored_series_tmdb (id: number)

	async search_monitored_series_tvdb (id: number)

	async search_monitored_movie_tmdb (id: number)

	async search_monitored_movie_imdb (id: any)


.. _isr:

Using interactive search results
================================


.. code-block:: typescript

	async post_interactive_series (guid: string, indexer_id: number)

	async post_interactive_movie (guid: string, indexer_id: number)


In order to use the results of the `Interactive Search`_
one will need to send a **POST** request like it is shown below.
It works the same for both Radarr and Sonarr.
This will start the download for the request torrent.

A globally unique identifier, and the indexer id.
The GUID is the magnet link, and the indexer id will depend
on how Prowlarr is setup.

A get request must first be sent (`Interactive Search`_) to cache to values.
Once that is done one can call the following method.



Example code:

.. code-block:: typescript

	const reponse = await radson.get_interactive_queue_series_tmdb(63726, 12);
	await radson.post_interactive_series(response.data[0]["guid"], response.data[0]["indexerId"]);
