import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/Authcontext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Hero2 from '../components/Hero2';
import Rules from '../components/Rules';
import Footer from '../components/Footer';

const Dashboard = () => {
    const { logout, name , propertyData ,placeId } = useContext(AuthContext);
    const [data  , setData] = useState(null);
    const id = placeId;
    useEffect(() => {
        
        if (!id) {
            console.error("No ID found in the URL!");
            return;
        }

        const fetchPropertyData = async () => {
            try {
                // console.log(`Fetching property data for ID: ${id}...`);
                const response = await axios.get(`http://localhost:3000/api/admin/getproperty/${id}`);
                
                // Log the fetched data
                // console.log("Property data fetched successfully:", response.data.data);
                setData(response.data.data);
                
            } catch (error) {
                // Log detailed error information
                if (error.response) {
                    // Server responded with a status outside 2xx range
                    console.error("Server error:", error.response.status, error.response.data);
                } else if (error.request) {
                    // No response received from the server
                    console.error("No response received from the server. Request details:", error.request);
                } else {
                    // Other errors, e.g., request setup
                    console.error("Error occurred while setting up the request:", error.message);
                }
            }
        };

        fetchPropertyData();
    }, []);

    // console.log("data",data.location);
    // console.log("prop data",propertyData);
    // console.log("data faqs :",data.faqs);
    // console.log(data.images[0].url);
    // console.log("perkinfo:",data.perkInfo)

    return (
        <div className="bg-primarybg h-full">
            
            {data && data.images && data.images.length > 1 ? (
                <Hero title={data.title} heroimg={data.images[1].url} />
            ) : (
                <p>Loading...</p> 
            )}
            {data && data.wifi && data.selfcheckin && data.address && data.faqs ? (
                <Hero2 wifi={data.wifi} selfcheckin={data.selfcheckin} address={data.address} faqs={data.faqs} locationLink = {data.location}  />
            ) : (
                <p>Loading...</p> 
            )}
            {
                data && data.houseRules && data.houseRules.length > 1 ? (
                    <Rules houseRules={data.houseRules}/>
                ):(
                    <p>Loading...</p>
                )
            }
           
            


           
            {/* <button onClick={logout}>Logout</button> */}
        </div>
    );
};

export default Dashboard;
