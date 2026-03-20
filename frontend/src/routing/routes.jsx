import CarsPage from "../components/CarsPage";
import Home from "../components/Home";
import LogIn from "../components/LogIn";
import SalesPage from "../components/SalesPage";
import SignUp from "../components/Signup";
import Welcome from "../components/Welcome";
import ProtectedRoute from "./ProtectedRoute";

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
          <ProtectedRoute>
            <Home>
              <CarsPage />
            </Home>
          </ProtectedRoute>
          
        ),
    },
    {
       path: "/sales",
        element: (
          <ProtectedRoute>
            <Home>
              <SalesPage />
            </Home>
          </ProtectedRoute>
        ),
    }
]

export default routes