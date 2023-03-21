const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT
const app = express();
app.use(cors());
const apiKey =process.env.API_KEY;

function Movie(title,poster_path,overview){
  this.title=title;
  this.poster_path=poster_path;
  this.overview=overview;
  }
  const data= require("./movie data/data.json")
  
  app.get('/', movieData )
  function movieData(req,res){
      let result=[];
      const newMovie= new Movie(data.title,data.poster_path,data.overview)
      result.push(newMovie)
      res.json(result);
  }

app.get('/trending', (req, res) => {
  axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
    .then(response => {
      const results = response.data.results.map(result => ({
        id: result.id,
        title: result.title,
        release_date: result.release_date,
        poster_path: result.poster_path,
        overview: result.overview,
      }));
      res.json(results);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Something went wrong.' });
    });
});


app.get('/search', (req, res) => {
  const query = req.query.query;
  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`)
    .then(response => {
      const results = response.data.results.map(result => ({
        id: result.id,
        title: result.title,
        release_date: result.release_date,
        poster_path: result.poster_path,
        overview: result.overview,
      }));
      res.json(results);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Something went wrong.' });
    });
});

app.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page")
})

function handleNtFoundError(req, res){
  res.status(404).send("not found")
}
function handleInternalServerError(err, req, res, next) {
 
  res.status(500).send('An internal server error has occurred.');
}
app.use("*", handleNtFoundError)
app.use(handleInternalServerError);

// Endpoint for getting movie details by ID
app.get('/movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
    const movieData = response.data;
    const { title, release_date, poster_path, overview, runtime, genres } = movieData;
    res.send({ id, title, release_date, poster_path, overview, runtime, genres });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Endpoint for getting similar movies by ID
app.get('/movie/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}`);
    const movieData = response.data.results;
    const similarMovies = movieData.map(movie => {
      const { id, title, release_date, poster_path, overview } = movie;
      return { id, title, release_date, poster_path, overview };
    });
    res.send(similarMovies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Endpoint for getting popular people
app.get('/person/popular', async (req, res) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/person/popular?api_key=${apiKey}`);
    const personData = response.data.results;
    const popularPeople = personData.map(person => {
      const { id, name, profile_path, known_for_department } = person;
      return { id, name, profile_path, known_for_department };
    });
    res.send(popularPeople);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Start server
app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })