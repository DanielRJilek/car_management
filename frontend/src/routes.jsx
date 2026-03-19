import CarsPage from "./components/CarsPage";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import Welcome from "./components/Welcome";

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
    },
    {
       path: "/cars",
        element: (<Home>
            <CarsPage></CarsPage>
        </Home>), 
    }
]

export default routes