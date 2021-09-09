# Example of managing users while using the iTwin Viewer and iTwin Platform

This repository contains examples of how to use the iTwin Viewer with a custom, non-Bentley, Idp while leveraging the iTwin Platform.

There are two distinct ways of handling user identities when building an application with the iTwin Platform; using Bentley identities and managing the identities yourself. This example provides two different implementations for securely handling managing identities of your application users.

## Client Registration

The first step in either implementation is registering a new client id as a "Service" type in the [iTwin App Registration](https://developer.bentley.com/my-apps/) and add the 'Visualization' API Association. This will provide a client id and client secret to use for getting an access token, via a [client credentials workflow](https://developer.bentley.com/apis/overview/authorization/#clientcredentialflow), to access the iTwin Platform.

> Don't forget to add `<CLIENT_ID>@apps.imsoidc.bentley.com` to your Project too!

The client secret provided when creating the client is intended to be kept secret and not provided client-side. Therefore it is __strongly__ recommended to follow one of the two approaches to build a server-side component that manages the secret and avoid having to cache or bundle the secret into your web app. The server-side will hold the client secret created for your application and manages using the token.

## Server Side Implementations

> __Important__: It is strongly recommended that any server-side component is placed behind a layer of authorization and/or authentication that fits your workflow and validates the user has access to what is being requested. However to simplify the example, this server will not be setup with any additional checking and essentially provide an "unprotected" endpoint.

The two different implementations;

1. A proxy server that sits between the end user application and the iTwin Platform to forward all requests while swapping out the authentication header when sent to the platform. The proxy server is in charge of taking the incoming request and updating the authentication header with an access token that is generated using the client credentials workflow mentions above.

    The [README](./proxy/README.md) for the proxy server details how to start the server and configure the iTwin Viewer in this repository to use it.

    While this example uses Express and Node, the proxy can be written in any server-side deployment model.

    The iTwin Viewer, in [react-viewer](./react-viewer/README.md), can be configured to point to the proxy server and remove any required sign-in with a Bentley user account. This is implemented in in the `NoSignInIAuthClient.ts`.

    This example is using a no-sign-in workflow rather than a different Identity Provider but the concept is the same.

2. A token server that 