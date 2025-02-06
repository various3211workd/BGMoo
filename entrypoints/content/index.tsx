import "./style.css";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { i18nConfig } from "@/components/i18nConfig.ts";
import initTranslations from "@/components/i18n.ts";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",
  async main(ctx) {
    initTranslations(i18nConfig.defaultLocale, ["common", "content"]);
    const ui = await createShadowRootUi(ctx, {
      name: "language-learning-content-box",
      position: "inline",
      onMount: (container) => {
        console.log(container);
        const root = ReactDOM.createRoot(container);
        root.render(<App />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
