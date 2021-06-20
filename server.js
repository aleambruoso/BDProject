var express= require('express')
var cookieParser = require('cookie-parser')
var path = require('path')
var session = require('express-session')
var getDataControl = require('./app/control/getData.js')

var app= express()

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/node_modules'))
app.use(cookieParser())

app.set('views', path.join(__dirname, '/app/views'))
app.engine('html', require('ejs').renderFile)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret_session',
  resave: false,
  saveUninitialized: true
}))

app.use(function (req, res, next) {
  res.locals.session = req.session
  next()
})


app.listen(8080, function(){
    console.log("Listening on port 8080")
})

app.get('/', function(req, res){
  var page= req.query.page
  if(page==null){
    page="home"
  }
  var prom= getDataControl.getPage(page)
  prom.then(function(result){
    res.render('index.ejs', {data: JSON.stringify(result[0]).replace(/'/g, '\\\'').replace(/"/g, '\\\"'), name: result[1]})
  })
  
})

app.post('/getArtistInfo', function(req, res){
  var get = getDataControl.getArtistById(req.body.id)
  get.then(function(result){
    res.json(result)
  })
})

app.post('/getSongInfo', function(req, res){
  var get = getDataControl.getSongById(req.body.id)
  get.then(function(result){
    res.json(result)
  })
})

app.post('/searchArtists', function(req, res){
  var get= getDataControl.searchArtists(req.body.val)
  get.then(function(result){
    res.json(result)
  })
})

app.post('/searchSongs', function(req, res){
  var get= getDataControl.searchSongs(req.body.val)
  get.then(function(result){
    res.json(result)
  })
})

app.post('/saveArtist', function(req, res){
  var set= getDataControl.saveArtist(req.body.artist)
  set.then(function(result){
    res.json(result)
  })
})

app.post('/editArtist', function(req, res){
  var set= getDataControl.editArtist(req.body.artist, req.body.id)
  set.then(function(result){
    res.json(result)
  })
})