import { GoogleGenerativeAI } from "@google/generative-ai";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const SendGeminiAPI = async (element, emosionList) => {

  //await sleep(3000);

  if (element) {
    try {
      const prompt = `この文章「${element}」を映画のBGMのようにこのリスト（${emosionList}）のいずれか場面や心情が大きく変わる部分ごとに大きく区切ってリストを返してください。レスポンスはjson形式のリストだけにしてください。
{
musics: [{start_text: "その音楽が始まる文章の先頭15文字。", music: "事件発生"}, {start_text: "その音楽が始まる文章の先頭15文字。", music: "夢幻的（ファンタジー）"}, ...]
}`;

/*
const prompt = `この文章「${element}」を映画のBGMのようにこのリスト（${emosionList}）のいずれか場面や心情が大きく変わる部分ごとに大きく区切って、それにあったBGMの実際のYoutubeのURLを検索して、それを含めたリストを返してください。srcにはダミーなどは含めないでください。レスポンスはjson形式のリストだけにしてください。
{
musics: [{start_text: "その音楽が始まる文章の先頭15文字。", music: "emosionListのいずれかの要素", src: "それにあったYoutubeの音楽のURL"}, {start_text: "その音楽が始まる文章の先頭15文字。", music: "emosionListのいずれかの要素", src: "それにあったYoutubeの音楽のURL"}, ...]
}`;
*/

      // gemini upload
      const genAI = new GoogleGenerativeAI(
        process.env.GEMINI_API_KEY!
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(prompt);

      const response = await result.response;
      const responseText = response.text();

      console.log(responseText)

      const cleanedText = responseText.replace(/```json\n|\n```/g, '');
      const jsonResponse = JSON.parse(cleanedText);

      
      return jsonResponse; // responseTextを設定
    } catch (e) {
      console.log(e);
    }
  }
};
