# Example of managing users while using the iTwin Viewer and iTwin Platform

This repository contains two examples of how to use the iTwin Viewer with a custom, non-Bentley, IdP while leveraging the iTwin Platform.

There are two distinct ways of handling user identities when building an application with the iTwin Platform; using Bentley identities and managing the identities yourself. This example provides two different implementations for handling managing identities of your application users.

## Client Registration

The first step is to register a new client as a "Service" type in the [iTwin App Registration](https://developer.bentley.com/my-apps/) and add the `Visualization` and `iModels` API Association. This will provide a client id and client secret to use for getting an access token, via a [client credentials workflow](https://developer.bentley.com/apis/overview/authorization/#clientcredentialflow), to access the iTwin Platform.

> Don't forget to add `<CLIENT_ID>@apps.imsoidc.bentley.com` to the iTwin too!

The client secret provided when creating the client is intended to be kept __secret__ and not used client-side. Therefore it is __strongly__ recommend to build a server-side component that manages the secret and avoid having to cache or bundle the secret into your web app. The server-side will hold the client secret created for your application and manages using the token.

## Token Server Implementation

> __Important__: It is strongly recommended that any server-side component is placed behind a layer of authorization and/or authentication that fits your workflow and validates the user has access to what is being requested. However to simplify the example, this server will not be setup with any additional checking and essentially provide an "unprotected" endpoint.

The recommended approach is to use a token server to hold the client id and client secret and provides an endpoint which can be called by an auth client for the iTwin Viewer to get the jwt token required to call the iTwin Platform.

The [README](./token-server/token-server/README.md) for the token server details how to start the server and configure the iTwin Viewer in this repository to use it.

This example is written in Express and Node.js but can be written in any server-side deployment model.

## Proxy Server Implementation

In this method, a proxy server is set up. The job of the proxy server is to verify the token of the user against the non-Bentley Identity Provider (IdP), validating the user's access to the iTwin/iModel, and substituting the Authorization header in the request with the token of the service identity (in this simplified example, the user token and access is not verified). This will have to be done with every iTwin Platform request, so it is imperative that the proxy server is performant.

The proxy-viewer is configured to use the proxy backend instead of iTwin Platform. This is done by configuring the `backendConfiguration` and `hubAccess` props. The `<Viewer>` component requires an auth client. The example creates a `MyAuthClient` that has a dummy access token in it. In practice, this will be the token provided by your app.
