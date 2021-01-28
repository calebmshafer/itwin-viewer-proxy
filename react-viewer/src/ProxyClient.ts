import { BeEvent, ClientRequestContext } from '@bentley/bentleyjs-core';
import { FrontendAuthorizationClient } from '@bentley/frontend-authorization-client';
import { AccessToken, AuthorizationClient } from '@bentley/itwin-client';

export class ProxyClient implements FrontendAuthorizationClient {
  
  public readonly onUserStateChanged: BeEvent<(token: AccessToken | undefined) => void>;

  public readonly hasSignedIn: boolean;
  public readonly isAuthorized: boolean;
  
  constructor() {
    this.onUserStateChanged = new BeEvent();
    this.hasSignedIn = true
    this.isAuthorized = true
  }

  async getAccessToken(requestContext?: ClientRequestContext): Promise<AccessToken> {
    console.log('getAccessToken', requestContext)
    const tokenJson = {
      _userInfo: { id: 14 },
      _tokenString: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o'
    };

    // call our backend to get the correct authorization for IMS
    // const tokenjson = await callToOurBackend

    return AccessToken.fromJson(tokenJson)
  }
  
  signIn(requestContext: ClientRequestContext): Promise<void> {
    throw new Error('Method not implemented.');
  }

  signOut(requestContext: ClientRequestContext): Promise<void> {
    throw new Error('Method not implemented.');
  }
  
}