import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const preloadedState = {
    auth: {
        user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    },
};

const AppStore = configureStore({

    reducer: {
        auth: authReducer,
    },
    preloadedState

});

export default AppStore;