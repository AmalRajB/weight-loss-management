import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pagecss/signup.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'




const Signup = () => {

    const [user, setUser] = useState({
        username: "",
        password1: "",
        password2: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [loading, setloading] = useState(false)

    const registration = (e) => {
        e.preventDefault();
        setloading(true)

        axios.post("http://127.0.0.1:8000/api/signup/", user)
            .then(response => {
                setErrorMessage('');
                navigate('/login');
            })
            .catch(error => {

                if (error.response && error.response.data) {
                    const data = error.response.data;

                    // Collect ALL validation errors from DRF
                    if (typeof data === "object") {
                        let errors = [];

                        for (let key in data) {
                            if (Array.isArray(data[key])) {
                                errors.push(...data[key]);  // ["error1", "error2"]
                            } else {
                                errors.push(data[key]);      // non-array error
                            }
                        }

                        setErrorMessage(errors.join(" "));
                        return;
                    }

                    setErrorMessage("Unexpected server error.");
                } else {
                    setErrorMessage("Failed to connect to API.");
                }

            }).finally(() => {
                setloading(false)
            })
    };

    return (
        <>
            <div className='container'>
                <h1 className='signuph1'>signup</h1>

                <form onSubmit={registration}>
                    <input className='signupinput'
                        type='text'
                        placeholder='Username'
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        required
                    /> <br />

                    <input className='signupinput'
                        type='password'
                        placeholder='Password'
                        onChange={(e) => setUser({ ...user, password1: e.target.value })}
                        required
                    /> <br />

                    <input className='signupinput'
                        type='password'
                        placeholder='Confirm Password'
                        onChange={(e) => setUser({ ...user, password2: e.target.value })}
                        required
                    /> <br />

                    {loading ? (<button className='signupbtn' type='submit'> <FontAwesomeIcon icon={faSpinner} spin /> loading</button>
                    ) : <button className='signupbtn' type='submit'>Signup</button>
                    }

                </form>
                <div className='signuperror'>
                    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                </div>



            </div>
        </>
    );
};

export default Signup;

