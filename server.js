var express= require('express')
var cookieParser = require('cookie-parser')
var path = require('path')
var session = require('express-session')

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
    res.render('index.ejs' , { root : __dirname});
})