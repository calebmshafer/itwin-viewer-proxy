# Examples using the iTwin Viewer

The repository contains an example of how to use the iTwin Viewer with a custom, non-Bentley, Idp and still leverage the iTwin Platform.

In this example, we use a proxy backend server to forward all requests using an access token generated via client credentials.

There are two parts in this repo:

1. The first is the [proxy server](./proxy/README.md)). It is written using an Express server and demonstrates how to handle the incoming requests from an iTwin Viewer, swap out the incoming headers and prov

1. The second is the iTwin Viewer, in [react-viewer](./react-viewer/README.md), configured to point to the proxy server.
