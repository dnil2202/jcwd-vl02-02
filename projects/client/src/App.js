import './App.css'
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../src/components/NavbarComponent';
import Footer from '../src/components/FooterComponent';
import LandingPages from '../src/pages/LandingPages.jsx';
import Register from './pages/Register';
import 'react-phone-number-input/style.css'
import Verified from './pages/user/Verified';
import Login from './pages/Login';
import axios from 'axios';
import { API_URL } from './helper';
import { useDispatch, useSelector } from 'react-redux'
import { loginAction } from './action/useraction';
import EditProfile from './pages/EditProfile.jsx'
import DashboardPage from './pages/admin/DashboardPage.jsx';
import TransactionPage from './pages/admin/TransactionPage';
import ReportPage from './pages/admin/ReportPage';
import HistoryPage from './pages/admin/HistoryPage';
import ProductPage from "./pages/user/ProductPage";
import UserCart from './pages/user/CartPage';
import Checkout from './pages/user/CheckoutPage';
import ProductDetail from './pages/user/ProductDetail'
import Prescription from './pages/user/PrescriptionPage';
import UploadSuccess from './pages/user/UploadSuccessPage';
import ResetPass from './pages/user/ResetPass';
import ProtectRoute from './components/ProtectRoute/ProtectRoute';
import ProtectRouteAdmin from './components/ProtectRoute/ProtectRouteAdmin';
import ProtectRouteLogin from './components/ProtectRoute/ProtectRouteLogin';
import ProductAdminPage from './pages/admin/ProductAdminPage';
import EditProductPage from './pages/admin/EditProductPage';
import AddProductPage from './pages/admin/AddProductPage';
import EmailVerification from './pages/user/EmailVerification';
import UserOrderList from './pages/user/OrderList';
import ChangePassword from './components/ChangePassword';
import AddressComponent from './components/AdressComponent';
import {Helmet} from "react-helmet";

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  const keepLogin = () => {
    let medcarelog = localStorage.getItem('medcarelog')
    if (medcarelog) {
      axios.get(API_URL + '/api/user/keep-login', {
        headers: {
          'Authorization': `Bearer ${medcarelog}`
        }
      }).then((res) => {
        console.log(res)
        if (res.data.iduser) {
          localStorage.getItem('medcarelog', res.data.token)
          delete res.data.token
          setLoading(false)
          dispatch(loginAction(res.data))

        }
      })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    keepLogin()
  }, [])

  return (
    <div>
      <Helmet>
        <title>Medcare</title>
        <meta name="description" content="Meet your health needs" />
      </Helmet>
      <div>
        <Navbar loading={loading} />
      </div>
      <Routes>
        <Route path='/' element={<LandingPages />} />
          {/* Protect Route Ketika User Blm Login */}
          <Route element={<ProtectRoute />}>
            <Route path='/profile' element={<EditProfile />} />
            <Route path='/prescription' element={<Prescription />} />
            <Route path='/success' element={<UploadSuccess />} />
            <Route path='/cart' element={<UserCart />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/change-pass' element={<ChangePassword/>} />
            <Route path='/address' element={<AddressComponent/>} />
            <Route path='/:user/transaction' element={<UserOrderList />} />
          </Route>
          
          {/* Protect Route Page Admin */}
          <Route element={<ProtectRouteAdmin />}>
              <Route path='/admin/dashboard' element={<DashboardPage />} />
              <Route path='/admin/product' element={<ProductAdminPage />} />
              <Route path='/admin/product/add' element={<AddProductPage/>} />
              <Route path='/admin/product/edit' element={<EditProductPage/>} />
              <Route path='/admin/transaction' element={<TransactionPage />} />
              <Route path='/admin/report' element={<ReportPage />} />
              <Route path='/admin/stock_log' element={<HistoryPage />} />
          </Route>

        {/* Protect Route Ketika User Sudah Login */}
        <Route element={<ProtectRouteLogin />}>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/resetpass/:token' element={<ResetPass />} />
        </Route>

        <Route path='/verification/:token' element={<Verified />} />
        <Route path='/email-verification/:token' element={<EmailVerification />} />
        <Route path='/product' element={<ProductPage />} />
        <Route path='/product/detail' element={<ProductDetail />} />
      </Routes>
      <Footer />
    </div >
  );
}

export default App;
