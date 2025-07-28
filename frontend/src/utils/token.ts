import { tokenConstants } from '@/global/appConstants';
import { CONFIG } from '@/global/config';
import * as storage from '@/utils/storage';

import { encrypt } from './encryption';

type TTokenObj = {
  access: string;
  refresh: string;
};

type TReturnTypes = {
  setToken: (tokenObj: TTokenObj) => void;
  getAccessToken: () => string;
  getRefreshToken: () => string;
  clearToken: () => void;
};

const token = (): TReturnTypes => {
  const _setToken = (tokenObj: TTokenObj) => {
    const encryptedAccessToken = encrypt({ data: tokenObj.access, key: CONFIG.ENCRYPTION_KEY });
    const encryptedRefreshToken = encrypt({ data: tokenObj.refresh, key: CONFIG.ENCRYPTION_KEY });
    storage.set(tokenConstants.ACCESS_TOKEN, encryptedAccessToken);
    storage.set(tokenConstants.REFRESH_TOKEN, encryptedRefreshToken);
  };

  const _getAccessToken = () => {
    return storage.get(tokenConstants.ACCESS_TOKEN);
  };
  const _getRefreshToken = () => {
    return storage.get(tokenConstants.REFRESH_TOKEN);
  };

  const _clearToken = () => {
    return Object.values(tokenConstants).forEach((key) => storage.remove(key));
  };

  return {
    setToken: _setToken,
    getAccessToken: _getAccessToken,
    getRefreshToken: _getRefreshToken,
    clearToken: _clearToken,
  };
};

export default token();
