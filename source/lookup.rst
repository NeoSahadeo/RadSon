Lookup Requests
===============

Methods
-------

.. code-block:: typescript

  async lookup_sonarr_tvdb(id: any)

  async lookup_sonarr_tmdb(id: number)

  async lookup_radarr_tmdb(id: number)

  async lookup_radarr_imdb(id: number)

All lookup methods take in an ID of the respective type.


Example code:

.. code-block:: typescript

  await radson.lookup_sonarr_tvdb(157239)
