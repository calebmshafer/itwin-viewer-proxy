import "./App.scss";

import { Viewer } from "@itwin/web-viewer-react";
import React, { useEffect, useState } from "react";

import { MyTokenServerAuthClient } from "./MyTokenServerAuthClient";

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    MyTokenServerAuthClient.oidcClient
      ? MyTokenServerAuthClient.oidcClient.isAuthorized
      : false
  );
  const [tokenUrl] = useState(process.env.TOKEN_URL ?? "http://localhost:3001/getToken" ); // defaults to the localhost version

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

  useEffect(() => {
    const initOidc = async () => {
      if (!MyTokenServerAuthClient.oidcClient) {
        await MyTokenServerAuthClient.initializeOidc(tokenUrl);
      }

      try {
        await MyTokenServerAuthClient.oidcClient.signIn();
        setIsAuthorized(MyTokenServerAuthClient.oidcClient.isAuthorized);
      } catch (error) {
        // swallow the error. User can click the button to sign in
      }
    };
    initOidc().catch((error) => console.error(error));
  }, [tokenUrl]);

  return (
    <div className="viewer-container">
      {isAuthorized && (
        <Viewer
          contextId={process.env.IMJS_CONTEXT_ID}
          iModelId={process.env.IMJS_IMODEL_ID}
          changeSetId={process.env.IMJS_CHANGESET_ID}
          authConfig={{ oidcClient: MyTokenServerAuthClient.oidcClient }}
        />
      )}
    </div>
  );
};

export default App;
