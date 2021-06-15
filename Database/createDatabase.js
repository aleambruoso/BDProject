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
                        var delArt= deleteArtists(result1)
                        delArt.then(function(result2){
                            dbo.collection('Artists').insertMany(result2, function (err, result) {
                                if (err) reject(err)
                                console.log('Succesfully inserted into database ' + result.insertedCount + ' artists')
                                resolve()
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

function deleteArtistss(array){
    return new Promise(function(resolve, reject){
        Promise.all([
            new Promise(function(resolve, reject){
                array.forEach(function(elem){
                    var temp= elem.name
                    var id= elem.id
                    Promise.all([
                        new Promise(function(resolve, reject){
                            var index=[]
                            array.forEach(function(toComp){
                                if(temp==toComp.name){
                                    if(id!=toComp.id){
                                        index.push(array.indexOf(toComp))
                                    }
                                }
                            })
                            console.log(index)
                            resolve(index)
                        })
                    ]).then(function(result){
                        console.log(result)
                        result.forEach(function(ind){
                            array.splice(ind, 1)
                        })
                    })
                })
                resolve()
            })
        ])
        .then(function(){
            resolve(array)
        })
    })
}

function deleteArtists(array){
    return new Promise(function(resolve, reject){
        var newJsonArray=[]
        array.forEach(function(elem){
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
        console.log(newJsonArray)
        resolve(newJsonArray)
    })
}