import { GoogleGenerativeAI } from "@google/generative-ai";
import BgmSelector from "./bgmSelector";

/*
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
*/

export const SendGeminiAPI = async (path: []) => {
  const element = document.querySelector(path.join(" "));

  //await sleep(3000);

  if (element) {
    //console.log(element.innerText);
    try {
      const emosionList = [
        "感動",
        "怪しい",
        "不穏",
        "緊張",
        "急展開",
        "優雅",
        "コメディ",
        "かわいい",
        "せつない",
        "壮大",
        "勇敢",
        "夢幻的（ファンタジー）",
        "怒り",
        "驚き",
        "絶望",
        "希望",
        "温かい",
        "切ない",
        "状況・シチュエーション系",
        "バトル",
        "逃走",
        "街並み",
        "廃墟",
        "森林",
        "砂漠",
        "海辺",
        "宇宙",
        "夜",
        "雨",
        "祭り",
        "事件発生",
        "日常",
        "学校",
        "恋愛",
      ];

      const prompt = `この文章「${element.innerText}」を映画のBGMのようにこのリスト（${emosionList}）のいずれか場面や心情が大きく変わる部分ごとに大きく区切ってリストを返してください。レスポンスはjson形式のリストだけにしてください。
{
musics: [{start_text: "その音楽が始まる文章の先頭15文字。", music: "事件発生"}, {start_text: "その音楽が始まる文章の先頭15文字。", music: "夢幻的（ファンタジー）"}, ...]
}`;

      // gemini upload
      //console.log(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
      /*
      const genAI = new GoogleGenerativeAI(
        //process.env.NEXT_PUBLIC_GEMINI_API_KEY!
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(prompt);

      const response = await result.response;
      const responseText = response.text();
      */

      const responseText = {
        musics: [
          {
            start_text: "これは本気でマズイことになった",
            music: "壮大",
          },
          {
            start_text: "「よし、いいぞ俺。伊達に妄想し",
            music: "夢幻的（ファンタジー）",
          },
          {
            start_text: "「ジャンルは異世界ファンタジー",
            music: "壮大",
          },
          {
            start_text: "指をわきわきさせながら今後を不",
            music: "壮大",
          },
        ],
      };

      return BgmSelector(responseText); // responseTextを設定
    } catch (e) {
      console.log(e);
    }
  }
};
