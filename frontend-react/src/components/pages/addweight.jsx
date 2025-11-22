import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Checkauth from "../auth/checkauth";
import axios from "axios";
import '../pagecss/addweight.css'


const AddWeight = () => {
  const [weight, setWeight] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    if (!token) {
      setMessage("You must be logged in to add weight.");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/addweight/",
        { weight: parseFloat(weight) },
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      navigate("/home");
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data?.error || "Something went wrong");
      } else {
        setMessage("Network error. Try again later.");
      }
    }
  };

  return (

    
      <div className="addingbody">
        <h2 className="addweighth1">Add Weight</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={weight}
            placeholder="Add Your Weight.."
            onChange={(e) => setWeight(e.target.value)}
            step="0.1"
            min="0"
            required
          />
          <br />
          {message && <p style={{ color: "red" }}>{message}</p>}

          <button className="addbutton" type="submit">
            Add
          </button>
        </form>
      </div>
  );
};

export default Checkauth(AddWeight);
