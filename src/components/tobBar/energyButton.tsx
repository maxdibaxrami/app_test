import { Button } from "@heroui/react"
import { SparklesFlashIconText } from "../animate/flash-sparkles"
import { Link } from "react-router-dom"
import { FlashIcon } from "@/Icons"

export const EnergyButton = () => {

    return <SparklesFlashIconText
    text={
      <Button
        variant="solid"
        size="sm"
        isIconOnly
        aria-label="Energy"
        color="success"
        as={Link}
        to={'/energy'}
        style={{minWidth:"unset"}}
        className="px-0 py-0 w-6 h-6"
      >
          <FlashIcon fill="#FFFFFF" className="size-4" />
      </Button>
    }
    colors={{ first: "#f59e0c", second: "#f59e0c" }}
    sparklesCount={5}
  />
}