import { useState, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { authenticateContext } from "./context/authenticateContext.jsx";
import "./index.css"
import Navbar from "./components/Navbar"

import CustomerStorePage from "./pages/customer/CustomerStorePage.jsx"
import CustomerHomePage from "./pages/customer/CustomerHomePage.jsx"
import CustomerProductPage from "./pages/customer/CustomerProductPage.jsx"
import CustomerProductDetail from "./pages/customer/CustomerProductDetail.jsx"

import AdminProductPage from "./pages/admin/AdminProductPage.jsx"
import AdminHomePage from "./pages/admin/AdminHomePage.jsx"
import UserInformation from "./pages/admin/userInformation.jsx"

import HomePage from "./pages/HomePage.jsx"
import SignUp from "./pages/SignUp.jsx"
import Login from "./pages/Login.jsx"


function App() {

    const { user } = useContext(authenticateContext);
    const role = user?.role ?? null;

    return (
        <div className="App">
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path="/product/:id" element={<CustomerProductDetail/>} />
                    <Route path="/" element={!user ? <HomePage/> : role === "customer" ? <CustomerProductPage/> : <AdminProductPage/>} />

                    <Route path="/CustomerHomePage" element={!user ? <CustomerHomePage/> : <Navigate to="/"/>} />
                    <Route path="/AdminHomePage" element={!user ? <AdminHomePage/> : <Navigate to="/" />} />

                    <Route path="/Signup" element={!user ? <SignUp/> : <Navigate to="/" />} />
                    <Route path="/Login" element={!user ? <Login/> : <Navigate to="/" />} />

                    <Route path="/AdminProductPage" element={user && role === "admin" ? <AdminProductPage/> : <Navigate to="/" />} />
                    <Route path="/CustomerProductPage" element={user && role === "customer" ? <CustomerProductPage/> : <Navigate to="/" />} />

                    <Route path="/AdminUsers" element={user && role === "admin" ? <UserInformation/> : <Navigate to="/" />} />

                </Routes>
            </BrowserRouter>
        </div>
    )


}

export default App;
