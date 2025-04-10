import './App.css'
import AppRouter from './routes'
import { ToastContainer, Slide } from 'react-toastify';


function App() {

  return (
    <div data-theme="silk">
      <AppRouter />
      <ToastContainer
        position="top-center"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
      />
    </div>

  )
}

export default App
