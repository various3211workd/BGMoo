import { Card } from "@/components/ui/card.tsx";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";

export function AuteUseGeiniAPISettings() {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="space-y-1.5 p-6 pb-3">
        <h3 className="font-semibold text-left text-base">
          {t("自動音楽設定")}
        </h3>
        <p>ページを追加した際に、自動で音楽を作成する。</p>
      </div>
      <div className="flex items-center space-y-1.5 justify-end mr-4 mb-4">
        <Switch
          defaultChecked={JSON.parse(
            localStorage.getItem("autoSendSetting") === "true"
          )}
          onCheckedChange={(checked) => {
            localStorage.setItem("autoSendSetting", JSON.stringify(checked));
          }}
        />
      </div>
    </Card>
  );
}
