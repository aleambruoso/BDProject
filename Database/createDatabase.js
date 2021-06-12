var MongoClient = require('mongodb').MongoClient

// Database URL
const url = 'mongodb://localhost:27017/BDProject'

// Database name
const dbName = 'BDProject'

const fs = require('fs')
const parse = require('csvtojson')

var ins = insert()
ins.then(function (result) {
  console.log("end")
  process.exit()
})

function insert () {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            console.log('Connected successfully to server!')
            var dbo = db.db(dbName)

            var tracks= readTracks()
            tracks.then(function(result){
                result.forEach(function(jsonObj){
                    delete jsonObj.artists
                    delete jsonObj.key
                    delete jsonObj.loudness
                    delete jsonObj.liveness
                    delete jsonObj.mode
                    delete jsonObj.speechiness
                    delete jsonObj.acousticness
                    delete jsonObj.valence
                    delete jsonObj.tempo
                    delete jsonObj.time_signature
                })
                dbo.collection('Tracks').insertMany(result, function (err, result) {
                    if (err) throw err
                    console.log('Succesfully inserted into database ' + result.insertedCount + ' tracks')
                    var artists= readArtists()
                    artists.then(function(result1){
                        result1.forEach(function(jsonObj){
                            delete jsonObj.year
                        })
                        dbo.collection('Artists').insertMany(result1, function (err, result) {
                            if (err) throw err
                            console.log('Succesfully inserted into database ' + result.insertedCount + ' artists')
                            resolve()
                        })
                    })
                })
            })
        })
    })
}

function readTracks(){
    return new Promise(function(resolve, reject){
        var jsonArray= parse().fromFile('dataset/tracks/IT.csv')
        resolve(jsonArray)
    })
}

function readArtists(){
    return new Promise(function(resolve, reject){
        var jsonArray= parse().fromFile('dataset/artisti/IT.csv')
        resolve(jsonArray)
    })
}