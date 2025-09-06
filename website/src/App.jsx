 import React, { useState, useEffect, createContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import AuthPage from "./AuthPage";
import SellerPanel from "./Userpanel"; // or "./Userpanel" — pick one, not both
import ProfilePage from "./ProfilePage";

import Headerpage from "./Header";
import Homepage from "./components/Homepage";
import FeaturesSection from "./components/FeaturesSection";
import AboutUs from "./components/AboutUs";

import LoginPage from "./admin-panel/LoginPage";
import CategoriesPage from "./admin-panel/CategoriesPage";
import ProductsPage from "./admin-panel/ProductsPage";
import DashboardPage from "./admin-panel/DashboardPage";
import SubProductPage from "./admin-panel/sub_product";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProfile from "./pages/seller/SellerProfile";
import SellerMessages from "./pages/seller/SellerMessages";
import BuyerDashboard from "./pages/buyer/BuyerDasboard";
import BuyerProfile from "./pages/buyer/BuyerProfile";

import Footer from "./components/Footer";
import ScrollToTop from "./ScrollToTop";
import Home from "./components/Home";
import UserEventsBox from "./components/UserEventsBox";
import SellerApplicationForm from "./pages/seller/AminPost";
import UserAd from "./pages/seller/UserAd";
import UserAdStatus from "./admin-panel/UserAdStatus";
import BuyerAd from "./pages/buyer/BuyerAd";
import BuyerLogin from "./pages/buyer/BuyerLogin";
import AdminSellerApplications from "./admin-panel/AdminSellerApplications";
import SellerInformation from "./pages/seller/SellerInformation";
import AdminSellerManagement from "./admin-panel/AdminSellerManagement";
import AdminAd from "./admin-panel/AdminAd";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import SellerServiceForm from "./pages/seller/SellerServiceForm";
import AdminServices from "./admin-panel/AdminServices";
import ViewAd from "./viewAd";
import AdminEventsManagement from "./admin-panel/AdminEventsManagement";

import UserQueries from "./admin-panel/UserQueries";
import ViewAllEvents from "./components/ViewAllEvents";
import BuyerMessages from "./pages/buyer/BuyerMessages";
import AdminApps from "./admin-panel/AdminApps";
import SellerCV from "./components/SellerCV";
import WorkUploadForm from "./pages/seller/WorkUploadForm";


// Create AuthContext to share user state globally
export const AuthContext = createContext(null);

function AppContent() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUser({ id: userId, name: "User" });
    }
  }, []);

  // Example: show header on homepage and when user logged in
  const headerVisibleRoutes = ["/", "/service", "/about", "/forgotpassword"];
  const showHeader = headerVisibleRoutes.includes(location.pathname) || user !== null;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="min-h-screen w-full font-poppins overflow-x-hidden bg-white">
        <ScrollToTop />
             {location.pathname === "/" && <Headerpage />}

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Homepage />
                <FeaturesSection />
                <AboutUs />
                
               
              </>
            }
          />
          <Route
            path="/login"
            element={<AuthPage isSignUp={isSignUp} setIsSignUp={setIsSignUp} />}
          />
        <Route path="/admin/seller-applications" element={<AdminSellerApplications/>} />
      <Route path="/sellerservice" element={<SellerServiceForm/>} />
      <Route path="/viewallAd" element={<ViewAd/>} />
      <Route path="/viewallEvent" element={<ViewAllEvents/>} />
      <Route path="/userQuery" element={<UserQueries/>} />
       <Route path="/seller-cv" element={<SellerCV/>} />
        <Route path="/uploadwork" element={<WorkUploadForm/>} />
        <Route path="/adminEvent" element={<AdminEventsManagement/>} />
        <Route path="/admin/sellerservice" element={<AdminServices/>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/AdminsPostPage" element={<SellerApplicationForm/>} />
          <Route path="/seller" element={<SellerPanel />} />
          <Route path="/adminAd" element={<AdminAd/>} />
          <Route path="/adminsellerlist" element={<AdminSellerManagement/>} />
           <Route path="/UserAd" element={<UserAd/>} />
           <Route path="/BuyerLogin" element={<BuyerLogin/>} />
           <Route path="/BuyerAd" element={<BuyerAd/>} />
              <Route path="/sellerdetails" element={<SellerInformation/>} />
            <Route path="/userAdStatus" element={<UserAdStatus/>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/service" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/adminlogin" element={<LoginPage />} />
          <Route path="/admindashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
        <Route path="/AdminApp" element={<AdminApps/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword/>} />
          <Route path="/Categories" element={<CategoriesPage />} />
          <Route path="/Sub-Product" element={<SubProductPage />} />
          <Route path="/Sellerprofile" element={<SellerProfile />} />
          <Route path="/Sellermsg" element={<SellerMessages />} />
             <Route path="/Buyermsg" element={<BuyerMessages/>} />
          <Route path="/buyerprofile" element={<BuyerProfile />} />
          <Route path="/sellerdashboard" element={<SellerDashboard />} />
          <Route path="/buyerdashboard" element={<BuyerDashboard />} />
          <Route path="/userEvent" element={<UserEventsBox />} />
        </Routes>

    {location.pathname === "/" && <Home/>}
      </div>
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    
      <AppContent />
   
  );
}
