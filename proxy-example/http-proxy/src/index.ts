import express from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { TokenCache } from "./token-cache";
import { ServiceAuthorizationClient } from "@itwin/service-authorization";
import { PermissionsCache } from "./permissions-cache";
import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error("CLIENT_ID and CLIENT_SECRET are required");
}

// Setup a client using the client credentials workflow.
const authClient = new ServiceAuthorizationClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  scope: "itwins:read imodels:read realitydata:read imodelaccess:read",
  authority: "https://ims.bentley.com",
});

// Some cacheing services
const tokenCache = new TokenCache(authClient);
const permissionsCache = new PermissionsCache();



// The express server app
const app = express();

/* 
* This example code captures all iTwin Platform requests and handles them here. 
* Includes a stub to check user's permissions to the requested iTwin/iModel.
* In practice, there should be a different handler for each type of request. 
* This will allow a developer to reliably get the iTwin/iModel ID from the request. 
* Whether those Ids are in the body, query params, or path of the request.*/
app.use(async (req, res, next) => {
  try {

    // It is very important for this code to be performant. 
    // All iTwin Platform requests will be routed through the proxy.
    // Consider caching the permissions (as demoed in the tokenCache) and other performance enhancements
    // Ideally, the processing in this proxy should be <50ms.
    const iTwinId = "iTwinId"; // Retrieved from the request.
    const userAuthorized = await permissionsCache.getPermissions(
      req.headers.authorization,
      iTwinId
    );
    if (!userAuthorized) req.statusCode = 401;

    // Get the service access token
    const access_token = await tokenCache.getToken();
    // Swap auth header
    req.headers.authorization = `${access_token}`;
    next();
  } catch (error) {
    console.error(`Token exchange failed with error: ${error}`);
    next(error);
  }
});

// proxy middleware options
const options: Options = {
  target: "https://api.bentley.com",
  changeOrigin: true,
  ws: true,
};

// create the proxy and pass it to the server
const iTwinPlatformProxy = createProxyMiddleware(options);
app.use(iTwinPlatformProxy);

// start the server
const server = app.listen(3001);
console.log("Listening on port 3001");

process.on("SIGINT", () => server.close());
process.on("SIGTERM", () => server.close());
