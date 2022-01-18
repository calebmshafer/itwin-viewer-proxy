import "./App.scss";

import { Viewer } from "@itwin/web-viewer-react";
import React, { useEffect, useMemo, useState } from "react";

import { MyTokenServerAuthClient } from "./MyTokenServerAuthClient";

const App: React.FC = () => {
  const myTokenServerAuthClient = useMemo(() => new MyTokenServerAuthClient(), []);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const init = async () => {
      await myTokenServerAuthClient.initialize();
      const token = await myTokenServerAuthClient.getAccessToken();
      setAccessToken(token);
    }
    init().catch(console.error);
  }, [myTokenServerAuthClient]);

  if (!process.env.IMJS_ITWIN_ID) {
    throw new Error(
      "Please add a valid iTwin id to the .env file and restart the application. See the README for more information."
    );
  }
  if (!process.env.IMJS_IMODEL_ID) {
    throw new Error(
      "Please add a valid iModel id to the .env file and restart the application. See the README for more information."
    );
  }

  return (
    <>
      {accessToken && (
        <Viewer
          iTwinId={process.env.IMJS_ITWIN_ID}
          iModelId={process.env.IMJS_IMODEL_ID}
          changeSetId={process.env.IMJS_CHANGESET_ID}
          authClient={myTokenServerAuthClient}
          enablePerformanceMonitors={true}
        />
      )}
    </>
  );
};

export default App;
