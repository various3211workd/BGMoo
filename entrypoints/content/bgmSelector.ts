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

// カテゴリごとのBGMリスト
const bgmLibrary = {
  感動: [
    { title: "シャイニングスター", artist: "詩歩", src: "maou_14_shining_star.mp3", tag: "" },
    { title: "Burning Heart", artist: "KEI", src: "maou_08_burning_heart.mp3", tag: "" },
  ],
  壮大: [
    { title: "シャイニングスター", artist: "詩歩", src: "maou_14_shining_star.mp3", tag: "" },
    { title: "Burning Heart", artist: "KEI", src: "maou_08_burning_heart.mp3", tag: "" },
  ],
  "夢幻的（ファンタジー）": [
    { title: "シャイニングスター", artist: "詩歩", src: "maou_14_shining_star.mp3", tag: "" },
    { title: "Burning Heart", artist: "KEI", src: "maou_08_burning_heart.mp3", tag: "" },
  ],
};

const BgmSelector = (responsetext: any) => {
  if (!responsetext) return;

  // APIからデータを取得（仮のデータ）
  const usedBgm = new Set<string>();
  let previousBgm = null;
  const observedTexts = responsetext.musics.map(({ music, start_text }) => {
    console.log("start_text: %o", start_text);

    if (!bgmLibrary[music] || bgmLibrary[music].length === 0) {
      console.warn(`カテゴリ「${music}」に対応するBGMがありません`);
      return { title: "none", artist: "none", src: "none", tag: "none" };
    }

    let availableBgm = bgmLibrary[music].filter((b) => !usedBgm.has(b.src));
    if (availableBgm.length === 0) availableBgm = [...bgmLibrary[music]]; // すべて使用済みならリセット

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
  });

  console.log(observedTexts);

  return observedTexts;
};

export default BgmSelector;
