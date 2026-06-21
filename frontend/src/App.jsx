import { useState, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { authenticateContext } from "./context/authenticateContext.jsx";
import "./index.css"
import Navbar from "./components/Navbar"

import CustomerStorePage from "./pages/customer/CustomerStorePage.jsx"
import CustomerHomePage from "./pages/customer/CustomerHomePage.jsx"
import CustomerProductPage from "./pages/customer/CustomerProductPage.jsx"
import CustomerProductDetail from "./pages/customer/CustomerProductDetail.jsx"
import CustomerCart from "./pages/customer/CustomerCart.jsx"
import CustomerAbout from './pages/customer/CustomerAbout.jsx';

import AdminProductPage from "./pages/admin/AdminProductPage.jsx"
import AdminHomePage from "./pages/admin/AdminHomePage.jsx"
import UserInformation from "./pages/admin/userInformation.jsx"

import HomePage from "./pages/HomePage.jsx"
import SignUp from "./pages/SignUp.jsx"
import Login from "./pages/Login.jsx"
import Settings from "./pages/Settings.jsx";

function App() {

    const { user, authReady } = useContext(authenticateContext);
    const role = user?.role ?? null;


    if (!authReady) {
        return null;
    }
    
    return (
        <div className="App">
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path="/product/:id" element={<CustomerProductDetail/>} />
                    <Route path="/cart" element={<CustomerCart/>}/>

                    <Route path="/" element={!user ? <HomePage/> : role === "customer" ? <CustomerAbout/> : <AdminProductPage/>} />
                    <Route path="/product" element={user ? <CustomerProductPage/> : <HomePage/>} />
                    <Route path="/CustomerHomePage" element={!user ? <CustomerHomePage/> : <Navigate to="/"/>} />
                    <Route path="/AdminHomePage" element={!user ? <AdminHomePage/> : <Navigate to="/" />} />

                    <Route path="/Signup" element={!user ? <SignUp/> : <Navigate to="/" />} />
                    <Route path="/Login" element={!user ? <Login/> : <Navigate to="/" />} />
                    <Route path="/Settings" element={!user? <HomePage/> : <Settings/>}/> 
                    <Route path="/AdminProductPage" element={user && role === "admin" ? <AdminProductPage/> : <Navigate to="/" />} />
                    <Route path="/CustomerProductPage" element={user && role === "customer" ? <CustomerProductPage/> : <Navigate to="/" />} />

                    <Route path="/AdminUsers" element={user && role === "admin" ? <UserInformation/> : <Navigate to="/" />} />

                </Routes>
            </BrowserRouter>
        </div>
    )


}

export default App;
