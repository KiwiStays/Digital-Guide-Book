import GuestForm from './Pages/Guestform';
import './App.css';
import { useContext } from 'react';
import { AuthContext } from './Context/Authcontext';
import Dashboard from './Pages/Dashboard';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Pages/Login'
import PropertyForm from './Pages/PropertyForm';
import Layout from './components/Layout';
import Pagenotfound from './Pages/Pagenotfound';
import Stayinfo from './Pages/Stayinfo';
import Contacts from './Pages/Contacts';
import GuestTable from './Pages/GuestTable';
import AdminRegister from './Pages/AdminRegister';
import AdminLogin from './Pages/AdminLogin';
import Admindashboard from './Pages/Admindashboard';
import { AdminContext } from './Context/AdminContext';
import AdminLayout from './components/Admin/AdminLayout';
import Editguestinfo from './Pages/Editguestinfo';
import EditProperty from './Pages/EditProperty';
import axios from 'axios';
import Nearby from './Pages/Nearby';
import Thanks from './Pages/Thanks';
import Active from './Pages/Active';
import PropertyListing from './Pages/PropertyListing';
import RentalwiseGuest from './Pages/Rentalwiseguest';
import Guestlandingpage from './Pages/Guestlandingpage';
import Addon from './Pages/Addon';


function App() {
  const { token, loading, active } = useContext(AuthContext);
  // console.log("page is active: ",active);
  const { adminToken } = useContext(AdminContext);
  // console.log(token);

  if (loading) {
    return <div>Loading...</div>;
  }

  const ProtectedRoute = ({ children }) => {
    const { token, active } =  useContext(AuthContext);
    return token && active ? children : <Navigate to="/" />;
  };
  
  

  return (
    <Router>
      <Routes>


        {/* Main (User) Routes */}
        <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/thanks" element={token && !active ? <Thanks /> : <Navigate to="/" />} />
              <Route path="/active" element={token && !active ? <Active /> : <Navigate to="/" />} />
              <Route path="/" element={token && active ? <Navigate to="/dashboard" /> : <Login />} />
              <Route path="/:id" element={token && active ? <Navigate to="/dashboard" /> : <GuestForm />} />
              {/* this is the main landing page component  */}
              <Route path="/:guestId/:propertyId" element={ <Guestlandingpage />} />
              <Route path="/login" element={token && active ? <Navigate to="/dashboard" /> : <Login />} />
              <Route path="/stayinfo" element={<ProtectedRoute><Stayinfo /></ProtectedRoute>} />
              <Route path="/contacts" element={token && active ? <Contacts /> : <GuestForm />} />
              <Route path="/nearby" element={token && active ? <Nearby /> : <GuestForm />} />
              <Route path="/addon" element={<Addon/>} />
              <Route path="*" element={<Pagenotfound />} />
            </Routes>
          </Layout>
        }
      />
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route
                  path="property"
                  element={adminToken ? <PropertyForm /> : <AdminLogin />}
                />
                <Route
                  path="guestinfo"
                  element={adminToken ? <GuestTable /> : <AdminLogin />}
                />
                <Route path="register" element={<AdminRegister />} />
                <Route path="login" element={<AdminLogin />} />
                <Route
                  path="dashboard"
                  element={adminToken ? <Admindashboard /> : <AdminLogin />}
                />
                <Route path="editguestinfo" element={adminToken ? <Editguestinfo /> : <AdminLogin />} />
                <Route path="propertylist" element={adminToken ? <PropertyListing /> : <AdminLogin />} />
                <Route path="editproperty" element={adminToken ? <EditProperty /> : <AdminLogin />} />
                <Route path="rentalwiseguest" element={adminToken ? <RentalwiseGuest /> : <AdminLogin />} />
                <Route path="*" element={<Pagenotfound />} />
              </Routes>
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
