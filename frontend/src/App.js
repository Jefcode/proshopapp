import { Container } from 'react-bootstrap';
import { Navigate, Route, Routes } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import ProtectedRoutes from './components/ProtectedRoutes';
import AdminRoutes from './components/AdminRoutes';

import CartScreen from './screens/CartScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import PaymentScreen from './screens/PaymentScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';

const App = () => {
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} />
            <Route path='/page/:pageNumber' element={<HomeScreen />} />
            <Route path='/search/:keyword' element={<HomeScreen />} />
            <Route
              path='/search/:keyword/page/:pageNumber'
              element={<HomeScreen />}
            />
            <Route path='/product/:productId' element={<ProductScreen />} />
            <Route path='/cart' element={<CartScreen />}>
              <Route path=':productId' element={<CartScreen />} />
            </Route>
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route
              path='/profile'
              element={
                <ProtectedRoutes>
                  <ProfileScreen />
                </ProtectedRoutes>
              }
            />
            <Route path='/shipping' element={<ShippingScreen />} />
            <Route path='/payment' element={<PaymentScreen />} />
            <Route
              path='/placeorder'
              element={
                <ProtectedRoutes>
                  <PlaceOrderScreen />
                </ProtectedRoutes>
              }
            />

            <Route
              path='/order/:orderId'
              element={
                <ProtectedRoutes>
                  <OrderScreen />
                </ProtectedRoutes>
              }
            />

            {/* Admin routes */}
            <Route path='/admin' element={<AdminRoutes />}>
              <Route path='' element={<Navigate to='/' />} />
              <Route path='userlist' element={<UserListScreen />} />
              <Route path='user/:userId/edit' element={<UserEditScreen />} />
              <Route path='productlist' element={<ProductListScreen />} />
              <Route
                path='productlist/page/:pageNumber'
                element={<ProductListScreen />}
              />
              <Route
                path='product/:productId/edit'
                element={<ProductEditScreen />}
              />
              <Route path='orderlist' element={<OrderListScreen />} />
            </Route>
          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;
