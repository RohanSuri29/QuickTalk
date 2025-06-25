import { useEffect } from "react"

function ClickOutside (ref , handler) {

    useEffect(() => {

        const listener = (event) => {

            if(!ref.current || ref.current.contains(event.target)){
                return
            }

            handler(event);
        }

        addEventListener("mousedown" , listener);
        addEventListener("touchstart" , listener);

        return () => {
            removeEventListener("mousedown" , listener);
            removeEventListener("touchstart" , listener);
        }

    } , [ref,handler])
}

export default ClickOutside