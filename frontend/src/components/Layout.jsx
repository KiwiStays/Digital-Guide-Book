import React, { useContext } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { AuthContext } from '../Context/Authcontext';
import IconFooter from './IconFooter';

const Layout = ({children}) => {
    const {name,token} = useContext(AuthContext);
  return (
    
    <div className='bg-primarybg min-h-screen flex flex-col'>
      {token  ? (
        <Navbar name={name}/>
      ) : null}
        
        <main className="flex-grow">
        {children}
        </main>
        {token ?(<Footer />):null}
        
        {token ? (
          <IconFooter/>
        ): null}
        
    </div>
  )
}

export default Layout