import React, { useState } from "react";
import Checkauth from "../auth/checkauth";
import axios from "axios";
import '../pagecss/calculationpage.css'

const WeightLoss = () => {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date1 || !date2) {
      setError("Please select both dates.");
      return;
    }

    try {
      setError("");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/weightlose/",
        {
          date1: date1, // format = YYYY-MM-DD
          date2: date2, // format = YYYY-MM-DD
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Failed to fetch difference.");
      } else {
        setError("Network error. Try again later.");
      }
    }
  };

  return (
    <div className="calculatemain">
      <h2>Check Weight Difference</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label className="callabel">Date 1:</label>  <br />
        <input className="calforminput"
          type="date"
          value={date1}
          required
          onChange={(e) => setDate1(e.target.value)} // always YYYY-MM-DD
        />

        <br />

        <label className="callabel">Date 2:</label>  <br />
        <input

          type="date"
          className="calforminput"
          value={date2}
          required
          onChange={(e) => setDate2(e.target.value)} // always YYYY-MM-DD
        />

        <br />

        <button className="calbutton " type="submit">Check</button>
      </form>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Result</h3>

          <p>
            <strong>Date 1 Weight:</strong> {result.weight1} kg
          </p>
          <p>
            <strong>Date 2 Weight:</strong> {result.weight2} kg
          </p>
          <p>
          <span style={{ color: "red" }} >  <strong>Difference:</strong> {result.difference} kg </span> 
          </p>
          <p>
           <span style={{ color: "green" }} > <strong>Result:</strong> {result.message} </span> 
          </p>
        </div>
      )}
    </div>
  );
};

export default Checkauth(WeightLoss);
