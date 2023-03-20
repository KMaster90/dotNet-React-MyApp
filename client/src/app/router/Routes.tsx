import { createBrowserRouter, Navigate } from 'react-router-dom';
import AboutPage from '../../features/about/AboutPage';
import BasketPage from '../../features/basket/BasketPage';
import Catalog from '../../features/catalog/Catalog';
import ProductDetailPage from '../../features/catalog/ProductDetails';
import CheckoutPage from '../../features/checkout/CheckoutPage';
import ContactPage from '../../features/contact/ContactPage';
import HomePage from '../../features/home/HomePage';
import NotFound from '../errors/NotFound';
import ServerError from '../errors/ServerError';
import App from '../layout/App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'catalog/:id', element: <ProductDetailPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '/server-error', element: <ServerError /> },
      { path: '/basket', element: <BasketPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/not-found', element: <NotFound /> },
      { path: '*', element: <Navigate to="/not-found" /> }
    ]
  }
]);
