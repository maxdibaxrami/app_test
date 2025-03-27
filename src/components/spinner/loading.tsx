import { Spinner } from "@heroui/react"
import { useTranslation } from "react-i18next";


const Loading = () => {
    const { t } = useTranslation();
    
    return <div className='h-screen w-screen flex items-center justify-center'>
        <Spinner classNames={{label: "text-foreground mt-4"}} label={t("loading")} size="lg" />
    </div>
}

export default Loading