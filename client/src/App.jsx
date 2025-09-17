import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Auth } from "./pages/auth"
import { Chat } from "./pages/chat"
import { Profile } from "./pages/profile"


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth/>} />
          <Route path="/" element={<div><h2>Home Page</h2><p>Go to <a href="/auth">/auth</a></p></div>} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="/profile" element={<Profile/>} />

          <Route path="*" element={<Navigate to="/auth" />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App