# HTTP Proxy Express Server

This Express Server acts as a proxy for calling the iTwin Platform from a specific iTwin Viewer.

To configure a viewer for a localhost version of this backend, use the following props:

```tsx
backendConfiguration={{
  defaultBackend: 
    {
      config: {
        uriPrefix: "http://localhost:3001"
      }
    },
}}
hubAccess={new FrontendIModelsAccess(
  new IModelsClient({
    api: {
      baseUrl: `http://localhost:3001/imodels`,
    },
  }))}
```

## Overview

This is a simplified example of a proxy server. It uses Typescript, Node, and an Express server. This is not required, in fact, any programming language and server framework should be viable as long as it can act as a proxy server. Performance is key of the proxy server, as all iTwin Platform requests from your application will be routed through the proxy. The example uses a caching mechanism for the service token as an example of a performance improvement that should be considered.

## Client Registration

Register a new client as a "Service" type in the [iTwin App Registration](https://developer.bentley.com/my-apps/) and add the `Visualization` and `iModels` API Association. This will provide a client id and client secret to use for getting an access token, via a [client credentials workflow](https://developer.bentley.com/apis/overview/authorization/#clientcredentialflow), to access the iTwin Platform.

> Don't forget to add `<CLIENT_ID>@apps.imsoidc.bentley.com` to the iTwin too!

The client secret provided when creating the client is intended to be kept __secret__ and not used client-side. Therefore it is __strongly__ recommend to build a server-side component that manages the secret and avoid having to cache or bundle the secret into your web app. The server-side will hold the client secret created for your application and manages using the token.

Place these values in the .env file.

## Build and run locally

- `npm i`
- `npm run dev`

## OIDC configuration

Your CLIENT_ID and CLIENT_SECRET should both come from the [iTwin App Registration](https://developer.bentley.com/my-apps/) - be sure to create a "Service" type of client
with the 'Visualization' API associations.

  >Don't forget to add <CLIENT_ID>@apps.imsoidc.bentley.com to your iTwin!
