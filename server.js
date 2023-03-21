const express = require('express')
const app = express()
const port = 3000
const data= require("./movie data/data.json")
app.use("*", handleNtFoundError)
app.use("*", handleServerErr)
function Movie(title,poster_path,overview){
this.title=title;
this.poster_path=poster_path;
this.overview=overview;
}
app.get('/', movieData )
function movieData(req,res){
    let result=[];
    const newMovie= new Movie(data.title,data.poster_path,data.overview)
    result.push(newMovie)
    res.json(result);
}
app.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page")
})

function handleNtFoundError(req, res){
  res.status(404).send("not found")
}
function handleServerErr(req, res){
  res.status(500).send('Internal Server Error');
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})