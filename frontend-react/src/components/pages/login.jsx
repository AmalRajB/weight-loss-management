import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authslice";
import '../pagecss/login.css'


const Login = () => {

  const [info, setInfo] = useState({
    username: "",
    password: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (e) => {
    e.preventDefault();

    axios.post("http://127.0.0.1:8000/api/login/", info)
      .then(response => {
        setErrorMessage('');
        var user = {
          username: info.username,
          token: response.data.token
        };
        dispatch(setUser(user));
        navigate('/home');
      })
      .catch(error => {

        if (error.response && error.response.data) {

          const data = error.response.data;

          // Handle all validation / error messages from Django
          if (typeof data === "object") {
            let errors = [];

            for (let key in data) {
              if (Array.isArray(data[key])) {
                errors.push(...data[key]); // ["error1"]
              } else {
                errors.push(data[key]); // "Invalid credentials"
              }
            }

            setErrorMessage(errors.join(" "));
            return;
          }

          setErrorMessage("Unexpected server error");
        } else {
          setErrorMessage("Failed to connect to API.");
        }

      });
  };

  return (
    <>
      <div className='container' >

        <h1 className='loginh1'>login to the site</h1>

        <form onSubmit={handleClick}>
          <input className='logininput'
            type='text'
            placeholder='Username'
            onChange={(e) => setInfo({ ...info, username: e.target.value })}
            required
          /> <br />
          <input
            type='password'
            className='logininput'
            placeholder='Password'
            onChange={(e) => setInfo({ ...info, password: e.target.value })}
            required
          /> <br />

          <button className='loginbtn' type='submit'>Login</button>
        </form>
                  <div className='loginerror'>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </div>



      </div>
    </>
  );
};

export default Login
