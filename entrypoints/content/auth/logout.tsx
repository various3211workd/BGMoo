const logout = () => {
  chrome.runtime.sendMessage({ action: "logout" });
};

export default logout;
