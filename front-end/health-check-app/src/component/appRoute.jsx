import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../component/Layout';
import Dashboard from '../pages/Dashboard';
import Appointment from '../pages/Appointment';
import Room from '../pages/Room';

const appRoute = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "appointment",
                element: <Appointment />,
            },
            {
                path: "room/:roomId/:userId/:userName",
                element: <Room />,
            }
        ]
    }
]);

export default appRoute;
