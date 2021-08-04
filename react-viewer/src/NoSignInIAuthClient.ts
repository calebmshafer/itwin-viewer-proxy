import {
  AuthStatus,
  BeEvent,
  BentleyError,
  ClientRequestContext,
} from "@bentley/bentleyjs-core";
import { AccessToken } from "@bentley/itwin-client";
import { FrontendAuthorizationClient } from "@bentley/frontend-authorization-client";

/** This client defines the interfaces  */
export class NoSignInIAuthClient implements FrontendAuthorizationClient {
  public readonly onUserStateChanged: BeEvent<
    (token: AccessToken | undefined) => void
  >;
  protected _accessToken?: AccessToken;

  private static _oidcClient: FrontendAuthorizationClient;

  public static get oidcClient(): FrontendAuthorizationClient {
    if (this._oidcClient) {
      return this._oidcClient;
    }
    this._oidcClient = new NoSignInIAuthClient();
    return this._oidcClient;
  }

  constructor() {
    this.onUserStateChanged = new BeEvent();
    this.generateToken();
  }

  public async signIn(requestContext?: ClientRequestContext): Promise<void> {
    requestContext?.enter();
    this.generateToken();
  }

  public async signOut(requestContext?: ClientRequestContext): Promise<void> {
    requestContext?.enter();
    this._accessToken = undefined;
  }

  public get isAuthorized(): boolean {
    return !!this._accessToken;
  }

  public get hasExpired(): boolean {
    return !this._accessToken;
  }

  public get hasSignedIn(): boolean {
    return !!this._accessToken;
  }

  public generateToken() {
    if (!this._accessToken) {
      this._accessToken = AccessToken.fromJson({
        userInfo: { id: "MockId" },
        tokenString: "Bearer mock",
      });
    }
  }

  public async getAccessToken(): Promise<AccessToken> {
    if (!this._accessToken) {
      throw new BentleyError(AuthStatus.Error, "Cannot get access token");
    }
    return this._accessToken;
  }
}
