import { Spinner } from "@heroui/react"


const Loading = () => {
    
    return <div className='h-screen w-screen flex items-center justify-center'>
        <Spinner classNames={{label: "text-foreground mt-4"}} size="lg" />
    </div>
}

export default Loading