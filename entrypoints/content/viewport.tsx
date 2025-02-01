import React, { useEffect } from "react";

const ViewPort: React.FC<{
  sampleMusic: any;
  setNowStartText: (start_text: string) => void;
}> = ({ sampleMusic, setNowStartText }) => {
  useEffect(() => {
    if (sampleMusic) {
      observeText(sampleMusic);
    }
  }, [sampleMusic]);

  const observeText = (sampleMusic: any) => {
    const observedTexts = sampleMusic.map((item: any) => item.start_text);

    const activeElements = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;

            //console.log("viewportの中に入ったとき:", entry.target.textContent);
            setNowStartText(entry.target.textContent.slice(0, 20)); // 先頭20文字を返すようにする。(少し多めに取得することで、geminiAPIからのレスポンスの誤差に対応する)
            activeElements.add(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    const findAndObserveText = () => {
      document.querySelectorAll("p, span, div").forEach((el) => {
        if (observedTexts.some((text: any) => el.textContent.includes(text))) {
          observer.observe(el);
        }
      });
    };

    findAndObserveText();
  };

  return null;
};

export default ViewPort;
