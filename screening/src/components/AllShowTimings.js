import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ShowtimePage = () => {
  const { email } = useParams();
  const navigate = useNavigate(); // Using useNavigate instead of useHistory
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/movie/movies")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  const handleShowtimeSelection = (showtimeId) => {
    navigate(`/seatmap/${showtimeId}?email=${email}`); // Use navigate to redirect to seatmap
  };

  return (
    <div>
      <h1>Showtime Page</h1>
      <table>
        <thead>
          <tr>
            <th>Movie</th>
            <th>Showtime</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            movie.showtimes.map((showtime, index) => (
              <tr key={`${movie._id}-${index}`}>
                <td>{movie.title}</td>
                <td>{showtime.date} - {showtime.time}</td>
                <td>
                  <button onClick={() => handleShowtimeSelection(showtime._id)}>Select</button>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowtimePage;
