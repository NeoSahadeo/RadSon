Lookup Requests
===============

These methods provide the ability to get the data of a show.

It's split into lookup and fetch, where lookup is general
data from Sonarr and Radarr, and, fetch is local data
from Sonarr and Radarr (local data meaning it contains the
show's internal reference ID and other variances).

Methods
-------

.. code-block:: typescript

  async lookup_sonarr_tvdb(id: any)

  async lookup_sonarr_tmdb(id: number)

  async lookup_radarr_tmdb(id: number)

  async lookup_radarr_imdb(id: number)


.. code-block:: typescript

  async fetch_local_data(type: type, db_type: DBType | "local", id: any)

All lookup methods take in an ID of the respective type.

.. note::

  ``fetch_local_data`` is an internal method that I've decided to
  make available publically, so it requires more effort to use.

  The ID must match the DBType and type union.


Example code:

.. code-block:: typescript

  await radson.lookup_sonarr_tvdb(157239)
