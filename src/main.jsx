import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import Admin from './admin/Admin.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: '/admin',
        element: <Admin/>
    },
  
])
ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)
