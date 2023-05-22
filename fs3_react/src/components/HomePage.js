import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [searchText, setSearchText] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [updatedMovieData, setUpdatedMovieData] = useState({});
  const [newMovieData, setNewMovieData] = useState({});
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get(`http://localhost:3000/api/title/${searchText}`);
      setMovies(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMovieUpdate = (movie) => {
    setSelectedMovie(movie);
    setUpdatedMovieData({
      title: movie.title,
      year: movie.year,
      directors: movie.directors,
      poster: movie.poster,
    });
  };

  const handleUpdateInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async () => {
    try {
      alert('Movie has been updated!');
      const response = await axios.put(
        `http://localhost:3000/api/update/${selectedMovie._id}`,
        updatedMovieData
      );
      console.log('Movie updated:', response.data);
      const updatedMovies = movies.map((movie) =>
        movie._id === response.data._id ? response.data : movie
      );
      setMovies(updatedMovies);
      setSelectedMovie(null);
      setUpdatedMovieData({});
    } catch (error) {
      console.error(error);
    }
  };

  const handleMovieDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/delete/${id}`);
      const updatedMovies = movies.filter((movie) => movie._id !== id);
      setMovies(updatedMovies);
      console.log('Movie deleted:', id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddMovieModalOpen = () => {
    setShowAddMovieModal(true);
    setNewMovieData({
      title: '',
      year: '',
      directors: '',
      poster: '',
    });
  };

  const handleAddMovieModalClose = () => {
    setShowAddMovieModal(false);
    setNewMovieData({});
  };

  const handleNewMovieInputChange = (event) => {
    const { name, value } = event.target;
    setNewMovieData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddMovieSubmit = async (event) => {
    event.preventDefault();

    const movieToAdd = {
      title: newMovieData.title,
      year: newMovieData.year,
      directors: newMovieData.directors,
      poster: newMovieData.poster,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/add', movieToAdd);
      console.log('Movie added:', response.data);
      alert("Movie added to the database!");
      handleAddMovieModalClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedMovie && !updatedMovieData.title) {
      setSelectedMovie(null);
    }
  }, [selectedMovie, updatedMovieData.title]);

  return (
    <div className="wrapper">
      <h2>Search for movies by title</h2>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Enter a title of a movie..."
        />
        <button className="search-button" type="submit">
          Search
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Directors</th>
            <th>Poster</th>
            <th>ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id}>
              <td>{movie.title}</td>
              <td>{movie.year}</td>
              <td>{movie.directors}</td>
              <td>
                <img className="poster" src={movie.poster} alt={movie.title} />
              </td>
              <td>{movie._id}</td>
              <td>
                <button className="update-button" onClick={() => handleMovieUpdate(movie)}>
                  Update
                </button>
                <button className="delete-button" onClick={() => handleMovieDelete(movie._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedMovie && (
        <div className="modal">
          <h3>Update Movie</h3>
          <form onSubmit={handleUpdateSubmit}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={updatedMovieData.title}
                onChange={handleUpdateInputChange}
              />
            </div>
            <div>
              <label>Year:</label>
              <input
                type="text"
                name="year"
                value={updatedMovieData.year}
                onChange={handleUpdateInputChange}
              />
            </div>
            <div>
              <label>Directors:</label>
              <input
                type="text"
                name="directors"
                value={updatedMovieData.directors}
                onChange={handleUpdateInputChange}
              />
            </div>
            <div>
              <label>Poster:</label>
              <input
                type="text"
                name="poster"
                value={updatedMovieData.poster}
                onChange={handleUpdateInputChange}
              />
            </div>
            <button type="submit">Update</button>
            <button type="button" onClick={handleAddMovieModalClose}>Cancel</button>
          </form>
        </div>
      )}

      {showAddMovieModal && (
        <div className="modal">
          <h3>Add Movie</h3>
          <form onSubmit={handleAddMovieSubmit}>
            <div>
              <label>Title:</label>
              <input
                type= "Text"
                name="title"
                value={newMovieData.title}
                onChange={handleNewMovieInputChange}
              />
            </div>
            <div>
              <label>Year:</label>
              <input
                type="text"
                name="year"
                value={newMovieData.year}
                onChange={handleNewMovieInputChange}
              />
            </div>
            <div>
              <label>Directors:</label>
              <input
                type="text"
                name="directors"
                value={newMovieData.directors}
                onChange={handleNewMovieInputChange}
              />
            </div>
            <div>
              <label>Poster:</label>
              <input
                type="text"
                name="poster"
                value={newMovieData.poster}
                onChange={handleNewMovieInputChange}
              />
            </div>
            <button className="add-add-button" type="submit">Add</button>
            <button type="button" onClick={handleAddMovieModalClose}>Cancel</button>
          </form>
        </div>
      )}

      <button className="add-button" onClick={handleAddMovieModalOpen}>
        Add Movie
      </button>
    </div>
  );
};

export default HomePage;
