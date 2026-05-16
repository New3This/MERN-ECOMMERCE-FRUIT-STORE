import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Admin from "./pages/Admin"

function App() {

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Admin/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )


}

export default App
