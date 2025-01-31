import React, { useEffect } from "react";

const ViewPort: React.FC<{ responseText: any }> = ({ responseText }) => {
  useEffect(() => {
    if (responseText) {
      observeText(responseText);
    }
  }, [responseText]);

  const observeText = (responseText) => {
    const observedTexts = responseText.map((item) => item.start_text);

    const activeElements = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;

            console.log("viewportの中に入ったとき:", entry.target.textContent);
            activeElements.add(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    const findAndObserveText = () => {
      document.querySelectorAll("p, span, div").forEach((el) => {
        if (observedTexts.some((text) => el.textContent.includes(text))) {
          observer.observe(el);
        }
      });
    };

    findAndObserveText();
  };

  return null;
};

export default ViewPort;
