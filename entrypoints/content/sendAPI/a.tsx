import { useState, useEffect } from "react";
import { saveSampleMusics, getSampleMusics } from "./sampleMusicsAPI";

export default function Popup(setReferences: any) {
  const [token, setToken] = useState<string | null>(null);

  const [settings, setSettings] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleSave = async () => {
    if (userId && token) {
      await saveSampleMusics(userId, token, settings);
      alert("設定が保存されました！");
    }
  };

  const handleGet = async () => {
    if (userId && token) {
      const samples = await getSampleMusics(userId, token);
      console.log("samples: ", samples);
    }
  };

  return (
    <div className="">
      {token ? (
        <>
          <textarea
            value={settings ? JSON.stringify(settings, null, 2) : ""}
            onChange={(e) => setSettings(JSON.parse(e.target.value))}
          />
          <br />
          <button onClick={handleSave}>保存</button>
          <br />
          <button onClick={handleGet}>GET</button>
          <br />
          <button
            onClick={() => {
              setSettings({ test: ["1", "2", "3"] });
            }}
          >
            testデータを書き込む
          </button>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
