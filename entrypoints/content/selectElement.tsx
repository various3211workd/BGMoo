import { Button } from "@/components/ui/button";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SendGeminiAPI } from "./sendGeminiApi";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const SelectElement: React.FC<{
  onAddReference: (reference: { name: string; url: string }) => void;
  setSampleMusic: any;
  references: any;
}> = ({ onAddReference, setSampleMusic, references }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const isAutoSendSetting = JSON.parse(
    localStorage.getItem("autoSendSetting") === "true"
  );

  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      if (!isAdding) return;
      const target = event.target as HTMLElement;
      target.style.outline = "2px solid rgba(166, 241, 224, 1)";
      target.style.backgroundColor = "rgba(115, 199, 199, 0.2)";

      target.addEventListener(
        "mouseout",
        () => {
          target.style.outline = "";
          target.style.backgroundColor = "";
        },
        { once: true }
      );
    };

    const handleElementClick = async (event: MouseEvent) => {
      try {
        if (!isAdding) return;

        const target = event.target as HTMLElement;

        event.preventDefault();
        event.stopPropagation();

        setIsAdding(false);
        if (target.innerText == "") {
          return; // もし何も含まれていなかったら戻る
        }

        setIsRunning(true);

        const path: string[] = [];
        let currentElement: HTMLElement | null = target;

        while (currentElement) {
          let selector = currentElement.tagName.toLowerCase();
          const className = currentElement.className;

          const id = currentElement.id;
          if (id) {
            selector += `#${id}`;
          } else if (className) {
            selector += `.${className.split(" ").join(".")}`;
          }
          path.unshift(selector);
          currentElement = currentElement.parentElement;
        }

        let href = window.location.href;
        if (target.querySelectorAll) {
          const aElements = target.querySelectorAll("a");
          aElements.forEach((a) => {
            if (a.href) {
              href = a.href;
            }
          });
        }

        const reference = {
          name: target.innerText.slice(0, 16),
          url: href,
          path: path,
          isAllReadyMusic: false,
        };

        const foundItems = references.filter((item) => item.url.includes(href));
        if (foundItems.length != 0) {
          // もしすでに同じURLのものが含まれていた場合は、エラーを出す。
          alert("すでにおなじURLの文章があります。");
          return;
        }

        onAddReference(reference);

        if (isAutoSendSetting) {
          // 自動でgeminiに送信する設定になっているか。
          const analyzeText = await SendGeminiAPI(path);
          setSampleMusic(analyzeText);
        }
      } finally {
        setIsRunning(false);
      }
    };

    if (isAdding) {
      const elements = document.querySelectorAll("a, button");

      elements.forEach((element) => {
        element.style.pointerEvents = "none";
      });

      setTimeout(() => {
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("click", handleElementClick);
      }, 500);
    } else {
      const elements = document.querySelectorAll("a, button");

      elements.forEach((element) => {
        element.style.pointerEvents = "auto";
      });

      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("click", handleElementClick);
    }

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("click", handleElementClick);
    };
  }, [isAdding, onAddReference]);

  const handleAddClick = () => {
    const alreadyHaveNum = references.filter((item: any) =>
      item.url.includes(window.location.href)
    ).length;

    if (alreadyHaveNum != 0) {
      alert("すでにおなじURLの文章があります。");
      return;
    }

    setIsAdding(true);
  };

  const [isHaveNum, setIsHaveNum] = useState(false);
  useEffect(() => {
    const matchedItem = references.find((item: any) => {
      const regex = new RegExp(item.url.replace(/\*/g, ".*"));
      return regex.test(window.location.href);
    });

    if (matchedItem) {
      setIsHaveNum(true);
    } else {
      setIsHaveNum(false);
    }
  }, [references]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-not-allowed self-end">
          <Button
            className={`text-white font-bold rounded
          ${
            isAdding
              ? "bg-red-500 hover:bg-red-700"
              : "bg-blue-500 hover:bg-blue-700 text-sm"
          }`}
            onClick={handleAddClick}
            variant="ghost"
            disabled={isRunning || isHaveNum}
          >
            {isAdding ? (
              <>
                Cancel
                <X className="h-4 w-4 font-bold" />
              </>
            ) : (
              <>
                {isRunning ? (
                  <>
                    <Loader2 className="animate-spin" />
                    追加中
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 font-bold" />
                    追加する
                  </>
                )}
              </>
            )}
          </Button>
        </TooltipTrigger>
        {isHaveNum && (
          <TooltipContent>このURLはすでに追加されています</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default SelectElement;
