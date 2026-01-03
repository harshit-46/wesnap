import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";

const App = () => {
  return (
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route path="/feed" element={ <ProtectedRoute> <Feed /> </ProtectedRoute> }/>
        <Route path="/search" element={ <ProtectedRoute> <Search /> </ProtectedRoute> }/>
        <Route path="/createpost" element={ <ProtectedRoute> <CreatePost /> </ProtectedRoute> }/>
        <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute> }/>
      </Routes>
  );
};

export default App;