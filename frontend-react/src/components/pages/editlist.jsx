import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Checkauth from "../auth/checkauth";
import axios from "axios";
import '../pagecss/addweight.css'


const EditWeight = () => {
  const [weight, setWeight] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // Load the existing weight entry
  useEffect(() => {
    if (!token) {
      setMessage("You must be logged in.");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/singleweight/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => setWeight(response.data.weight))
      .catch(() => setMessage("Failed to load weight data"));
  }, [id, token]);

  // Update weight entry
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("You must be logged in.");
      return;
    }

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/listupdate/${id}/`,
        { weight: parseFloat(weight) },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
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
        <h2 className="addweighth1">Edit Weight</h2>
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
            Edit
          </button>
        </form>
      </div>
  );
}

export default Checkauth(EditWeight);
