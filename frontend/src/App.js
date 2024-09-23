import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import MainPage from "./components/mainPage/mainPage";
import { Provider } from "react-redux";
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { LoginSuccess } from "./components/loginSuccess/loginSuccess";


function App() {  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className='App'>
            <Routes>
              <Route path="/" element={<MainPage/>} />
              <Route path="/login/success" element={<LoginSuccess/>} />
              <Route path="/login/failed" element={<div>Failed :(</div>} />
            </Routes>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
