import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../component/Layout';
import Dashboard from '../pages/Dashboard';
import Appointment from '../pages/Appointment';
import Room from '../pages/Room';
import Login from '../pages/Login';
import ProtectRoute from './ProtectRoute';

const appRoute = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/",
        element: <ProtectRoute />,
        children: [
            {
                path: "/",
                element: <Layout />,
                children: [
                    { path: 'dashboard', element: <Dashboard /> },
                    { path: 'appointment', element: <Appointment /> },
                    { path: 'room/:roomId/:userId/:userName', element: <Room /> },
                ]
            },
        ]
    }
]);

export default appRoute;
