import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from '../../store/authslice';

const Navbar = () => {

  // Get logged-in user from Redux
  const user = useSelector(state => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    if (user) {

      axios.post(
        "http://127.0.0.1:8000/api/logout/",
        {},
        {
          headers: {
            Authorization: "Token " + user.token   // <-- FIXED
          }
        }
      )
      .then(() => {
        dispatch(removeUser());  // remove user from redux
        navigate('/login');
      })
      .catch((err) => {
        console.log("Logout error:", err);
        dispatch(removeUser());
        navigate('/login');
      });
    }
  };

  return (
    <nav className="nav-container">
      <h2 className="logo">Weight Loss Management</h2>

      <div className="nav-links">
        <ul>

          {user && (
            <>
              <li><Link to="/home" className="nav-link">Home</Link></li>
              <li><Link to="/add" className="nav-link">Add weight</Link></li>
              <li><Link to={'/weightlose'} className="nav-link">Weight Analyse</Link></li>
              <li><span onClick={logout} className="nav-link">Logout</span></li>

            </>
          )}

          {!user && (
            <>
              <li><Link to="/" className="nav-link">Signup</Link></li>
              <li><Link to="/login" className="nav-link">Login</Link></li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
