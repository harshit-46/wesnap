import React, { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import ForgotPassword from "./pages/ForgotPassword";
import ChatPage from "./pages/Chat";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import FeedSkeleton from "./components/skeletons/FeedSkeleton";

const FeedPage = lazy(() => import("./pages/Feed"));

const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resetpassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected routes */}
        <Route path="/feed" element={
          <ProtectedRoute>
            <Suspense fallback={<FeedSkeleton />}>
              <FeedPage />
            </Suspense>
          </ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute> <Search /> </ProtectedRoute>} />
        <Route path="/createpost" element={<ProtectedRoute> <CreatePost /> </ProtectedRoute>} />
        <Route path="/chat/*" element={<ProtectedRoute> <ChatPage /> </ProtectedRoute>} />
        <Route path="/u/:username" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;