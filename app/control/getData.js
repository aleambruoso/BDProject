var MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/BDProject'
const dbName = 'BDProject'

exports.getPage= function(page){
    return new Promise(function(resolve, reject){
        if(page=="home"){
            var p1= getHome()
            p1.then(function(result){
                var data= result.slice(0, 100)
                var promises=[]
                data.forEach(function(song){
                    var dataName= getArtistsName(song.id_artists)
                    promises.push(dataName)
                })
                Promise.all(promises).then(function(names){
                    for(var i=0; i<100; i++){
                        if(names[i]==null){
                            data[i].artists="null"
                        }
                        else{
                            data[i].artists=names[i]
                        }
                    }
                    resolve([data, "Top 100"])
                })
            })
           
            
        }
        else if(page=="dance"){
            var p1= getDance()
            p1.then(function(result){
                var data= result.slice(0, 100)
                var promises=[]
                data.forEach(function(song){
                    var dataName= getArtistsName(song.id_artists)
                    promises.push(dataName)
                })
                Promise.all(promises).then(function(names){
                    for(var i=0; i<100; i++){
                        if(names[i]==null){
                            data[i].artists="null"
                        }
                        else{
                            data[i].artists=names[i]
                        }
                    }
                    resolve([data, "Top 50 dance"])
                })
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
                var promises=[]
                data.forEach(function(song){
                    var dataName= getArtistsName(song.id_artists)
                    promises.push(dataName)
                })
                Promise.all(promises).then(function(names){
                    for(var i=0; i<100; i++){
                        if(names[i]==null){
                            data[i].artists="null"
                        }
                        else{
                            data[i].artists=names[i]
                        }
                    }
                    resolve([data, "Top 50 strumentale"])
                })
            })
        }
    })
}

function getHome(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Tracks').find({$query: {$expr: {$gt: [{$toInt: "$popularity"}, 85]}}}, {sort: {popularity: -1}, fields:{explicit:0, release_date:0, danceability:0, energy:0, instrumentalness:0}}).toArray(function (err, result) {
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
            dbo.collection('Tracks').find({$query: {$expr: {$gt: [{$toDouble: "$danceability"}, 0.95]}}}, {sort:{danceability: -1}, fields:{explicit:0, release_date:0, popularity:0, energy:0, instrumentalness:0}}).toArray(function (err, result) {
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
            dbo.collection('Artists').find({$query: {$expr: {$gt: [{$toInt: "$popularity"}, 90]}}}, {sort:{popularity: -1}}).toArray(function (err, result) {
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
            dbo.collection('Tracks').find({$query: {$expr: {$gt: [{$toDouble: "$instrumentalness"}, 0.98]}}}, {sort:{instrumentalness: -1}, fields:{explicit:0, release_date:0, danceability:0, energy:0, popularity:0}}).toArray(function (err, result) {
                if (err) reject(err)
                db.close()
                resolve(result)
            })
        })
    })
}

function getArtistsName(ids){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            ids= ids.replace(/(\[|\]|\')/g, '')
            var array= ids.split(',')
            for(var i=0; i<array.length; i++){
                var promises=[]

                var prom= new Promise(function(resolve, reject){
                    dbo.collection('Artists').findOne({id: array[i]}, {fields:{followers:0, genres:0, popularity:0}}, function(err, result){
                        if (err) reject(err)
                        db.close()
                        resolve(result)
                    })
                })

                promises.push(prom)
            }
            Promise.all(promises).then(function(result){
                names=[]
                result.forEach(function(artist){
                    names.push(artist)
                })
                resolve(names)
            })
        })
    })
}