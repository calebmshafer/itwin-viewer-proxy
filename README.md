# Example of managing users while using the iTwin Viewer and iTwin Platform

This repository contains examples of how to use the iTwin Viewer with a custom, non-Bentley, Idp while leveraging the iTwin Platform.

There are two distinct ways of handling user identities when building an application with the iTwin Platform; using Bentley identities and managing the identities yourself. This example provides two different implementations for securely handling managing identities of your application users.

## Client Registration

The first step in either implementation is registering a new client id as a "Service" type in the [iTwin App Registration](https://developer.bentley.com/my-apps/) and add the 'Visualization' API Association. This will provide a client id and client secret to use for getting an access token, via a [client credentials workflow](https://developer.bentley.com/apis/overview/authorization/#clientcredentialflow), to access the iTwin Platform.

> Don't forget to add `<CLIENT_ID>@apps.imsoidc.bentley.com` to your Project too!

The client secret provided when creating the client is intended to be kept __secret__ and not used client-side. Therefore it is __strongly__ recommended to follow one of the two approaches to build a server-side component that manages the secret and avoid having to cache or bundle the secret into your web app. The server-side will hold the client secret created for your application and manages using the token.

## Server Side Implementations

> __Important__: It is strongly recommended that any server-side component is placed behind a layer of authorization and/or authentication that fits your workflow and validates the user has access to what is being requested. However to simplify the example, this server will not be setup with any additional checking and essentially provide an "unprotected" endpoint.

The two different implementations;

1. The first approach is to use a proxy server between the end user application (e.g. iTwin Viewer) and the iTwin Platform to forward all requests while swapping out the authentication header when sent to the platform. The proxy server is in charge of taking the incoming request and updating the authentication header with an access token that is generated using the client credentials workflow mentions above.

    The [README](./proxy/README.md) for the proxy server details how to start the server and configure the iTwin Viewer in this repository to use it.

    While this example uses Express and Node, the proxy can be written in any server-side deployment model.

    An iTwin Viewer based app, in [react-viewer](./react-viewer/README.md), is configured to point to the proxy server instead of iTwin Platform directly and removes any required sign-in with a Bentley user account. The changes to the auth client are implemented in [NoSignInIAuthClient.ts](./react-viewer/src/NoSignInIAuthClient.ts).

    This example is using a no-sign-in workflow rather than a different Identity Provider but the concept is the same.

    > Warning: One caveat to this approach, which is handled better in example #2 is that the proxy server will need to emulate any and all calls that need to be made to the iTwin Platform. The only calls that are being currently proxied by this example are ones to the Visualization API and no others.

2. The second approach uses a token server to hold the client id and client secret and provides an endpoint which can be called by an iTwin Viewer to get the jwt token required to call the iTwin Platform.

    The [README](./token-server/README.md) for the token server details how to start the server and configure the iTwin Viewer in this repository to use it.

    As #1, this example is written in Express and Node.js but can be written in any server-side deployment model.

    This approach has a couple advantages over the approach laid out in #1.

    1. Better performance, without the overhead of having to proxy all requests through an additional server that needs to scale and be maintained.
    1. Lower maintenance overhead as the server-side portion doesn't need to always maintain the exact request and response formats that are used and maintained within iTwin.js itself. While providing more APIs without having to implement or mirror what the iTwin Platform.
