import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ResetPasswordToken from './pages/ResetPasswordToken'
import ResetPassword from './pages/ResetPassword'
import OpenRoute from './components/auth/OpenRoute'
import PrivateRoute from './components/auth/PrivateRoute'
import Home from './pages/Home'
import Project from './pages/Project'

function App() {

  return (

    <div>

      <Routes>

        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/forgot-password' element={<OpenRoute><ResetPasswordToken/></OpenRoute>}/>
        <Route path='/update-password/:token' element={<OpenRoute><ResetPassword/></OpenRoute>}/>
        <Route path='/project/:projectId' element={<Project/>}/>
      </Routes>

    </div>
  
  )
}

export default App
