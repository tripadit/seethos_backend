const versionLadingPage = ['/'];

export const isDarkVersion = () => {
  return versionLadingPage.includes(window.location.pathname);
};
