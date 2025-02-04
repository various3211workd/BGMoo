const checkAuthStatus = async () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["token"], (result) => {
      resolve(!!result.token);
    });
  });
};
