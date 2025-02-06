export async function signInWithGoogle(): Promise<string[] | null> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "login" }, (response: any) => {
      if (response?.success) {
        resolve([response.token, response.userId]);
      } else {
        reject(response?.error || "ログイン失敗");
      }
    });
  });
}
