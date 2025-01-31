import React, { useEffect } from "react";

const ViewPort: React.FC<{
  responseText: any;
  setNowStartText: (music: string) => void;
}> = ({ responseText, setNowStartText }) => {
  useEffect(() => {
    if (responseText) {
      observeText(responseText);
    }
  }, [responseText]);

  const observeText = (responseText: any) => {
    const observedTexts = responseText.map((item: any) => item.start_text);

    const activeElements = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;

            //console.log("viewportの中に入ったとき:", entry.target.textContent);
            setNowStartText(entry.target.textContent);
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
