import { GoogleGenerativeAI } from "@google/generative-ai";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card.tsx";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import BgmSelector from "./bgmSelector";

export function Home({ references, onRemoveReference, setResponseText }) {
  const { t } = useTranslation();

  const reAnalyze = async (path) => {
    const element = document.querySelector(path.join(" "));
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
  [{start_text: "その音楽が始まる文章の先頭15文字。", music: "事件発生"}, {start_text: "その音楽が始まる文章の先頭15文字。", music: "夢幻的（ファンタジー）"}, ...]
  }`;

        // gemini upload
        //console.log(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
        /*
        const genAI = new GoogleGenerativeAI(
          //process.env.NEXT_PUBLIC_GEMINI_API_KEY!
          "AIzaSyDqbVFWRzx47DNWJinyOmz0tdPawFZ4cp4"
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
              //music: "~/assets/music/maou_14_shining_star.mp3",
            },
            {
              start_text: "「よし、いいぞ俺。伊達に妄想し",
              music: "夢幻的（ファンタジー）",
              //music: "~/assets/music/maou_08_burning_heart.mp3",
            },
            {
              start_text: "「ジャンルは異世界ファンタジー",
              music: "壮大",
              //music: "~/assets/music/maou_14_shining_star.mp3",
            },
            {
              start_text: "指をわきわきさせながら今後を不",
              music: "壮大",
              //music: "~/assets/music/maou_14_shining_star.mp3",
            },
          ],
        };

        setResponseText(BgmSelector(responseText)); // responseTextを設定
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className="grid gap-4">
      <Card className="text-left">
        <div className="flex flex-col space-y-1.5 p-6 pb-3">
          <h3 className="font-semibold leading-none tracking-tight text-base">
            {t("reference")}
          </h3>
          <div className="flex flex-col gap-4 pt-2">
            {references.map((reference, index) => (
              <div key={index} className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {reference.name}
                </p>
                <a
                  className="text-sm text-muted-foreground"
                  href={reference.url}
                  target="_blank"
                >
                  {reference.url}
                </a>
                <p className="text-sm text-muted-foreground">
                  {reference.path}
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    className="text-red-500"
                    onClick={() => onRemoveReference(index)}
                  >
                    削除
                  </button>
                  <Button
                    className=""
                    onClick={() => {
                      reAnalyze(reference.path);
                    }}
                  >
                    再度解析
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
