import React, { useState, useEffect } from "react";
import Checkauth from "../auth/checkauth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../pagecss/home.css'

const Home = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Get token from localStorage
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const showData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/list/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/listdelete/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // Refresh list after delete
      showData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showData();
  }, []);

  return (
    <>
    <div className="body">
      <div className="container">
        <h1 className="homeh1">Your Weight Records</h1>

        <table className="table table-bordered ">
          <thead>
            <tr>
              <th>Weight</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.weight}</td>
                <td>{item.date}</td>
                <td>
                  <Link
                    to={`/editlist/${item.id}`}
                    className="btn btn-success"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteData(item.id)}
                    className="btn btn-danger"
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      </div>
    </>
  );
};

export default Checkauth(Home);
