import React, { useContext } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { AuthContext } from '../Context/Authcontext';
import IconFooter from './IconFooter';

const Layout = ({children}) => {
    const {name,token,active} = useContext(AuthContext);
    // console.log(active);
  return (
    
    <div className='bg-primarybg min-h-screen flex flex-col'>
      {token   && active ? (
        <Navbar name={name}/>
      ) : null}
        
        <main className="flex-grow">
        {children}
        </main>
        {token && active ?(<Footer />):null}
        
        {token && active ? (
          <IconFooter/>
        ): null}
        
    </div>
  )
}

export default Layout