import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Invoices from './components/Invoices';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <ToastContainer/>
      <Invoices/>
    </div>
  );
}

export default App;
