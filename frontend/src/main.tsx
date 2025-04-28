import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
// @ts-expect-error:  Ожидаемая ошибка из-за несовместимости типов в API
import store from "./store/index.js";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <BrowserRouter> */}
      <HashRouter>
        <App />
      </HashRouter>
      {/* </BrowserRouter> */}
    </Provider> 
  </React.StrictMode>,
)
