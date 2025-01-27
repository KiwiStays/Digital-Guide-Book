
import React from 'react'
import { Link } from 'react-router-dom'

const Pagenotfound = () => {
  return (
    <div> <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 className="text-4xl font-bold text-red-500">404</h1>
    <p className="text-xl mt-2 text-gray-700">
      Oops! The page you are looking for does not exist.
    </p>
    <Link
      to="/"
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Go Back Home
    </Link>
  </div></div>
  )
}

export default Pagenotfound