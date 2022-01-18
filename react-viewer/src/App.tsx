import "./App.scss";

import { useAccessToken, Viewer } from "@itwin/web-viewer-react";
import React, { useEffect, useMemo, useState } from "react";

import { MyTokenServerAuthClient } from "./MyTokenServerAuthClient";

const App: React.FC = () => {
  const [tokenUrl] = useState(process.env.TOKEN_URL ?? "http://localhost:3001/getToken"); // defaults to the localhost version

  const authClient = useMemo(() => new MyTokenServerAuthClient(tokenUrl), [tokenUrl]);

  useEffect(() => {
    const init = async () => {
      await authClient.initialize();
    }
    init().catch(console.error);
  }, [authClient]);

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
  // if (!process.env.IMJS_CHANGESET_ID) {
  //   throw new Error(
  //     "Please add a valid changeset id to the .env file and restart the application. See the README for more information."
  //   );
  // }

  const accessToken = useAccessToken();
  console.log(accessToken)

  return (
    <div className="viewer-container">
      {accessToken && (
        <Viewer
          iTwinId={process.env.IMJS_ITWIN_ID}
          iModelId={process.env.IMJS_IMODEL_ID}
          changeSetId={process.env.IMJS_CHANGESET_ID}
          authClient={authClient}
          enablePerformanceMonitors={true}
        />
      )}
    </div>
  );
};

export default App;
