import React, { useEffect, useRef, useState } from "react";
import "./App.module.css";
import "../../assets/main.css";
import { Home } from "@/entrypoints/content/home.tsx";
import { SettingsPage } from "@/entrypoints/content/settings.tsx";
import Sidebar, { SidebarType } from "@/entrypoints/sidebar.tsx";
import { browser } from "wxt/browser";
import ExtMessage, { MessageType } from "@/entrypoints/types.ts";
import Header from "@/entrypoints/content/header.tsx";
import Footer from "@/entrypoints/content/footer.tsx";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider.tsx";
import ViewPort from "./viewport";

export default () => {
  const [showContent, setShowContent] = useState(true);
  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.home);
  const [headTitle, setHeadTitle] = useState("home");
  const [references, setReferences] = useState<{ name: string; url: string }[]>(
    []
  );
  const [responseText, setResponseText] = useState(null); // responseTextを管理
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
  }, []);

  const handleAddReference = (reference: { name: string; url: string }) => {
    setReferences([...references, reference]);
  };

  const handleRemoveReference = (index: number) => {
    setReferences(references.filter((_, i) => i !== index));
  };

  const handleSetResponseText = (response: any) => {
    setResponseText(response);
  };

  const handleSetNowPlayMusic = (music: string) => {
    setNowStartText(music);
  };

  return (
    <div className={theme}>
      <ViewPort
        responseText={responseText}
        setNowStartText={handleSetNowPlayMusic}
      />

      {showContent && (
        <div className="fixed top-0 right-0 h-screen w-[400px] bg-background z-[1000000000000] rounded-l-xl shadow-2xl overflow-hidden">
          <Header headTitle={headTitle} />
          <Sidebar
            closeContent={() => {
              setShowContent(false);
            }}
            sideNav={(sidebarType: SidebarType) => {
              setSidebarType(sidebarType);
              setHeadTitle(sidebarType);
            }}
          />
          <main className="mr-14 grid gap-4 p-4">
            {sidebarType === SidebarType.home && (
              <Home
                references={references}
                onRemoveReference={handleRemoveReference}
                setResponseText={handleSetResponseText} // responseTextを設定する関数を渡す
              />
            )}
            {sidebarType === SidebarType.settings && <SettingsPage />}
          </main>
          <Footer
            onAddReference={handleAddReference}
            musicSamples={responseText}
            nowStartText={nowStartText}
          />
        </div>
      )}
    </div>
  );
};
