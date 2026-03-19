import CarsPage from "./components/CarsPage";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import Sales from "./components/Sales";
import Welcome from "./components/Welcome";

const routes = [
    {
        path: "/",
        element: (
          <Home>
            <Welcome />
          </Home>
        ),
    },
    {
       path: "/auth",
        element: (
          <Home>
            <LogIn />
          </Home>
        ),
    },
    {
       path: "/cars",
        element: (
          <Home>
            <CarsPage />
          </Home>
        ),
    },
    {
       path: "/sales",
        element: (
          <Home>
            <Sales />
          </Home>
        ),
    }
]

export default routes