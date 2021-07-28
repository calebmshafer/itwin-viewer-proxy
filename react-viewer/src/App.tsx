import "./App.scss";

import { Viewer } from "@bentley/itwin-viewer-react";
import React, { useEffect, useState } from "react";

import { NoSignInIAuthClient } from "./TestClient";

const App: React.FC = () => {
  const [isAuthorized,] = useState(
    NoSignInIAuthClient.oidcClient
      ? NoSignInIAuthClient.oidcClient.isAuthorized
      : false
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!process.env.REACT_APP_TEST_CONTEXT_ID) {
      throw new Error(
        "Please add a valid context ID in the .env file and restart the application"
      );
    }
    if (!process.env.REACT_APP_TEST_IMODEL_ID) {
      throw new Error(
        "Please add a valid iModel ID in the .env file and restart the application"
      );
    }
  }, []);

  useEffect(() => {
    if (isLoggingIn && isAuthorized) {
      setIsLoggingIn(false);
    }
  }, [isAuthorized, isLoggingIn]);

  return (
    <div>
      <Viewer
        // Retail building
        // contextId="11b074ae-1859-4506-bc62-1eeda2ce11a8"
        // iModelId="b8c5ac92-9d39-4b93-81b7-43f19a98f4dd"
        // changeSetId="93b6c5340d2cc99534afeb97d03227ce75c7734a"

        // Metro Station
        // contextId="11b074ae-1859-4506-bc62-1eeda2ce11a8"
        // iModelId="794aadd7-8231-4317-85c9-de8fb455f209"
        // changeSetId="08af6b57c6833b24b702a7c38452088fc23c6cb7"

        // Bentley Building
        contextId="11b074ae-1859-4506-bc62-1eeda2ce11a8"
        iModelId="e7e75883-fab6-4331-b21e-1897aa154255"
        changeSetId="7ff0527987f6307377573cacb43617617350b7d0"

        authConfig={{ oidcClient: NoSignInIAuthClient.oidcClient }}
        backend={{
          customBackend: {
            rpcParams: {
              info: {
                title: "general-purpose-imodeljs-backend",
                version: "v2.0"
              },
              uriPrefix: "http://localhost:3001",
            }
          },
        }}
      />
    </div>
  );
};

export default App;
