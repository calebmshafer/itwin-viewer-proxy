import { AuthClient } from "./AuthClient";
import { CustomExpressServer } from "./CustomExpressServer";

(async () => {
  try {
    // Setup a client using the client credentials workflow.
    const oidcClient = new AuthClient(
      process.env.CLIENT_ID!,
      process.env.CLIENT_SECRET!,
      "imodelhub context-registry-service:read-only imodeljs-router general-purpose-imodeljs-backend",
    );

    const server = new CustomExpressServer(oidcClient);

    await server.initialize(process.env.PORT ?? 3001);
    // await backend.initialize();
    // await backend.startServer();
    console.log("READY");
  } catch (error) {
    // logException(error, "Unhandled exception thrown in general-purpose-imodeljs-backend");
    process.exitCode = 1;
  }
})();
