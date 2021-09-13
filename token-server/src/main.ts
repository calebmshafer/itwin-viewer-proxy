import { config } from "dotenv-flow";
import * as dotenv_expand from "dotenv-expand";
import { AuthClient } from "./AuthClient";
import { CustomExpressServer } from "./CustomExpressServer";

(async () => {
  const envResult = config();
  if (envResult.error) {
    throw envResult.error;
  }
  dotenv_expand(envResult);

  if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    throw new Error("CLIENT_ID and CLIENT_SECRET are required");
  }

  try {
    // Setup a client using the client credentials workflow.
    const oidcClient = new AuthClient(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "itwinjs"
    );

    const server = new CustomExpressServer(oidcClient);

    await server.initialize(process.env.PORT ?? 3001);
    console.log("READY");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();
