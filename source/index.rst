Radson documentation
=======================

Documentation for the Radson API.

.. toctree::
   :glob:

   lookup.rst
   monitor.rst

Getting Started
---------------

To get started install the `Radson`_ package from npm.

.. _Radson: https://www.npmjs.com/package/radson

.. code-block:: typescript

   pnpm i radson


Create the Radson object like this (replace the fields with your servers' and api keys').

.. code-block:: typescript

   const radson = new Radson({
      sonarr_address: "http://localhost:8989",
      sonarr_api_key: "3b0b523d29bc4df1baf30dbb2d5d6c43",
      radarr_address: "http://localhost:7878/",
      radarr_api_key: "4f2a6fc3453f4106a75159ab987ae3e2",
   });

.. note::

   You are able to just instantiate just Sonarr or just Radarr if you would like.
   Just leave the fields blank. eg:

   .. code-block:: typescript

         const radson = new Radson({
            radarr_address: "http://localhost:7878/",
            radarr_api_key: "4f2a6fc3453f4106a75159ab987ae3e2",
         });
