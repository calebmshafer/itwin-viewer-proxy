# Example using the iTwin Viewer

The repository contains an example of how to use the iTwin Viewer with a custom, non-Bentley, Idp while leveraging the iTwin Platform.

In this example, a proxy backend server is used to forward all requests to the iTwin Platform using an access token generated via client credentials (details [here](https://developer.bentley.com/apis/overview/authorization/) under the "Client Credential Flow" heading).
The iTwin Viewer in this repository has been modified not require authentication to call the proxy to demonstrate.

There are two parts in this repo:

1. The first is the [proxy server](./proxy/README.md). It is written using an Express server and demonstrates how to handle the incoming requests from an iTwin Viewer, swap out the incoming headers and forward the requests to the iTwin Platform.

    While this example uses Express and Node, the proxy can be written in any server-side deployment model.

1. The second is the iTwin Viewer, in [react-viewer](./react-viewer/README.md), configured to point to the proxy server and remove the need to sign-in with a Bentley account.
