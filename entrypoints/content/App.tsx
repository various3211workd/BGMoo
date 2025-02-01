import React, { useEffect, useRef, useState } from "react";
import "./App.module.css";
import "../../assets/main.css";
import Home from "./home";
import { SettingsPage } from "@/entrypoints/content/settings.tsx";
import Sidebar, { SidebarType } from "@/entrypoints/sidebar.tsx";
import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/types.ts";
import Header from "@/entrypoints/content/header.tsx";
import Footer from "@/entrypoints/content/footer.tsx";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider.tsx";
import ViewPort from "./viewport";
import { SendGeminiAPI } from "./sendGeminiApi";

export default () => {
  const [showContent, setShowContent] = useState(true);
  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.home);
  const [headTitle, setHeadTitle] = useState("home");
  const [references, setReferences] = useState<{ name: string; url: string }[]>(
    []
  );
  const [sampleMusic, setSampleMusic] = useState(null); // sampleMusicを管理
  const [nowStartText, setNowStartText] = useState("");

  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

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
        } else if (message.messageType == MessageType.changeTheme) {
          toggleTheme(message.content);
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
          console.log(analyzeText);
          setSampleMusic(analyzeText);
        };
        getMusicSamples();
      }
    }
  }, []);

  const handleAddReference = (reference: { name: string; url: string }) => {
    setReferences([...references, reference]);
    localStorage.setItem(
      "references",
      JSON.stringify([...references, reference])
    );
  };

  const handleRemoveReference = async (index: number) => {
    await setReferences(references.filter((_, i) => i !== index));
    localStorage.setItem("references", JSON.stringify(references));
  };

  const handleSetNowStartText = (start_text: string) => {
    setNowStartText(start_text);
  };

  return (
    <div className={theme}>
      <ViewPort
        sampleMusic={sampleMusic}
        setNowStartText={handleSetNowStartText}
      />

      {showContent ? (
        <div className="fixed top-0 right-0 h-screen w-[400px] bg-background z-[1000000000000] rounded-l-xl shadow-2xl overflow-hidden">
          <Header headTitle={headTitle} />
          <Sidebar
            closeContent={() => {
              setShowContent(!showContent);
            }}
            sideNav={(sidebarType: SidebarType) => {
              setSidebarType(sidebarType);
              setHeadTitle(sidebarType);
            }}
            showContent={showContent}
          />
          <main className="mr-14 grid gap-4 p-4">
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
          <Footer musicSamples={sampleMusic} nowStartText={nowStartText} />
        </div>
      ) : (
        <Sidebar
          closeContent={() => {
            setShowContent(!showContent);
          }}
          sideNav={(sidebarType: SidebarType) => {
            setSidebarType(sidebarType);
            setHeadTitle(sidebarType);
          }}
          showContent={showContent}
        />
      )}
    </div>
  );
};
