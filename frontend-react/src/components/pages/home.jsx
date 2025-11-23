import React, { useState, useEffect } from "react";
import Checkauth from "../auth/checkauth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../pagecss/home.css'

const Home = () => {
  const [data, setData] = useState([]);          
  const [page, setPage] = useState(1);          
  const [totalPages, setTotalPages] = useState(1); 
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const showData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/list/", // fetch all records
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setData(response.data); // store all data
      setTotalPages(response.data.length); // 1 record per page
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

      const newData = data.filter(item => item.id !== id);
      setData(newData);

      if (page > newData.length) setPage(newData.length || 1);
      setTotalPages(newData.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showData();
  }, []);

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const recordToShow = data.slice(page - 1, page);

  return (
    <>
      <div className="body">
        <div className="container">
          <h1 className="homeh1">Your Weight Records</h1>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Weight</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {recordToShow.map((item) => (
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

          {/* Pagination buttons */}
          <div className="pagination-buttons" style={{ marginTop: "20px" }}>
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="btn btn-primary"
              style={{ marginRight: "10px" }}
            >
              Previous
            </button>

            <span style={{ marginRight: "10px" }}>
              Page {page} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="btn btn-primary"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkauth(Home);
