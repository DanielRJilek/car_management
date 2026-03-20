import { useContext } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router'
import { AuthContext, AuthContextProvider } from './context/AuthContext'
import { UserContext, UserContextProvider } from './context/UserContext'
import './css/styles.css'
import './css/index.css'
import routes from './routing/routes'

function App() {
  const user = useContext(AuthContext);
  const username = useContext(UserContext)
  
  const router = createBrowserRouter(routes);
  return (
    <AuthContextProvider value={user}>
      <UserContextProvider value={username}>
        <RouterProvider router={router} />
      </UserContextProvider>
    </AuthContextProvider>
  )
}

export default App