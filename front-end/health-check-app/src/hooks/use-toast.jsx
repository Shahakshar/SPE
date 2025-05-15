import { useState } from 'react';

export const useToast = () => {
    const [toastState, setToastState] = useState({ open: false, message: null, type: 'success' });

    const toast = (message, type = 'success') => {
        setToastState({ open: true, message, type });
        setTimeout(() => {
            setToastState({ open: false, message: null, type: 'success' });
        }, 3000);
    };

    return {
        toast,
        toastState,
        closeToast: () => setToastState({ open: false, message: null, type: 'success' })
    };
};