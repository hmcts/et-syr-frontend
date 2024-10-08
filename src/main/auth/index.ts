import axios from 'axios';
import config from 'config';
import jwtDecode from 'jwt-decode';

import { UserDetails } from '../definitions/appRequest';
import { CITIZEN_ROLE } from '../definitions/constants';
import { getLogger } from '../logger';

const logger = getLogger('AuthorizationIndex');

export const getRedirectUrl = (
  serviceUrl: string,
  callbackUrlPage: string,
  guid: string,
  languageParam: string
): string => {
  const clientID: string = process.env.IDAM_CLIENT_ID ?? config.get('services.idam.clientID');
  const loginUrl: string = process.env.IDAM_WEB_URL ?? config.get('services.idam.authorizationURL');
  const callbackUrl = encodeURI(serviceUrl + callbackUrlPage);
  return `${loginUrl}?client_id=${clientID}&response_type=code&redirect_uri=${callbackUrl}&state=${guid}&ui_locales=${languageParam}`;
};

export const getUserDetails = async (
  serviceUrl: string,
  rawCode: string,
  callbackUrlPageLink: string
): Promise<UserDetails> => {
  const id: string = process.env.IDAM_CLIENT_ID ?? config.get('services.idam.clientID');
  const secret: string = config.get('services.idam.clientSecret');
  const tokenUrl: string = process.env.IDAM_API_URL ?? config.get('services.idam.tokenURL');
  // This variable is added for getting user details for development environment.
  const userInfoUrl: string = process.env.IDAM_API_USER_INFO_URL ?? config.get('services.idam.userInfoURL');
  const callbackUrl = encodeURI(serviceUrl + callbackUrlPageLink);
  const code = encodeURIComponent(rawCode);
  const env = process.env.NODE_ENV || 'development';
  const data =
    env === 'development'
      ? `client_id=${id}&client_secret=${secret}&grant_type=authorization_code&redirect_uri=${callbackUrl}&code=${code}&scope=roles&username=respondent@gmail.com&password=password`
      : `client_id=${id}&client_secret=${secret}&grant_type=authorization_code&redirect_uri=${callbackUrl}&code=${code}`;
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const response = await axios.post(tokenUrl, data, { headers });
  const jwt = jwtDecode(response.data.id_token) as IdTokenJwtPayload;
  if (env === 'development') {
    const userInfoResponse = await fetch(userInfoUrl, {
      method: 'GET',
      headers: new Headers({
        Authorization: 'Bearer ' + response.data.access_token,
        'Content-Type': 'application/json',
      }),
    });
    if (userInfoResponse.ok) {
      await userInfoResponse.json().then(userInfo => {
        jwt.uid = userInfo?.uid;
        jwt.roles = userInfo?.roles;
        jwt.sub = userInfo?.sub;
        jwt.family_name = userInfo?.family_name;
        jwt.given_name = userInfo?.given_name;
      });
    } else {
      logger.error('Unable to get user info with access token ' + response.data.access_token);
    }
  }
  return {
    accessToken: response.data.access_token,
    id: jwt.uid,
    email: jwt.sub,
    givenName: jwt.given_name,
    familyName: jwt.family_name,
    isCitizen: jwt.roles ? jwt.roles.includes(CITIZEN_ROLE) : false,
  };
};

export interface IdTokenJwtPayload {
  uid: string;
  sub: string;
  given_name: string;
  family_name: string;
  roles: string[];
}
