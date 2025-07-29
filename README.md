# RadSon

A unified Sonarr and Radarr Typescript API.

- Sonarr Api -> https://sonarr.tv/docs/api/
- Radarr Api -> https://radarr.video/docs/api/

# Quickstart

```bash
pnpm i radson
```

All endpoints are accessable via, `SharedApi`, `SonarrApi` and `RadarrApi` respectively.

Some functions are only available on their specific api's, eg: You can't call a movie api on sonarr.

The methods are all named according to the Sonarr and Radarr api docs.

# Documentation

<!-- Website -> -->

Run locally:

```bash
pnpm run docs
```

# Contribution

Contributions are always welcome. Please refer to the references below to see how code should be structured.
Code formatter should be standard prettier for javascript/typescript.

### References

endpoints that are not queried should start with a letter and end in a slash
example:

```typscript
const endpoint = "api/v3/example/"
```

if it has a query than you may ignore the rule

---

endpoints should follow the pattern where if there is a single request type it should be a standalone method, else
it should be a registered.

To register and endpoint add the name of the endpoint to the types folder following camal case. Please cross reference
the type to make sure it does not exist in either radarr, sonarr, shared, or all 3. If it does, please specify which
api the type belongs to, eg customFilterShared.ts, customFilterSonarr.ts

Inside the type, the type should be name xxxxxApi (ending in api).

If a method is a basic put/get/delete/post that doest not have a specific endpoint (api/v3/customfilter/delay) then the method
should just be its name, eg. post(), get()...

Else it should be the name of the endpoint, eg "api/v3/indexer/schema" should be schema()

Once the endpoint type is created, import the type into the appropriate folder and then follow the pattern of

```typescript
this.customformat = {} as any; // the endpoint split
this.register_customformat(); // the register function that will create the methods
```

After that you can start filling out the endpoint methods inside the register function. For example

```typescript
register_autotagging() {
    const endpoint = "api/v3/autotagging/";
    this.autotagging.get = (...args) => {
        return this.generic_get(endpoint, ...args);
    };
}
```

**Words of advice**

To save time and make the code more maintainable please try to use the generic method function (generic_get, generic_post, generic_put, and generic_delete)
to fill out standard method calls.


# Authors

@ NeoSahadeo
