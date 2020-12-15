import { AccessToken } from "@bentley/itwin-client";
import { decode } from "jsonwebtoken";
import { GrantBody, TokenSet, ClientMetadata, Issuer, Client as OpenIdClient } from "openid-client";

/**
 * Utility to generate OIDC/OAuth tokens for agent or agent applications
 * * The application must register a client using the
 * [self service registration page](https://developer.bentley.com/register).
 * * The client type must be "Service"
 * * Use the Client Id/Client Secret/Scopes to create the client.
 * * Ensure the application can access the iTwin Project/Asset - in production environments, this is done by
 * using the iTwin project portal to add add the email **`{Client Id}@apps.imsoidc.bentley.com`** as an authorized user
 * with the appropriate role that includes the required access permissions.
 */
export class AuthClient {
  private _client?: OpenIdClient;
  private _accessToken?: AccessToken;
  private _scopes: string;
  private _clientId: string;
  private _clientSecret: string;

  constructor(clientId: string, clientSecret: string, scopes: string) {
    this._clientId = clientId;
    this._clientSecret = clientSecret;
    this._scopes = scopes;
  }

  private async getClient(): Promise<OpenIdClient> {
    if (this._client)
      return this._client;

    const clientConfiguration: ClientMetadata = {
      client_id: this._clientId,
      client_secret: this._clientSecret, // eslint-disable-line @typescript-eslint/naming-convention
    };
    const issuer = await Issuer.discover("https://imsoidc.bentley.com");
    this._client = new issuer.Client(clientConfiguration);
    return this._client;
  }

  private async generateAccessToken(): Promise<AccessToken> {
    const scope = this._scopes;
    if (scope.includes("openid") || scope.includes("email") || scope.includes("profile") || scope.includes("organization"))
      throw new Error("Scopes for an Agent cannot include 'openid email profile organization'");

    const grantParams: GrantBody = {
      grant_type: "client_credentials",
      scope,
    };

    let tokenSet: TokenSet;
    const client = await this.getClient();
    try {
      tokenSet = await client.grant(grantParams);
    } catch (error) {
      throw new Error(error.message || "Authorization error");
    }

    const userProfile = tokenSet.access_token
      ? decode(tokenSet.access_token, { json: true, complete: false })
      : undefined;
    this._accessToken = AccessToken.fromTokenResponseJson(tokenSet, userProfile);
    return this._accessToken;
  }

  /**
   * Set to true if there's a current authorized user or client (in the case of agent applications).
   * Set to true if signed in and the access token has not expired, and false otherwise.
   */
  public get isAuthorized(): boolean {
    return this.hasSignedIn && !this.hasExpired;
  }

  /** Set to true if the user has signed in, but the token has expired and requires a refresh */
  public get hasExpired(): boolean {
    if (!this._accessToken)
      return false;

    const expiresAt = this._accessToken.getExpiresAt();
    if (!expiresAt)
      throw new Error("Invalid JWT");

    return expiresAt.getTime() - Date.now() <= 1 * 60 * 1000; // Consider 1 minute before expiry as expired
  }

  /** Set to true if signed in - the accessToken may be active or may have expired and require a refresh */
  public get hasSignedIn(): boolean {
    return !!this._accessToken;
  }

  /** Returns a promise that resolves to the AccessToken of the currently authorized client.
   * The token is refreshed if necessary.
   */
  public async getAccessToken(): Promise<AccessToken> {
    if (this.isAuthorized)
      return this._accessToken!;
    return this.generateAccessToken();
  }
}