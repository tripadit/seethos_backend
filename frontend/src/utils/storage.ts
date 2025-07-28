// REMINDER: It is still unclear if we will be using the localStorage as our storage mechanism for our tokens or would we be using some other tech. However, for now, I have just left it up to the localStorage. Will come back to it if necessary.

/**
 * NOTE: Get value from storage for given key.
 *
 * @param {string} key
 * @return {string}
 */

const get = (key: string) => {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value);
};

/**
 * NOTE: Set key value pair in storage
 *
 * @param {string} key
 * @param {string} value
 */

const set = (key: string, value: string) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * NOTE: Remove key value pair in storage
 *
 * @param {string} key
 */

const remove = (key: string) => {
  localStorage.removeItem(key);
};

/**
 * NOTE: Clear storage
 *
 * @return {string}
 */

const clear = () => {
  return localStorage.clear();
};

export { clear, get, remove, set };
