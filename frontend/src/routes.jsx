import LogIn from "./components/LogIn";
import Welcome from "./components/Welcome";
import Home from "./components/Home";

const routes = [
    {
        path: "/",
        element: (<Home>
            <Welcome></Welcome>
        </Home>),
    },
    {
       path: "/auth",
        element: (<Home>
            <LogIn></LogIn>
        </Home>), 
    }
]

export default routes