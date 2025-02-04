const loginWithGoogle = async () => {
  try {
    // 🔹 Google認証URLを取得
    const response = await fetch("http://localhost:8080/auth/google");

    if (!response.ok) throw new Error("認証URLの取得に失敗");

    const { url } = await response.json();

    chrome.runtime.sendMessage(
      { action: "launchAuthFlow", url },
      (response) => {
        if (response.status) {
          return true;
        } else {
          console.error("Error sending message:", response.error);
        }
      }
    );
  } catch (error) {
    console.error("Login error:", error);
  }
};

export default loginWithGoogle;
