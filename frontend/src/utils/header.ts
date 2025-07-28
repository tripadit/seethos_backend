export type THeader = 'json' | 'multipart' | 'default';

/**
 * NOTE: Transform header based on headerType param
 *
 * @param {THeader} headerType
 */

export const getHeader = (headerType: THeader) => {
  let header: HeadersInit = {};

  switch (headerType) {
    case 'json':
      header = {
        'Content-Type': 'application/json',
      };
      break;

    case 'multipart':
      header = {
        'Content-Type': 'multipart/form-data',
      };
      break;
    case 'default':
      header = { 'Content-Type': 'application/json' };
      break;
    default:
      header = { 'Content-Type': 'application/json' };
      break;
  }
  return header;
};
