import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '../component/Layout';
import Dashboard from '../pages/Dashboard';
import Room from '../pages/Room';
import Login from '../pages/Login';
import UserProfile from '../pages/UserProfile';
import ProtectRoute from './ProtectRoute';
import BookAppointment from '../pages/BookAppointment';
import AppointmentListServ from './AppointmentListServ';
import AppointmentDetail from './AppointmentDetail';

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
                    { 
                        path: 'dashboard', 
                        element: <Dashboard />,
                        loader: async () => {
                            const user = JSON.parse(localStorage.getItem("user"));
                            if (user?.user?.role === 'DOCTOR') {
                                return window.location.href = '/appointment';
                            }
                            return null;
                        }
                    },
                    { path: 'room/:roomId/:userId/:userName', element: <Room /> },
                    { path: 'profile', element: <UserProfile /> },
                    { path: 'book/:id', element: <BookAppointment /> },
                    { path: 'appointment', element: <AppointmentListServ /> },
                    { path: 'appointments/:id', element: <AppointmentDetail /> }
                ]
            },
        ]
    }
]);

export default appRoute;
