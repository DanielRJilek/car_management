import CarsPage from "./components/CarsPage";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import Sales from "./components/Sales";
import SignUp from "./components/Signup";
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
      path: "/signup",
        element: (
          <Home>
            <SignUp />
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