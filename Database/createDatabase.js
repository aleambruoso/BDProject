var MongoClient = require('mongodb').MongoClient

// Database URL
const url = 'mongodb://localhost:27017/BDProject'

// Database name
const dbName = 'BDProject'

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

            const fs = require('fs')
            const parse = require('csvtojson')

            var stream= fs.createReadStream('dataset/tracks/IT.csv')
           
            parse()
           
            .fromStream(stream)
            .subscribe(function(jsonObj){
                return new Promise(function(resolve, reject){
                    
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
                    dbo.collection('Tracks').insertOne(jsonObj, function (err, result) {
                        if (err) throw err
                        console.log('Succesfully inserted into database ' + result.insertedCount + ' tracks')
                        resolve()
                    })
                })
            })

            stream= fs.createReadStream('dataset/artisti/IT.csv')
            parse()
            .fromStream(stream)
            .subscribe(function(jsonObj){
                return new Promise(function(resolve, reject){
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
                    dbo.collection('Artists').insertOne(jsonObj, function (err, result) {
                        if (err) throw err
                        console.log('Succesfully inserted into database ' + result.insertedCount + ' artists')
                        resolve()
                    })
                })
            })
            
            resolve()
        })
    })
}