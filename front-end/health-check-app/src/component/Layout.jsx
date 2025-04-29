import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../component/Header'; // adjust path as needed

const Layout = () => {
    return (
        <div>
            <Header />
            <main className="pt-4 px-4">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
