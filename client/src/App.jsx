import { use, useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Auth } from "./pages/auth"
import { Chat } from "./pages/chat"
import { Profile } from "./pages/profile"
import { useAppStore } from "@/store/index.js";
import { GET_USER_INFO } from './utils/constants';
import { apiClient } from './lib/api-client';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo; // check if userInfo exists and has an id property
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

const App = () => {

  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const getUserData = async () => {
      // making API call to get the user data
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        console.log({ response });

        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        }
        else {
          setUserInfo(undefined);
        }
      }
      catch (error) {
        console.log("Error fetching user data", error);
      }
      finally {
        setLoading(false);
      }
    }
    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }

  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
          <Route path="/" element={<div><h2>Home Page</h2><p>Go to <a href="/auth">/auth</a></p></div>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App