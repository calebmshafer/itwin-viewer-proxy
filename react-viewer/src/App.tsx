import "./App.scss";

import { Viewer } from "@bentley/itwin-viewer-react";
import React, { useEffect, useState } from "react";

import { NoSignInIAuthClient } from "./TestClient";

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    NoSignInIAuthClient.oidcClient
      ? NoSignInIAuthClient.oidcClient.isAuthorized
      : false
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const initOidc = async () => {
      // if (!AuthorizationClient.oidcClient) {
      //   await AuthorizationClient.initializeOidc();
      // }

      try {
        // attempt silent signin
        // await AuthorizationClient.signInSilent();
        // setIsAuthorized(AuthorizationClient.oidcClient.isAuthorized);
      } catch (error) {
        // swallow the error. User can click the button to sign in
      }
    };
    initOidc().catch((error) => console.error(error));
  }, []);

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

  // const onLoginClick = async () => {
  //   setIsLoggingIn(true);
  //   // await AuthorizationClient.signIn();
  // };

  // const onLogoutClick = async () => {
  //   setIsLoggingIn(false);
  //   // await AuthorizationClient.signOut();
  //   setIsAuthorized(false);
  // };

  return (
    <div>
      {/* {isLoggingIn ? (
        <span>"Logging in...."</span>
      ) : (
        isAuthorized && ( */}
          <Viewer
            // contextId="8d8e9307-63b5-46fd-8286-7872dd04f0ce"
            // iModelId="81a62730-f6b4-455e-93e6-b42efec23156"
            contextId="1bff8c44-3196-4231-b8f6-66cf6dacd45b" // personal
            iModelId="71adc398-33bd-4ca9-9dec-fa6a74729bf6" // personal
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
              buddiRegion: 102,
            }}
          />
        {/* ) */}
      {/* )} */}
    </div>
  );
};

export default App;
