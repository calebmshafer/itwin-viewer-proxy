import "./App.scss";

import { useAccessToken, Viewer } from "@itwin/web-viewer-react";
import React, { useEffect, useMemo, useState } from "react";

import { MyTokenServerAuthClient } from "./MyTokenServerAuthClient";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";

const App: React.FC = () => {
  const [tokenUrl] = useState(process.env.TOKEN_URL ?? "http://localhost:3001/getToken" ); // defaults to the localhost version

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

  const authClient = useMemo(
    () =>
      new BrowserAuthorizationClient({
        scope: "itwinjs imodels:read realitydata:read",
        clientId: "spa-CTDkE2ZHAd9QjwuUug6ZCZXCo",
        redirectUri: "http://localhost:3000/signin-callback",
        postSignoutRedirectUri: "http://localhost:3000/logout",
        responseType: "code",
      }),
    []
  );

  useEffect(() => {
    const init = async () => {
      try {
        await authClient.signInSilent();
      } catch {
        await authClient.signIn();
      }
    };
    init();
  }, [authClient]);

  const accessToken = useAccessToken();
  console.log(accessToken)

  return (
    <div className="viewer-container">
      {accessToken && (
        <Viewer
          iTwinId={process.env.IMJS_ITWIN_ID}
          iModelId={process.env.IMJS_IMODEL_ID}
          changeSetId={process.env.IMJS_CHANGESET_ID}
          // authClient={new MyTokenServerAuthClient()}
          authClient={authClient}
          enablePerformanceMonitors={true}
        />
      )}
    </div>
  );
};

export default App;
