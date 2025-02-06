import { useContext, useState } from "react"
import { AuthContext } from "../Context/Authcontext"
import { Link } from "react-router-dom"
import { PhoneCall } from "lucide-react"

function Navbar({ name }) {
  const { logout } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="relative top-0 left-0 w-full z-10 bg-primarybg lg:px-8">
      <div className="flex px-5 py-5 justify-between items-center md:px-20 md:py-8 bg-primarybg">
        {/* Host Image + Call Icon */}
        <div className="relative flex items-center gap-4">
          {/* Circular Host Image */}
          <div className="relative w-14 h-14 md:w-20 md:h-20">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-primarytext">
              <img
                src="https://a0.muscache.com/im/pictures/user/User-90888669/original/f4f89989-4674-48fe-b5ed-ba083c979733.jpeg?im_w=240&im_format=avif"
                alt="host image"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Call Icon - Click to Call */}
            <a
              href="tel:+917249066854" // Replace with actual phone number
              className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-primarybg rounded-full flex items-center justify-center border-2 border-primarytext"
            >
              <PhoneCall className="w-5 h-5 md:w-6 md:h-6 text-primarytext" />
            </a>
          </div>


          {/* Welcome Text */}
          <h1 className="text-2xl font-bold md:text-2xl lg:text-3xl text-primarytext">Hi {name.split(" ")[0]}!</h1>
        </div>

        {/* Hamburger Menu */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-primarytext">
            <svg
              className={`w-8 h-8 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex">
          <ul className="flex justify-around px-8 py-4 text-2xl font-semibold gap-10 text-primarytext">
            <li>
              <Link to="/">Arrival</Link>
            </li>
            <li>
              <Link to="/stayinfo">Stay info</Link>
            </li>
            <li>
              <Link to="/nearby">Near by</Link>
            </li>
          </ul>
        </div>

        {/* Desktop WhatsApp Button */}
        <div
          onClick={() => window.open("https://wa.me/7249066854", "_blank")}
          className="cursor-pointer border-2 border-green-900 hidden lg:flex items-center justify-center rounded-full px-10 md:px-4 py-4 text-2xl text-white bg-green-900"
        >
          Whatsapp Host
        </div>
      </div>

      {/* Mobile Menu with Frosted Effect */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden bg-primarybg/80 backdrop-blur-sm`}
      >
        <ul className="flex flex-col items-center text-xl font-semibold gap-4 text-primarytext py-4">
          <li>
            <Link to="/">Arrival</Link>
          </li>
          <li>
            <Link to="/stayinfo">Stayinfo</Link>
          </li>
          <li>
            <Link to="/nearby">Near by</Link>
          </li>
          <li
            onClick={() => window.open("https://wa.me/7249066854", "_blank")}
            className="cursor-pointer  rounded-full px-6 py-2 text-white bg-green-900"
          >
            Whatsapp Host
          </li>
          <li onClick={logout} className=" rounded-full px-6 py-2 text-white bg-primarytext">
            Logout
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar

