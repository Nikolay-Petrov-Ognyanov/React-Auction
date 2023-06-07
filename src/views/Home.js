import { useEffect } from "react"
import * as service from "../service"

export default function Home() {
    useEffect(() => {
        service.getData().then(result =>
            console.log(result)
        ).catch(error => console.error(error))
    }, [])

    return (<section>
        Home Page
    </section>)
}