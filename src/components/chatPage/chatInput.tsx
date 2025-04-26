import { Input } from "@heroui/react";
import { useTranslation } from "react-i18next";

const ChatInput = ({inputMessage, setInputMessage}) => {
  const { t } = useTranslation();


  return (
    <div
      className="flex right-0 left-0 items-center justify-between bottom-0"
      style={{ width: "100%"}}
    >

      <Input
        className="w-full"
        value={inputMessage}
        onValueChange={setInputMessage}
        radius="none"
        placeholder={t("enterMessage")}
        size="lg"
        variant="flat"
      />
    </div>
  );
};

export default ChatInput;