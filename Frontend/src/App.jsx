import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TestCart from './components/TestCart';
import { ToastContainer } from 'react-toastify'; // Import the ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify CSS for styling

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <TestCart />

      {/* Add the ToastContainer here to render toast notifications */}
      <ToastContainer 
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover
      />
    </>
  );
}

export default App;
