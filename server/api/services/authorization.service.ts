
import Promise from 'bluebird';
import L from '../../common/logger';
import axios from 'axios';

const GOOGLE_API = 'https://www.googleapis.com/oauth2/v3/userinfo';

export class AuthorizationService {
  getUserInfo(token): any {
    L.info('login with token', token);
    return axios.get(GOOGLE_API, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        L.info('login with token data', data);
        if (data && data.error_description === 'Invalid Value') {
          return Promise.resolve(data.error_description);
        }
        return Promise.resolve(data);
      })
      .catch((error) => {
        L.info('login with token error');
        return Promise.resolve({});
      });
  }
}

export default new AuthorizationService();