# Proxy Express Server

This Express Server acts as a proxy for calling the iTwin Platform from a specific iTwin Viewer.

## Setup proxy server

Use the CLIENT_ID and CLIENT_SECRET created in the [client registration](../README.md#client-registration) to populate the values in the `.env`.

Run,

- `npm install`
- `npm start`
- Note the port the server starts on, that will be used when configuring the Viewer.
  - The PORT can be configured by setting the `PORT` in the `.env`

## Setup the iTwin Viewer to use the proxy

To configure a viewer for a localhost version of this backend, use the following settings:

```json
{
backend: {
  customBackend: {
    rpcParams: {
      info: {
        title: "general-purpose-imodeljs-backend",
        version: "v2.0"
      },
      uriPrefix: "http://localhost:3001" // This must match the backend url
    }
  }
}
}
```
