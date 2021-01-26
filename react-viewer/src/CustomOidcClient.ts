import { UserManager, UserManagerSettings, WebStorageStateStore } from "oidc-client";

export class OidcClient {
  private _userManager: UserManager;

  constructor() {
    // const userSettings: UserManagerSettings = {
    //   client_id: "xxxxxxx",
    //   userStore: new WebStorageStateStore({ store: localStorage }),
    //   silent_redirect_uri: 'http://localhost:3001/silent-signin',
    //   metadataUrl: 'http://localhost:3001/metadata-url'
    // };

    const userSettings: UserManagerSettings = {
      client_id: "imodeljs-spa-samples-2686",
      userStore: new WebStorageStateStore({ store: localStorage }),
      scope: 'openid email profile organization imodelhub context-registry-service:read-only product-settings-service general-purpose-imodeljs-backend imodeljs-router urlps-third-party',
      response_type: 'code',
      redirect_uri: 'http://localhost:3000/signin-callback',
      post_logout_redirect_uri: 'http://localhost:3000/logout',
      authority: 'https://imsoidc.bentley.com',
    };
    
    this._userManager = new UserManager(userSettings);
  }

  public getUserManager = (): UserManager => {
    return this._userManager;
  };

}

export const oidcClient = new OidcClient()