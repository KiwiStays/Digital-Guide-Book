import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken') || null);
    const [name, setName] = useState(localStorage.getItem('userName') || null);
    const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
    const [propertyData, setPropertyData] = useState(null);
    const [placeId, setPlaceId] = useState(localStorage.getItem('placeId') || null);
    const [loading, setLoading] = useState(true);
    // const id = useParams();
    
    // console.log("authcontext: ", token);
    // console.log("property data from auth ",propertyData)

    // Automatically validate token on app load
    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    // console.log("authcontext: ", token);
                    // console.log("placrId: ", placeId);  

                    const response = await axios.get('http://localhost:3000/api/auth/protected', {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.status === 200) {
                        setLoading(false); // Token is valid
                    } else {
                        throw new Error("Invalid token");
                    }
                } catch (error) {
                    // setToken(null);
                    // localStorage.removeItem('authToken');
                    logout();
                    setLoading(false); // Token invalid
                }
            } else {
                setLoading(false);
            }
        };

        const fetchPropertyData = async () => {
            try {
              if (token) {
                // const propertyId = "678bdcd158ae1f6db6a82326";
                const response = await axios.get(
                  `http://localhost:3000/api/admin/getproperty/${placeId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                setPropertyData(response.data); // Store property data in state
              } else {
                setPropertyData(null);
              }
            } catch (error) {
              console.error("Error fetching property data:", error);
              setPropertyData(null); // Clear property data on error
            }
          };

        validateToken();
        fetchPropertyData();
    }, [token]);

    

    const auth_login = (token, name, id,place_id) => {
        setToken(token);
        setName(name);
        setUserId(id);
        setPlaceId(place_id);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userName', name);
        localStorage.setItem('userId', id);
        localStorage.setItem('placeId', place_id);
    };

    const logout = () => {
        setToken(null);
        setName(null);
        setUserId(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        localStorage.removeItem('placeId');
    };

    return (
        <AuthContext.Provider value={{ token, auth_login, logout, loading, name, userId, propertyData , placeId }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
