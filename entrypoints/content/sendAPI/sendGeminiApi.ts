import BgmSelector from "../bgmSelector";

//const API_URL = "https://bun-hono-app-njfzvuu3da-an.a.run.app/"; // .envに記載して import.meta.env.WXT_**** で取得できなかったためベタ書。要修正
const API_URL = import.meta.env.VITE_API_URL

export const SendGeminiAPI = async (path: []) => {
  try {
    const element = document.querySelector(path.join(" "));
    if (!element) {
      throw new Error("Element not found");
    }

    const emosionList = await getLocalEmosionList();
    console.log("emosionList: ", emosionList)

    const response = await fetch(API_URL, {
      method: "POST", // POSTリクエスト
      headers: {
        "Content-Type": "application/json", // JSON形式で送信
      },
      body: JSON.stringify({ text: element.innerText, emosionList: emosionList }), // データをJSONで送信
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json(); // JSONパース
    const bgmList = await BgmSelector(result); // BgmSelector を適用

    return bgmList; // 取得したデータを返す
  } catch (error) {
    console.error("Error in SendGeminiAPI:", error);
    return null; // エラー時は null を返す
  }
};

const getLocalEmosionList = async () => {
  try{
    const response = await fetch(chrome.runtime.getURL("audio-samples.json"));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const directoryNames = Object.keys(data);

    return directoryNames;
  }catch(e){
    console.log("error: ", e)
    return null;
  }
};
