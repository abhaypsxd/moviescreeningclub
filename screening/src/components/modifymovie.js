import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Input,
  getKeyValue,
} from "@nextui-org/react";
const SERVERIP = "http://14.139.34.10:8000";

const ModifyMovie = () => {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [addingMovie, setAddingMovie] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    // If userType is not volunteer or admin, redirect to home page
    if (!userType || userType === "standard" || userType === 'ticketvolunteer') {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (!userType || userType === "standard") {
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = async () => {
    try {
      const response = await axios.get(`${SERVERIP}/movie/movies`);
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setEditedData({
      title: movie.title,
      poster: movie.poster,
      description: movie.description,
      releaseDate: movie.releaseDate,
      genre: movie.genre,
      trailer: movie.trailer,
      currentscreening: movie.currentscreening,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${SERVERIP}/movie/movies/${editingMovie._id}`,
        editedData
      );
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie._id === editingMovie._id ? editedData : movie
        )
      );
      setEditingMovie(null);
      setEditedData({});
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setEditedData({
      ...editedData,
      [name]: newValue,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${SERVERIP}/movie/movies/${id}`);
      setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleAdd = () => {
    setAddingMovie(true);
  };

  const handleAddSave = async () => {
    try {
      const res = await axios.post(
        `${SERVERIP}/movie/add-movies`,
        editedData
      );
      console.log("Movie added:", res.data);
      setMovies([...movies, res.data]);
      setAddingMovie(false);
      setEditedData({});
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  

  const columns = [
    "title",
    "poster",
    "description",
    "release Date",
    "genre",
    "trailer",
    "current Screening",
    "actions",
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Movie List</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleAdd}
      >
        Add Movie
      </button>
      
      <div className="flex justify-center">
        <table className="w-4/5 shadow-lg">
          <thead className="capitalize bg-slate-400">
            <tr className="text-lg">
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody className="capitalize ">
            {movies.map((movie) => (
            <tr key={movie._id}>
                <td className="border px-4 py-2">
                  {editingMovie === movie ? (
                    <input
                      type="text"
                      name="title"
                      value={editedData.title}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    movie.title
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingMovie === movie ? (
                    <input
                      type="text"
                      name="poster"
                      value={editedData.poster}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="poster-image"
                    />
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingMovie === movie ? (
                    <textarea
                      name="description"
                      value={editedData.description}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    movie.description
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingMovie === movie ? (
                    <input
                      type="date"
                      name="releaseDate"
                      value={editedData.releaseDate}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    new Date(movie.releaseDate).toLocaleDateString()
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingMovie === movie ? (
                    <input
                      type="text"
                      name="genre"
                      value={editedData.genre}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    movie.genre
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingMovie === movie ? (
                    <textarea
                      name="trailer"
                      value={editedData.trailer}
                      onChange={handleChange}
                      className="w-full"
                    />
                  ) : (
                    movie.trailer
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingMovie === movie ? (
                    <input
                      type="checkbox"
                      name="currentscreening"
                      checked={editedData.currentscreening}
                      onChange={handleChange}
                    />
                  ) : movie.currentscreening ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingMovie === movie ? (
                    <div>
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setEditingMovie(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleEdit(movie)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDelete(movie._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {/* {addingMovie && (
              <tr>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={editedData.title || ""}
                    onChange={handleChange}
                    className="w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    name="poster"
                    placeholder="Poster URL"
                    value={editedData.poster || ""}
                    onChange={handleChange}
                    className="w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={editedData.description || ""}
                    onChange={handleChange}
                    className="w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="date"
                    name="releaseDate"
                    value={editedData.releaseDate || ""}
                    onChange={handleChange}
                    className="w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    name="genre"
                    placeholder="Genre"
                    value={editedData.genre || ""}
                    onChange={handleChange}
                    className="w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    name="trailer"
                    placeholder="Trailer"
                    value={editedData.trailer || ""}
                    onChange={handleChange}
                    className="w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="checkbox"
                    name="currentscreening"
                    checked={editedData.currentscreening || false}
                    onChange={handleChange}
                  />
                </td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleAddSave}
                  >
                    Save
                  </button>
                </td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModifyMovie;
