import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import AppLayout from './components/AppLayout'

import Home from './pages/Home'
import Categories from './pages/Categories'
import Resources from './pages/Resources'
import Search from './pages/Search'
import About from './pages/About'
import Contact from './pages/Contact'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Upload from './pages/Upload'
import EditResource from "./pages/EditResource";
import EditProfile from './pages/EditProfile'
import CategoryResources from './pages/CategoryResources'
import Community from './pages/Community'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "categories",
          element: <Categories />
        },
        {
          path: "resources",
          element: <Resources />
        },
        {
          path: "search",
          element: <Search />
        },
        {
          path: "about",
          element: <About />
        },
        {
          path: "contact",
          element: <Contact />
        },
        {
          path: "signin",
          element: <SignIn />
        },
        {
          path: "signup",
          element: <SignUp />
        },
        {
          path: "profile",
          element: <Profile />
        },
        {
          path: "upload",
          element: <Upload />
        },
        {
  path: "resources/edit/:id",
  element: <EditResource />,
},
        { path: "profile/edit", element: <EditProfile /> },
        {
  path: "/categories/:id/resources",
  element: <CategoryResources />,
        },
        {
          path: "community",
          element: <Community />
        }
      ]
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
