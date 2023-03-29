const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const port = 3006
const username=process.env.username
const password=process.env.password
const bodyParser = require('body-parser')
const { Client } = require('pg')
let url = `postgres://${username}:${password}@localhost:5432/movie_data_base`;
// I put my sudo username and password in .env file
const client = new Client(url)
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
const apiKey =process.env.API_KEY;

function Movie(title,poster_path,overview){
  this.title=title;
  this.poster_path=poster_path;
  this.overview=overview;
  }
  const data= require("./movie data/data.json")
  app.post('/addMovie',addMovies);
app.get('/getMovies',getAllMovies);
app.put('/UPDATE/:id', movieUpdate)//params
app.delete('/DELETE/:id', movieDelete) 


function addMovies(req,res){
   
  let {id,title,release_date,poster_path,overview} = req.body;
  // client.query(sql,values)
  let sql = `INSERT INTO Movies (id,title,release_date, poster_path,overview)
  VALUES ($1,$2,$3,$4,$5) RETURNING *; `
  let values = [id,title,release_date,poster_path,overview]
  client.query(sql,values).then((result)=>{
    console.log("add movie")
      res.status(201).json(result.rows)
      console.log(result.rows)

  }

  ).catch((err)=>{
//errorHandler(err,req,res);
  })

}

function getAllMovies(req,res) {
  let sql =`SELECT * FROM Movies;`; 
  client.query(sql).then((result)=>{
      res.json(result.rows)
  }).catch((err)=>{
      errorHandler(err,req,res)
  })
}
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
app.get('/getMovie/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const results = await connection.promise().query('SELECT * FROM movies WHERE id = ?', [movieId]);
    if (results[0]) {
      res.send(results[0]);
    } else {
      res.status(404).send('Movie not found');
    }
  } catch (error) {
    res.status(500).send(error);
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
function  movieUpdate(req,res){
  let movieId = req.params.id 
  let {id,title,release_date,poster_path,overview} = req.body;
  let sql=`UPDATE Movies SET id= $1 title = $2 , release_date= $3 , poster_path= $4 , overview= $5
  WHERE id = $6 RETURNING *;`;
  let values = [id,title,release_date,poster_path,overview, movieId];
  client.query(sql,values).then(result=>{
      console.log(result.rows);
      res.send(result.rows)
  }).catch(error => {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong.' });
  });
}

function movieDelete(req,res){
  let {id} = req.params; 
  let sql=`DELETE FROM Movies WHERE id = $1;` ;
  let value = [id];
  client.query(sql,value).then(result=>{
      res.status(204).send("deleted");
  }).catch()
}

client.connect().then(()=>{
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}).catch()
