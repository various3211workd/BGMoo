export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "login") {
      const redirectUri = chrome.identity.getRedirectURL();

      const authUrl = new URL("https://accounts.google.com/o/oauth2/auth");
      authUrl.searchParams.set("client_id", import.meta.env.VITE_CLIENT_ID);
      authUrl.searchParams.set("response_type", "code");  // `token` ではなく `code` を使う
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("scope", "email profile openid");
  
      chrome.identity.launchWebAuthFlow(
        {
          url: authUrl.toString(),
          interactive: true,
        },
        (redirectUrl) => {
          if (chrome.runtime.lastError || !redirectUrl) {
            sendResponse({ success: false, error: chrome.runtime.lastError?.message || "認証エラー" });
          } else {
            // 認証コードを取得
            const code = new URL(redirectUrl).searchParams.get("code");
  
            if (!code) {
              sendResponse({ success: false, error: "認証コードの取得に失敗しました" });
              return;
            }
  
            // ここでバックエンドAPIにコードを送信し、アクセストークンに交換する
            fetch(import.meta.env.VITE_API_URL + "/exchange_token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code, redirectUri }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("data: ",data)
                sendResponse({ success: true, token: data.access_token, userId: data.userId });
              })
              .catch((err) => {
                sendResponse({ success: false, error: err.message });
              });
          }
        }
      );
  
      return true; // 非同期レスポンスを許可
    }
    sendResponse({ status: true });
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.tabs.sendMessage(tabId, { url: tab.url }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          console.log('コンテンツスクリプトからの応答:', response);
        }
      });
    }
  });
});
