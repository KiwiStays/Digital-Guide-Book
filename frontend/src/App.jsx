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


function App() {
  const { token, loading } = useContext(AuthContext);
  const { adminToken } = useContext(AdminContext);
  // console.log(token);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Main (User) Routes */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route
                  path="/dashboard"
                  element={token ? <Dashboard /> : <Navigate to="/" />}
                />
                <Route
                  path="/"
                  element={token ? <Navigate to="/dashboard" /> : <GuestForm />}
                />
                <Route
                  path="/:id"
                  element={token ? <Navigate to="/dashboard" /> : <GuestForm />}
                />
                <Route
                  path="/login"
                  element={token ? <Navigate to="/dashboard" /> : <Login />}
                />
                <Route
                  path="/stayinfo"
                  element={token ? <Stayinfo /> : <Navigate to="/" />}
                />
                <Route
                  path="/contacts"
                  element={token ?<Contacts/>: <GuestForm />}
                />
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
                <Route path="editguestinfo" element={adminToken ?<Editguestinfo/>:<AdminLogin />} />
                <Route path="editproperty" element={adminToken?<EditProperty/>:<AdminLogin />} />
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
