Queue
=====

Get the current its in the queue.


GET Methods
-----------

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


DELETE Methods
--------------

The IDs refers to the internal mappings of the queue.
They cannot be known without first quering what is in
the queue.

.. code-block:: typescript

	async delete_queue_series (ids: number[])

	async delete_queue_movie (ids: number[])

Example Code:

.. code-block:: typescript

	radson.delete_queue_series([505836865]); // 505836865 is the internal id of one of the queue items.
