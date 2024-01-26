import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import store from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './routes';
import { ClerkProvider } from '@clerk/clerk-react'
import { SignedOut, SignedIn } from "@clerk/clerk-react"

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY
console.log(process.env, process.env.REACT_APP_CLERK_PUBLISHABLE_KEY)

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ToastContainer position="bottom-center"
      className="custom-toast-container" />
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>

        <Router>
          <App />
        </Router>
      </Provider>
    </ClerkProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
