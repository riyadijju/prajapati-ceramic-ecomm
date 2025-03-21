
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import TestCart from './components/TestCart'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>

    <Navbar/>
    <Outlet/>
    <Footer/>
    <TestCart/>
    </>
  )
}

export default App
