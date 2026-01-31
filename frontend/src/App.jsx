import React, { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";          // ← import here
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

const authRoutes = ["/", "/signup", "/resetpassword"];
  const isAuth =
    authRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password");

const App = () => {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Persistent sidebar – fixed, overlays content */}
      <Navbar />

      {/* Main content – pushed right on desktop to avoid overlap with collapsed sidebar */}
      <main className={isAuth ? "min-h-screen" : "md:pl-20 min-h-screen"}>
        <Routes>
          {/* Public routes – no navbar, full width */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/resetpassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Protected routes – content starts after the 80px sidebar padding */}
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Suspense fallback={<FeedSkeleton />}>
                  <FeedPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/createpost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/chat/t/:conversationId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/u/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;