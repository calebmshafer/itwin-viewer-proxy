import "./App.scss";

import { Viewer, IModelBackend } from "@itwin/web-viewer-react";
import React from "react";

import { NoSignInIAuthClient } from "./NoSignInIAuthClient";

const App: React.FC = () => {
  return (
    <Viewer
      // Bentley Building
      contextId="11b074ae-1859-4506-bc62-1eeda2ce11a8"
      iModelId="e7e75883-fab6-4331-b21e-1897aa154255"
      changeSetId="7ff0527987f6307377573cacb43617617350b7d0" // Note: If the changeSetId is not supplied, the Viewer component will make a request to the iModelHub that does not go through the proxy.
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
