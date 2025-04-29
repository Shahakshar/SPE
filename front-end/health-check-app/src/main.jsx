import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import appRoute from './component/appRoute.jsx'
import { Provider } from 'react-redux';
import AppStore from './utils/AppStore.jsx';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={AppStore}>
      <RouterProvider router={appRoute} />
    </Provider>
  </StrictMode>
);
