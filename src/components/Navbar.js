import React from 'react'
import { Link, useLocation } from "react-router-dom";
import {useNavigate} from 'react-router-dom'

const Navbar = () => {

  return (
    <div>
      <header className="d-flex justify-content-center py-3">
      <ul className="nav nav-pills">
        <li className="nav-item"><Link to="/" className="nav-link active" aria-current="page">Home</Link></li>
        <li className="nav-item"><Link to="/about" className="nav-link">About</Link></li>
        <li className="nav-item"><Link to="/medical" className="nav-link">Medical Data</Link></li>
        <li className="nav-item"><Link to="/vaccinate" className="nav-link">Vaccination</Link></li>
        <li className="nav-item"><Link to="/contact" className="nav-link">Contact</Link></li>
      </ul>
    </header>
    </div>
  )
}

export default Navbar
