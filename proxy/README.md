# Express Server

This Express Server acts as a proxy for calling the iTwin Platform from a specific iTwin Viewer.

To configure a viewer for a localhost version of this backend, use the following settings 

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

## Client Registration

OIDC configuration
  Don't forget to add <CLIENT_ID>@apps.imsoidc.bentley.com to your CONNECT project too!

Your CLIENT_ID and CLIENT_SECRET should both come from the [iTwin App Registration](https://developer.bentley.com/my-apps/) - be sure to create a "Service" type of client
with the 'Visualization' API associations.
