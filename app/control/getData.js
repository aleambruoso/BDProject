var MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/BDProject'
const dbName = 'BDProject'

exports.getPage= function(page){
    return new Promise(function(resolve, reject){
        if(page=="home"){
            var p1= getHome()
            p1.then(function(result){
                var data= result.slice(0, 100)
                resolve([data, "Top 100"])
            })
           
            
        }
        else if(page=="dance"){
            var p1= getDance()
            p1.then(function(result){
                var data= result.slice(0, 100)
                resolve([data, "Top 50 dance"])
            })
        }
        else if(page=="artist"){
            var p1= getArtists()
            p1.then(function(result){
                var data= result.slice(0, 100)
                resolve([data, "Top 50 artisti"])
            })
        }
        else if(page=="instrumental"){
            var p1= getInstrumental()
            p1.then(function(result){
                var data= result.slice(0, 100)
                resolve([data, "Top 50 strumentale"])
            })
        }
    })
}

function getHome(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Tracks').find({$query: {$expr: {$gt: [{$toInt: "$popularity"}, 85]}}, $orderby:{popularity: -1}}).toArray(function (err, result) {
                if (err) reject(err)
                db.close()
                resolve(result)
            })
        })
    })
}

function getDance(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Tracks').find({$query: {$expr: {$gt: [{$toDouble: "$danceability"}, 0.95]}}, $orderby:{danceability: -1}}).limit(50).toArray(function (err, result) {
                if (err) reject(err)
                db.close()
                resolve(result)
            })
        })
    })
}

function getArtists(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Artists').find({$query: {$expr: {$gt: [{$toInt: "$popularity"}, 90]}}, $orderby:{popularity: -1}}).limit(50).toArray(function (err, result) {
                if (err) reject(err)
                db.close()
                resolve(result)
            })
        })
    })
}

function getInstrumental(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Tracks').find({$query: {$expr: {$gt: [{$toDouble: "$instrumentalness"}, 0.98]}}, $orderby:{instrumentalness: -1}}).limit(50).toArray(function (err, result) {
                if (err) reject(err)
                db.close()
                resolve(result)
            })
        })
    })
}