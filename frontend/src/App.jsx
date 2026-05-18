import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Admin from "./pages/Admin"
import "./index.css"
import Navbar from "./components/Navbar"
function App() {

    return (
        <div className="App">
            <BrowserRouter>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Admin/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )


}

export default App;
