const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (token) {
  chrome.runtime.sendMessage({ action: "saveToken", token });
}

window.close();
