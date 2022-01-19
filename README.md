# Example of managing users while using the iTwin Viewer and iTwin Platform

This repository contains examples of how to use the iTwin Viewer with a custom, non-Bentley, Idp while leveraging the iTwin Platform.

There are two distinct ways of handling user identities when building an application with the iTwin Platform; using Bentley identities and managing the identities yourself. This example provides two different implementations for securely handling managing identities of your application users.

## Client Registration

The first step is to register a new client as a "Service" type in the [iTwin App Registration](https://developer.bentley.com/my-apps/) and add the `Visualization` and `iModels` API Association. This will provide a client id and client secret to use for getting an access token, via a [client credentials workflow](https://developer.bentley.com/apis/overview/authorization/#clientcredentialflow), to access the iTwin Platform.

> Don't forget to add `<CLIENT_ID>@apps.imsoidc.bentley.com` to your Project too!

The client secret provided when creating the client is intended to be kept __secret__ and not used client-side. Therefore it is __strongly__ recommend to build a server-side component that manages the secret and avoid having to cache or bundle the secret into your web app. The server-side will hold the client secret created for your application and manages using the token.

## Server Side Implementation

> __Important__: It is strongly recommended that any server-side component is placed behind a layer of authorization and/or authentication that fits your workflow and validates the user has access to what is being requested. However to simplify the example, this server will not be setup with any additional checking and essentially provide an "unprotected" endpoint.


The recommended approach is to use a token server to hold the client id and client secret and provides an endpoint which can be called by an auth client for the iTwin Viewer to get the jwt token required to call the iTwin Platform.

The [README](./token-server/README.md) for the token server details how to start the server and configure the iTwin Viewer in this repository to use it.

This example is written in Express and Node.js but can be written in any server-side deployment model.
