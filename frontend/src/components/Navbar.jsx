import { use, useContext } from 'react';
import { useState } from 'react';
import { AuthContext } from '../Context/Authcontext';
import { Link } from 'react-router-dom';

function Navbar({name}) {
  const {logout , propertyData} = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const openWhatsApp = () => {
    const phoneNumber = '1234567890'; // Replace with the desired phone number
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, '_blank');
  };

  return (
    <nav className=" relative top-0 left-0 w-full z-10 bg-primarybg lg:px-8 overflow-hidden">
      <div className="flex px-5 py-5 justify-between md:justify-between lg:justify-between md:px-20 items-center md:py-8 bg-primarybg">
        {/* welcome */}
          <div className="flex justify-start items-center gap-4">
            <img src="https://staysync.in/assets/images/only-symbols-96x96.png" className="w-10 h-15 md:w-20 md:h-20" alt="host image"/>
            <h1 className="text-2xl font-bold md:text2xl lg:text-3xl md:font-semibold text-primarytext leading-2">Welcome {name.split(" ")[0]}!</h1>
          </div>
          
          {/* hamburger menu */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-primarytext">
            <svg className={`w-8 h-8 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* desktop links */}
        <div className='hidden lg:flex md:hidden'>
          <ul className="flex justify-around px-8 w-full py-4 items-center text-2xl font-semibold gap-10 text-primarytext">
          <li>
            <Link to="/">Arrival</Link>
            </li>
          <li>
            <Link to="/stayinfo">
            Your Home
            </Link>
          </li>
          <li>
            <Link to="/contacts">
            Contacts
            </Link>
          </li>
          </ul>
        </div>

        {/* desktop whatsapp */}
        <div onClick={openWhatsApp} className='cursor-pointer border-2 border-green-900 hidden lg:flex items-center justify-center rounded-full px-10 md:px-4 py-4 text-2xl text-white bg-green-900 text-wrap font-normal'>
          <a>Whatsapp Host</a>
        </div>
      </div>

      {/* mobile menu */}
      <div className={`lg:hidden  transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-primarybg`}>
        <ul className="flex flex-col items-center text-xl font-semibold gap-4 text-primarytext py-4">
          <li>
            <Link to="/">Arrival</Link>
            </li>
          <li>
            <Link to="/stayinfo">
            Your Home
            </Link>
          </li>
          <li>
            <Link to="/contacts">
            Contacts
            </Link>
          </li>
          <li onClick={openWhatsApp} className="cursor-pointer border-2 border-green-900 rounded-full px-6 py-2 text-white bg-green-900">
            Whatsapp Host
          </li>
          <li onClick={logout} className="border-2 border-red-900 rounded-full px-6 py-2 text-white bg-red-900">Logout</li>
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;