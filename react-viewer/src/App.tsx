import "./App.scss";

import { Viewer, IModelBackend } from "@itwin/web-viewer-react";
import React from "react";

import { NoSignInIAuthClient } from "./NoSignInIAuthClient";

const App: React.FC = () => {
  if (!process.env.IMJS_CONTEXT_ID) {
    throw new Error(
      "Please add a valid context id to the .env file and restart the application. See the README for more information."
    );
  }
  if (!process.env.IMJS_IMODEL_ID) {
    throw new Error(
      "Please add a valid iModel id to the .env file and restart the application. See the README for more information."
    );
  }
  if (!process.env.IMJS_CHANGESET_ID) {
    throw new Error(
      "Please add a valid changeset id to the .env file and restart the application. See the README for more information."
    );
  }

  return (
    <Viewer
      contextId={process.env.IMJS_CONTEXT_ID}
      iModelId={process.env.IMJS_IMODEL_ID}
      changeSetId={process.env.IMJS_CHANGESET_ID} // Note: If the changeSetId is not supplied, the Viewer component will make a request to the iModelHub that does not go through the proxy.
      authConfig={{ oidcClient: NoSignInIAuthClient.oidcClient }}
      backend={{
        customBackend: {
          rpcParams: {
            info: {
              title: IModelBackend.GeneralPurpose,
              version: "v2.0",
            },
            uriPrefix: "http://localhost:3001", // Local url to the proxy sever
          },
        },
      }}
    />
  );
};

export default App;
