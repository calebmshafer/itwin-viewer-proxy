import { AuthStatus, BeEvent, BentleyError, ClientRequestContext } from "@bentley/bentleyjs-core";
import { AccessToken } from "@bentley/itwin-client";
import { FrontendAuthorizationClient } from "@bentley/frontend-authorization-client";

/** This client defines the interfaces  */
export class NoSignInIAuthClient implements FrontendAuthorizationClient {
  public readonly onUserStateChanged: BeEvent<(token: AccessToken | undefined) => void>;
  protected _accessToken?: AccessToken;

  private static _oidcClient: FrontendAuthorizationClient;

  public static get oidcClient(): FrontendAuthorizationClient {
    if (undefined !== this._oidcClient)
      return this._oidcClient;
    this._oidcClient = new NoSignInIAuthClient();
    return this._oidcClient;
  }

  constructor() {
    this.onUserStateChanged = new BeEvent();
    this.generateTokenString();
  }

  public async signIn(requestContext?: ClientRequestContext): Promise<void> {
    if (requestContext) {
      requestContext.enter();
    }
    await this.getAccessToken();
  }
  public async signOut(requestContext?: ClientRequestContext): Promise<void> {
    if (requestContext)
      requestContext.enter();

    this._accessToken = undefined;
  }

  public get isAuthorized(): boolean {
    return true;
  }

  public get hasExpired(): boolean {
    return !this._accessToken;
  }

  public get hasSignedIn(): boolean {
    return true;
  }

  public async generateTokenString() {
    const tokenJson = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _userInfo: { id: "MockId" },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      _tokenString: "Bearer t",
    };
    this._accessToken = AccessToken.fromJson(tokenJson);
  }

  public async getAccessToken(): Promise<AccessToken> {
    if (!this._accessToken)
      throw new BentleyError(AuthStatus.Error, "Cannot get access token");
    return this._accessToken;
  }
}