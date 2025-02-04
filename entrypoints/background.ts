export default defineBackground(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "launchAuthFlow") {
      const url = request.url;

      chrome.identity.launchWebAuthFlow({ url, interactive: true }, async (redirectUrl) => {
        if (chrome.runtime.lastError) {
          console.error("Auth Flow Error:", chrome.runtime.lastError.message);
          return;
        }

        if (!redirectUrl) {
          console.error("リダイレクトURLが取得できませんでした");
          return;
        }

        console.log("Redirect URL:", redirectUrl);

        // 🔹 コールバックURLから認証コードを取得
        const params = new URL(redirectUrl).searchParams;
        const code = params.get("code");

        if (!code) {
          console.error("認証コードが見つかりません");
          return;
        }

        try {
          // 🔹 認証コードを使ってアクセストークンを取得
          const tokenResponse = await fetch(`http://localhost:8080/auth/callback?code=${code}`);
          
          if (!tokenResponse.ok) throw new Error("トークン取得失敗");

          /*
          const { token } = await tokenResponse.json();

          if (!token) {
            console.error("トークンが空です");
            return;
          }

          // 🔹 chrome.storage にトークン保存
          chrome.storage.sync.set({ token }, () => {
            console.log("Token saved:", token);
          });
          */
        } catch (error) {
          console.error("トークン取得エラー:", error);
        }
      });
    }

    // 🔹 認証が成功したときにトークンを保存
    if (request.action === "saveToken") {
      chrome.storage.sync.set({ token: request.token }, () => {
        console.log("Token saved:", request.token);
      });
      const test = chrome.storage.sync.get(["token"]);
      console.log("test: ", test)
    }

    if (request.action === "logout") {
      chrome.storage.sync.remove("token", () => {
        console.log("User logged out");
      });
    }

    sendResponse({ status: true });
  });
});
