import './index.css'
import routes from './routes'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { AuthContext, AuthContextProvider } from './context/AuthContext'
import { useContext} from 'react'
import { UserContext, UserContextProvider } from './context/UserContext'

function App() {
  const user = useContext(AuthContext);
  const username = useContext(UserContext)
  
  const router = createBrowserRouter(routes);
  return (
    <AuthContextProvider value={user}>
      <UserContextProvider value={username}>
        <RouterProvider router={router}>
          <App/>
      </RouterProvider>
      </UserContextProvider>
    </AuthContextProvider>
  )
}

export default App