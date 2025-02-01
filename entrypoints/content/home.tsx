import React, { useState } from "react";
import { Card } from "@/components/ui/card.tsx";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Loader2, Music } from "lucide-react";
import "./home.css";
import SelectElement from "./selectElement";
import { SendGeminiAPI } from "./sendGeminiApi";
import { Switch } from "@/components/ui/switch";

const Home: React.FC<{
  references: any;
  setReferences: any;
  onRemoveReference: any;
  setSampleMusic: any;
  onAddReference: (reference: { name: string; url: string }) => void;
}> = ({
  references,
  setReferences,
  onRemoveReference,
  setSampleMusic,
  onAddReference,
}) => {
  const { t } = useTranslation();

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditName(references[index].name);
    setEditUrl(references[index].url);
  };

  const handleSave = (index: number) => {
    const count = references.filter((item: any, i: number) => {
      return i !== index && item.url.includes(editUrl);
    }).length;

    if (count > 0) {
      // もしすでに同じURLのものが含まれていた場合は、エラーを出す。
      alert("すでにおなじURLの文章があります。");
      return;
    }

    const updatedReferences = [...references];
    updatedReferences[index] = {
      ...updatedReferences[index],
      name: editName,
      url: editUrl,
    };
    localStorage.setItem("references", JSON.stringify(updatedReferences));

    setReferences(updatedReferences);
    setEditIndex(null);
  };

  return (
    <div className="grid gap-4">
      <h3 className="flex justify-between items-center font-semibold leading-none tracking-tight text-base">
        <div>{t("読む音楽のリスト")}</div>
        <div>
          <SelectElement
            onAddReference={onAddReference}
            setSampleMusic={setSampleMusic}
            references={references}
          />
        </div>
      </h3>
      <div className="home-height overflow-auto">
        {references.length != 0 ? (
          <>
            {references.map((reference, index) => (
              <Card
                key={index}
                className={`text-left my-2 ${
                  reference.url === window.location.href
                    ? "border-4 border-cyan-400"
                    : ""
                }`}
              >
                <div className="flex flex-col space-y-1.5 p-6 pb-3">
                  <div className="flex flex-col gap-4 pt-2">
                    <div key={index} className="grid gap-1">
                      {editIndex === index ? (
                        <>
                          <label className="block mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                            名前
                          </label>
                          <input
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                          <label className="block mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            URL{" "}
                          </label>
                          <span className="text-sm text-gray-400 mb-2">
                            ワイルドカード(*)を使用することで、他のページにアクセスした時にもBGMの読み込みに対応させることができます。(http://example.com/page/*)
                          </span>
                          <input
                            className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                          />
                          <div className="flex justify-center items-center">
                            <button
                              className="text-red-500 mr-12"
                              onClick={() => onRemoveReference(index)}
                            >
                              削除
                            </button>
                            <Button onClick={() => handleSave(index)}>
                              保存
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex">
                            <p className="text-sm font-medium leading-none">
                              {reference.name}
                            </p>
                            <Edit
                              className="ml-2 cursor-pointer"
                              size={16}
                              onClick={() => handleEdit(index)}
                            />
                          </div>
                          <a
                            className="text-sm text-muted-foreground"
                            href={reference.url}
                            target="_blank"
                            title={reference.url}
                          >
                            {reference.url.length > 20
                              ? reference.url.slice(0, 28) + "..."
                              : reference.url}
                          </a>
                        </>
                      )}

                      {editIndex !== index && (
                        <div className="flex justify-end gap-2 items-center">
                          <Switch
                            defaultChecked={reference.isAllReadyMusic}
                            onCheckedChange={(checked) => {
                              references[index].isAllReadyMusic = checked;
                              localStorage.setItem(
                                "references",
                                JSON.stringify(references)
                              );
                            }}
                          />
                          <Button
                            className=""
                            onClick={async () => {
                              setIsRunning(true);
                              const analyzeText = await SendGeminiAPI(
                                reference.path
                              );
                              setSampleMusic(analyzeText);
                              setIsRunning(false);
                            }}
                            title="場面に合うBGMを設定する"
                            size="icon"
                            variant="outline"
                            disabled={isRunning}
                          >
                            {isRunning ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Music className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
            <div className="mb-4">
              <FileText size={64} />
            </div>
            <p className="text-center mb-2">
              追加された文章の要素がありません！
            </p>
            <p className="text-center flex items-center">
              <span className="mr-1">「+ 追加する」ボタン</span>
              <span className="ml-1">から追加しよう</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
