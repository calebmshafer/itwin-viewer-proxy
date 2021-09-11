import {
  AuthStatus,
  BeEvent,
  BentleyError,
  ClientRequestContext,
} from "@bentley/bentleyjs-core";
import { AccessToken } from "@bentley/itwin-client";
import { FrontendAuthorizationClient } from "@bentley/frontend-authorization-client";

/** This client defines the interfaces  */
export class MyTokenServerAuthClient implements FrontendAuthorizationClient {
  public readonly onUserStateChanged: BeEvent<
    (token: AccessToken | undefined) => void
  >;
  protected _accessToken?: AccessToken;
  protected _tokenUrl: string;

  private static _oidcClient: FrontendAuthorizationClient;

  public static get oidcClient(): FrontendAuthorizationClient {
    return this._oidcClient;
  }

  private constructor(tokenUrl: string) {
    this.onUserStateChanged = new BeEvent();
    this._tokenUrl = tokenUrl;
  }

  public static async initializeOidc(tokenUrl: string): Promise<void> {
    if (this._oidcClient) {
      return;
    }

    this._oidcClient = new MyTokenServerAuthClient(tokenUrl);
  }

  public async signIn(requestContext?: ClientRequestContext): Promise<void> {
    requestContext?.enter();

    const res = await fetch(this._tokenUrl);
    if (!res.ok)
      throw Error(`Error signing in: ${res.statusText}`);
    const token = await res.json();
    this._accessToken = AccessToken.fromJson(token);
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

  public async getAccessToken(): Promise<AccessToken> {
    if (!this._accessToken) {
      throw new BentleyError(AuthStatus.Error, "Cannot get access token");
    }

    return this._accessToken;
  }
}
