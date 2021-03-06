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
                resolve([result, "Top 50 dance"])
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
        artist._id= ObjectID().toString()
        artist.popularity= parseInt(artist.popularity)
        var set= insertArtist(artist)
        set.then(function(result){
            resolve(result)
        })
    })
}

exports.editArtist= function(artist, id){
    return new Promise(function(resolve, reject){
        if(artist.$set.popularity!=null){
            artist.$set.popularity= parseInt(artist.$set.popularity)
        }
        var edit= updateArtist(artist, id)
        edit.then(function(result){
            resolve(result)
        })
    })
}

exports.getArtistIdByName= function(names){
    return new Promise(function(resolve, reject){
        var ids=[]
        var promises=[]
        names.forEach(function(item){
            var id= retrieveArtistId(item)
            promises.push(id)
        })
        Promise.all(promises).then(function(result){
            result.forEach(function(el){
                if(el){
                    ids.push(el._id)
                }
                else{
                    ids.push("No")
                }
            })
            resolve(ids)
        })
    })
}

exports.saveTrack= function(track){
    return new Promise(function(resolve, reject){
        track._id= ObjectID().toString()
        track.popularity= parseInt(track.popularity)
        var save= insertTrack(track)
        save.then(function(result){
            resolve(result)
        })
    })
}

exports.getArtistNameById= function(stringId){
    return new Promise(function(resolve, reject){
        stringId= stringId.replace(/(\[|\]|\')/g, '')
        var ids= stringId.split(',')
        var promises=[]
        var names=[]
        ids.forEach(function(id){
            id=id.trim()
            var name=retrieveArtistName(id)
            promises.push(name)
        })
        Promise.all(promises).then(function(result){
            result.forEach(function(el){
                names.push(el.name)
            })
            resolve(names)
        })
    })
}

exports.editTrack= function(json, id){
    return new Promise(function(resolve, reject){
        if(json.$set.popularity!=null){
            json.$set.popularity= parseInt(json.$set.popularity)
        }
        var edit= updateTrack(json, id)
        edit.then(function(result){
            resolve(result)
        })
    })
}

function getHome(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Tracks').find({popularity: {$gt:85}}, {sort: {popularity: -1}, projection:{explicit:0, release_date:0, danceability:0, energy:0, instrumentalness:0}}).toArray(function (err, result) {
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
            dbo.collection('Artists').find({popularity: {$gt:87}}, {sort:{popularity: -1}}).toArray(function (err, result) {
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
            var promises=[]
            for(var i=0; i<array.length; i++){
                array[i]= array[i].trim()

                var prom= new Promise(function(resolve, reject){
                    dbo.collection('Artists').findOne({_id: array[i]}, {projection:{followers:0, genres:0, popularity:0}}, function(err, result){
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
            dbo.collection('Artists').findOne({_id: id}, function (err, result) {
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
            dbo.collection('Tracks').findOne({_id: id}, function (err, result) {
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

function updateArtist(artist, id){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Artists').updateOne({_id: id}, artist ,function (err, result) {
                if (err) reject(err)
                db.close()
                resolve(true)
            })
        })
    })
}

function retrieveArtistId(name){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            name=name.trim()
            dbo.collection('Artists').findOne({name: {$regex: RegExp(name, "i")}}, {projection: {followers:0, genres:0, popularity:0, name:0}} ,function (err, result) {
                if (err) reject(err)
                db.close()
                resolve(result)
            })
        })
    })
}

function insertTrack(track){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Tracks').insertOne(track, function (err, result) {
                if (err) reject(err)
                db.close()
                resolve(true)
            })
        })
    })
}

function retrieveArtistName(id){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Artists').findOne({_id: id}, {projection: {followers:0, genres:0, popularity:0}}, function (err, result) {
                if (err) reject(err)
                db.close()
                resolve(result)
            })
        })
    })
}

function updateTrack(json, id){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
            if (err) reject(err)
            var dbo = db.db(dbName)
            dbo.collection('Tracks').updateOne({_id: id}, json ,function (err, result) {
                if (err) reject(err)
                db.close()
                resolve(true)
            })
        })
    })
}