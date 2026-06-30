import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { authenticateContext } from "./context/authenticateContext.jsx";
import "./index.css"
import Navbar from "./components/Navbar"

import CustomerHomePage from "./pages/customer/CustomerHomePage.jsx"
import CustomerProductPage from "./pages/customer/CustomerProductPage.jsx"
import CustomerProductDetail from "./pages/customer/CustomerProductDetail.jsx"
import CustomerCart from "./pages/customer/CustomerCart.jsx"
import CustomerAbout from './pages/customer/CustomerAbout.jsx';
import CustomerLandingPage from "./pages/customer/CustomerLandingPage.jsx";


import AdminProductPage from "./pages/admin/AdminProductPage.jsx"
import AdminHomePage from "./pages/admin/AdminHomePage.jsx"
import UserInformation from "./pages/admin/userInformation.jsx"

import HomePage from "./pages/HomePage.jsx"
import SignUp from "./pages/SignUp.jsx"
import Login from "./pages/Login.jsx"
import Settings from "./pages/Settings.jsx";
import SuccessPage from './pages/SuccessPage.jsx';
import FailedPage from './pages/FailedPage.jsx';

const AppShell = () => {
    const location = useLocation();
    const hideNavbar = location.pathname === "/success" || location.pathname === "/failed";

    const { user, authReady } = useContext(authenticateContext);
    const role = user?.role ?? null;

    if (!authReady) {
        return null;
    }

    return (
        <div className="App">
            {!hideNavbar && <Navbar/>} 
            <Routes>
                <Route path="/success" element={<SuccessPage/>}/>
                <Route path="/failed" element={<FailedPage/>}/>

                <Route path="/product/:id" element={<CustomerProductDetail/>} />
                <Route path="/cart" element={<CustomerCart/>}/>
                <Route path="/about" element={user ? <CustomerAbout/> : <HomePage/>} />

                <Route path="/" element={!user ? <HomePage/> : role === "customer" ? <CustomerLandingPage/> : <AdminProductPage/>} />
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
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AppShell />
        </BrowserRouter>
    )
}

export default App;
