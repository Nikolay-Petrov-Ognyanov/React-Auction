import { useContext, useEffect } from "react"
import * as service from "../service"
import { useNavigate } from "react-router-dom"
import { Context } from "../Context"

export function Home() {
    const { user, users } = useContext(Context)

    const navigate = useNavigate()

    useEffect(() => {
        // if (!localStorage.getItem("username")) {
        //     navigate("/auth")
        // }

        service.getData().then(result =>
            console.log(result)
        ).catch(error => console.error(error))
    }, [])

    return (<section>
        Home Page
    </section>)
}