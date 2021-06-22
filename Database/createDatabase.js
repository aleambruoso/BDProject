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
                    jsonObj._id= jsonObj.id
                    delete jsonObj.id
                    jsonObj.popularity= parseInt(jsonObj.popularity)
                })
                dbo.collection('Tracks').insertMany(result, function (err, result) {
                    if (err) throw err
                    console.log('Succesfully inserted into database ' + result.insertedCount + ' tracks')
                    var artists= readArtists()
                    artists.then(function(result1){
                        var delArt= deleteArtists(result1)
                        delArt.then(function(result2){
                            dbo.collection('Artists').insertMany(result2, function (err, result) {
                                if (err) reject(err)
                                console.log('Succesfully inserted into database ' + result.insertedCount + ' artists')
                                dbo.collection('Artists').createIndex({popularity: -1}, function (err, result) {
                                    if (err) reject(err)
                                    console.log('Succesfully created index in Artists')
                                    dbo.collection('Tracks').createIndex({popularity: -1}, function (err, result) {
                                        if (err) reject(err)
                                        console.log('Succesfully created index in Tracks')
                                        resolve()
                                    })
                                })
                            })
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

function deleteArtists(array){
    return new Promise(function(resolve, reject){
        var newJsonArray=[]
        array.forEach(function(elem){
            delete elem.year
            elem._id= elem.id
            delete elem.id
            elem.popularity= parseInt(elem.popularity)
            var temp= elem.name
            var bool=true
            newJsonArray.forEach(function(toComp){
                if(temp==toComp.name){
                    bool=false
                }
            })
            if(bool){
                newJsonArray.push(elem)
            }
        })
        resolve(newJsonArray)
    })
}