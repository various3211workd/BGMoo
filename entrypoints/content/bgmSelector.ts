/*
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
*/

const BgmSelector = async (responsetext: any) => {
  if (!responsetext) return;

  try{
    const LocalSoundList = await getLocalSoundList();

    // APIからデータを取得（仮のデータ）
    const usedBgm = new Set<string>();
    let previousBgm: any = null;
    const observedTexts = responsetext.musics.map(({ music, start_text }: any) => {
      console.log("start_text: %o", start_text);

      if (!LocalSoundList[music] || LocalSoundList[music].length === 0) {
        console.warn(`カテゴリ「${music}」に対応するBGMがありません`);
        return { title: "none", artist: "none", src: "none", tag: "none" };
      }

      let availableBgm = LocalSoundList[music].filter((b) => !usedBgm.has(b.src));
      if (availableBgm.length === 0) availableBgm = [...LocalSoundList[music]]; // すべて使用済みならリセット

      let randomBgm;
      do {
        randomBgm = availableBgm[Math.floor(Math.random() * availableBgm.length)];
      } while (randomBgm.src === previousBgm?.src && availableBgm.length > 1);

      usedBgm.add(randomBgm.src);
      previousBgm = randomBgm;

      return {
        title: randomBgm.title,
        artist: randomBgm.artist,
        src: randomBgm.src,
        tag: randomBgm.tag,
        start_text: start_text,
      };
    })

    return observedTexts;
  }catch{}
};

export default BgmSelector;

const getLocalSoundList = async () => {

  try{
    const response = await fetch(chrome.runtime.getURL("audio-samples.json"));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }catch{
    return null;
  }
};
