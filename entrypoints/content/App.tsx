import { useEffect, useState } from "react";
import "./App.module.css";
import "../../assets/main.css";
import Home from "./home";
import { SettingsPage } from "@/entrypoints/content/settings.tsx";
import Sidebar, { SidebarType } from "@/entrypoints/sidebar.tsx";
import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/types.ts";
import Footer from "@/entrypoints/content/footer.tsx";
import { useTranslation } from "react-i18next";
import ViewPort from "./viewport";
import { SendGeminiAPI } from "./sendAPI/sendGeminiApi";
import { getReferences, saveReferences } from "./sendAPI/referencesAPI";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "./sendAPI/auth";

export default () => {
  const [showContent, setShowContent] = useState<boolean>(
    JSON.parse(localStorage.getItem("isOpenSidebar")) || false
  );

  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.home);
  const [references, setReferences] = useState<{ name: string; url: string }[]>(
    []
  );
  const [sampleMusic, setSampleMusic] = useState(null); // sampleMusicを管理
  const [nowStartText, setNowStartText] = useState("");

  const { i18n } = useTranslation();

  async function initI18n() {
    let data = await browser.storage.local.get("i18n");
    if (data.i18n) {
      await i18n.changeLanguage(data.i18n);
    }
  }

  function domLoaded() {
    //console.log("dom loaded");
  }

  useEffect(() => {
    if (document.readyState === "complete") {
      // load event has already fired, run your code or function here
      //console.log("dom complete");
      domLoaded();
    } else {
      // load event hasn't fired, listen for it
      window.addEventListener("load", () => {
        // your code here
        //console.log("content load:");
        //console.log(window.location.href);
        domLoaded();
      });
    }
    browser.runtime.onMessage.addListener(
      (message: ExtMessage, sender, sendResponse) => {
        //console.log("content:");
        //console.log(message);
        if (message.messageType == MessageType.clickExtIcon) {
          setShowContent(true);
        } else if (message.messageType == MessageType.changeLocale) {
          i18n.changeLanguage(message.content);
        }
      }
    );

    initI18n();

    // セーブデータ呼び出し
    const savedData = localStorage.getItem("references");
    if (savedData) {
      // セーブデータ内に、自動解析がonになっていて、URLが設定したものだったら自動で解析してBGMを設定するようにする。
      const jsonSavedData = JSON.parse(savedData);
      setReferences(jsonSavedData);

      const matchedItem = jsonSavedData.find((item: any) => {
        const regex = new RegExp(item.url.replace(/\*/g, ".*"));
        return item.isAllReadyMusic && regex.test(window.location.href);
      });

      if (matchedItem) {
        const getMusicSamples = async () => {
          const analyzeText = await SendGeminiAPI(matchedItem.path);

          setSampleMusic(analyzeText);
        };
        getMusicSamples();
      }
    }

    chrome.storage.local.get(["userId", "token"], async (result) => {
      if (result.userId && result.token) {
        async () => {
          const refs = await getReferences(result.userId, result.token);
          setReferences(refs);
        };
      }
    });
    chrome.storage.local.get(["references"], async (result) => {
      if (result.references) {
        setReferences(result.references);
      }
    });
  }, []);

  const handleAddReference = (reference: { name: string; url: string }) => {
    setReferences([...references, reference]);
    localStorage.setItem(
      "references",
      JSON.stringify([...references, reference])
    );
    saveReferences(references);
  };

  const handleRemoveReference = async (index: number) => {
    await setReferences(references.filter((_, i) => i !== index));
    localStorage.setItem("references", JSON.stringify(references));
    saveReferences(references);
  };

  const handleSetNowStartText = (start_text: string) => {
    setNowStartText(start_text);
  };

  const handleLogin = async () => {
    try {
      const [userToken, userId] = await signInWithGoogle();
      if (userToken && userId) {
        chrome.storage.local.set({ userId: userId, token: userToken }, () => {
          console.log("Data is saved.");
        });

        const refs = await getReferences(userId, userToken);
        if (refs.lenght !== 0) {
          setReferences(refs);
        }
        console.log("ログイン成功:");
      }
    } catch (error) {
      console.error("ログイン失敗:");
    }
  };

  return (
    <div>
      <ViewPort
        sampleMusic={sampleMusic}
        setNowStartText={handleSetNowStartText}
      />

      <Button
        onClick={() => {
          handleLogin();
        }}
      >
        ボタン
      </Button>

      {showContent ? (
        <div className="fixed top-0 right-0 h-screen w-[400px] bg-[#F6F4F0] z-20 rounded-l-xl shadow-2xl overflow-hidden">
          <Sidebar
            closeContent={() => {
              setShowContent(!showContent);
            }}
            sideNav={(sidebarType: SidebarType) => {
              setSidebarType(sidebarType);
            }}
            showContent={showContent}
          />
          <main className="mr-14 grid gap-4 p-4 bg-[#F6F4F0]">
            {sidebarType === SidebarType.home && (
              <Home
                references={references}
                setReferences={setReferences}
                onRemoveReference={handleRemoveReference}
                setSampleMusic={setSampleMusic}
                onAddReference={handleAddReference}
              />
            )}
            {sidebarType === SidebarType.settings && <SettingsPage />}
          </main>
        </div>
      ) : (
        <div className="fixed top-0 right-0 h-screen bg-background z-50 rounded-l-xl shadow-2xl bg-[#2E5077]">
          <Sidebar
            closeContent={() => {
              setShowContent(!showContent);
            }}
            sideNav={(sidebarType: SidebarType) => {
              setSidebarType(sidebarType);
            }}
            showContent={showContent}
          />
        </div>
      )}

      <Footer
        musicSamples={sampleMusic}
        setMusicSamples={setSampleMusic}
        nowStartText={nowStartText}
      />
    </div>
  );
};
