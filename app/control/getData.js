var MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectId
var lodash= require('lodash/array')

const url = 'mongodb://localhost:27017/BDProject'
const dbName = 'BDProject'

exports.getPage= function(page){
    return new Promise(function(resolve, reject){
        if(page=="home"){
            var p1= getHome()
            p1.then(function(result){
                resolve([result, "Top 100"])
            })
        }
        else if(page=="dance"){
            var p1= getDance()
            p1.then(function(result){
                resolve([result, "Top 100"])
            })
        }
        else if(page=="artist"){
            var p1= getArtists()
            p1.then(function(result){
                resolve([result, "Top 50 artisti"])
            })
        }
        else if(page=="instrumental"){
            var p1= getInstrumental()
            p1.then(function(result){
                resolve([result, "Top 50 strumentale"])
            })
        }
        else if(page=="genres"){
            var p1= getGenres()
            p1.then(function(result){
                resolve([result, "Generi"])
            })
        }
    })
}

exports.getArtistById= function(id){
    return new Promise(function(resolve, reject){
        var get= getArtistId(id)
        get.then(function(result){
            resolve(result)
        })
    })
}

exports.getSongById= function(id){
    return new Promise(function(resolve, reject){
        var get= getSongId(id)
        get.then(function(result){
            resolve(result)
        })
    })
}

exports.searchArtists= function(val){
    return new Promise(function(resolve, reject){
        var get= getSearchedArtists(val)
        get.then(function(result){
            resolve(result)
        })
    })
}

exports.searchSongs= function(val){
    return new Promise(function(resolve, reject){
        var get= getSearchedSongs(val)
        get.then(function(result){
            resolve(result)
        })
    })
}

exports.saveArtist= function(artist){
    return new Promise(function(resolve, reject){
        var id= ObjectID()
        artist.id= id.toString()
        artist._id= id
        var set= insertArtist(artist)
        set.then(function(result){
            resolve(result)
        })
    })
}

function getHome(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Tracks').find({$query: {$expr: {$gt: [{$toInt: "$popularity"}, 85]}}}, {sort: {popularity: -1}, projection:{explicit:0, release_date:0, danceability:0, energy:0, instrumentalness:0}}).toArray(function (err, result) {
                if (err) reject(err)
                var get= resolveArtists(result.slice(0,100))
                get.then(function(result1){
                    db.close()
                    resolve(result1)
                })
            })
        })
    })
}

function getDance(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Tracks').find({$query: {$expr: {$gt: [{$toDouble: "$danceability"}, 0.95]}}}, {sort:{danceability: -1}, projection:{explicit:0, release_date:0, popularity:0, energy:0, instrumentalness:0}}).toArray(function (err, result) {
                if (err) reject(err)
                var get= resolveArtists(result.slice(0,50))
                get.then(function(result1){
                    db.close()
                    resolve(result1)
                })
            })
        })
    })
}

function getArtists(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            var arr=[]
            dbo.collection('Artists').find({$query: {$expr: {$gt: [{$toInt: "$popularity"}, 87]}}}, {sort:{popularity: -1}}).toArray(function (err, result) {
                if (err) reject(err)
                var data= result.slice(0, 50)
                var get= resolveGenres(data)
                get.then(function(result1){
                    db.close()
                    resolve(result1)
                })
            })
        })
    })
}

function getInstrumental(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Tracks').find({$query: {$expr: {$gt: [{$toDouble: "$instrumentalness"}, 0.98]}}}, {sort:{instrumentalness: -1}, projection:{explicit:0, release_date:0, danceability:0, energy:0, popularity:0}}).toArray(function (err, result) {
                if (err) reject(err)
                var get= resolveArtists(result.slice(0,50))
                get.then(function(result1){
                    db.close()
                    resolve(result1)
                })
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
                    dbo.collection('Artists').findOne({id: array[i]}, {projection:{followers:0, genres:0, popularity:0}}, function(err, result){
                        if (err) reject(err)
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

function getArtistId(id){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Artists').findOne({_id: ObjectID(id)}, function (err, result) {
                if (err) reject(err)
                db.close()
                var generi= result.genres
                generi= generi.replace(/(\[|\]|\')/g, '')
                if(generi==""){
                    result.genres=[null]
                }
               else{
                    result.genres= generi.split(',')
                }
                resolve(result)
            })
        })
    })
}

function getSongId(id){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Tracks').findOne({_id: ObjectID(id)}, function (err, result) {
                if (err) reject(err)
                db.close()
                resolve(result)
            })
        })
    })
}

function getSearchedArtists(val){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Artists').find({name:{$regex: val, $options : 'i'}}, {sort:{popularity: -1}}).limit(50).toArray(function (err, result) {
                if (err) reject(err)
                db.close()
                var get= resolveGenres(result)
                get.then(function(result1){
                    resolve(result1)
                })
            })
        })
    })
}

function getSearchedSongs(val){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Tracks').find({name: {$regex: val, $options: 'i'}}, {sort: {popularity: -1}, projection:{explicit:0, release_date:0, danceability:0, energy:0, instrumentalness:0}}).limit(50).toArray(function (err, result) {
                if (err) reject(err)
                var get= resolveArtists(result.slice(0,50))
                get.then(function(result1){
                    db.close()
                    resolve(result1)
                })
            })
        })
    })
}

function resolveGenres(artists){
    return new Promise(function(resolve, reject){
        artists.forEach(function(item){
            if(item!=null){
                var generi= item.genres
                generi= generi.replace(/(\[|\]|\')/g, '')
                if(generi==""){
                    item.genres=[null]
                }
                else{
                    item.genres= generi.split(',')
                }
            }
        })
        resolve(artists)
    })
}

function resolveArtists(data){
    return new Promise(function(resolve, reject){
        var promises=[]
        data.forEach(function(song){
            var dataName= getArtistsName(song.id_artists)
            promises.push(dataName)
        })
        Promise.all(promises).then(function(names){
            for(var i=0; i<data.length; i++){
                if(names[i]==null){
                    data[i].artists=[null]
                }
                else{
                    data[i].artists=names[i]
                }
            }
            resolve(data)
        })
    })
}

function getGenres(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Artists').find({}, {sort:{popularity: -1}, projection: {followers:0, popularity:0}}).toArray(function (err, result) {
                if (err) reject(err)
                var data= result.slice(0, 50)
                var get= resolveGenres(data)
                get.then(function(result1){
                    db.close()
                    var un= unionArray(result1)
                    un.then(function(result2){
                        resolve(result2)
                    })
                })
            })
        })
    })
}

function unionArray(artists){
    return new Promise(function(resolve, reject){
        var temp=[]
        artists.forEach(function(artist){
            if(temp.length!=0){
                if(artist.genres[0]!=null){

                    temp=lodash.union(temp, artist.genres.map(function(s){return s.trim()}))
                }
            }
            else{
                temp=artist.genres.map(function(s){return s.trim()})
            }
        })
        var data= temp.map(function(value, key){
            return{
                "title":value
            }
        })
        artists.forEach(function(artist){
            if(artist.genres[0]!=null){
                artist.genres.forEach(function(genere){
                    var index= data.findIndex(function(item){return item.title.trim()==genere.trim()})
                    if(index!=-1){
                        if(data[index].artistsName!=null && data[index].artistsName.length!=0){
                            data[index].artistsName.push(artist.name)
                        }
                        else{
                            data[index].artistsName=[artist.name]
                        }
                        
                    }
                })
            }
        })
        resolve(data)
    })
}

function insertArtist(artist){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Artists').insertOne(artist,function (err, result) {
                if (err) reject(err)
                db.close()
                resolve(true)
            })
        })
    })
}