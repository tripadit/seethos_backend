import CryptoJS from 'crypto-js';

export const encrypt = ({ key, data }: { key: string; data: any }) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

export const descrypt = ({ key, token }: { key: string; token: any }) => {
  const decrypt = CryptoJS.AES.decrypt(token, key);
  const originalData: any = decrypt.toString(CryptoJS.enc.Utf8);
  if (originalData) {
    return JSON.parse(originalData);
  }
  return originalData;
};
