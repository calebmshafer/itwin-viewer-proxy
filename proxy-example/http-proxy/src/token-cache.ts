import { ServiceAuthorizationClient } from "@itwin/service-authorization";
import { jwtDecode } from "jwt-decode";

// For getting and caching a service token
export class TokenCache {
  private readonly _cache: Map<string, { exp: number; token: string }> =
    new Map();

  public constructor(
    private readonly _authClient: ServiceAuthorizationClient
  ) {}

  public async getToken(): Promise<string> {
    const cacheKey = "key";
    const cached = this._cache.get(cacheKey);
    if (cached !== undefined) {
      if (cached.exp > Date.now()) return cached.token;
      else this._cache.delete(cacheKey);
    }

    try {
      const accessToken = await this._authClient.getAccessToken();
      // Only cache the token if the token has a set expiration
      const tokenExp = jwtDecode(accessToken.replace(/^Bearer /, ""))?.exp; // UTC time in seconds since 1970-01-01
      if (tokenExp !== undefined) {
        const currentTimeInSeconds = Date.now() / 1000; // UTC time in seconds since 1970-01-01
        const secondsUntilExpiration = tokenExp - currentTimeInSeconds;
        if (secondsUntilExpiration > 60) {
          // make tokens "expire" one minute early to be on the safe side
          // store timestamp in milliseconds for easier comparison with Date.now()
          this._cache.set(cacheKey, {
            token: accessToken,
            exp: (tokenExp - 60) * 1000,
          });
          console.log("Caching token");
        }
      }
      return accessToken;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
