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

