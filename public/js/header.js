$(document).ready(function(){
    startPage(pageName, pageData)

    $(".header__icon-bar").click(function(e){
        e.preventDefault();
        
        if($(".for_swipe").height()==0){
            $( ".for_swipe" ).animate({
                height: $(".for_swipe").get(0).scrollHeight
            }, 500, function() {
            });
        }
        else if($(".for_swipe").height()>0){
            $( ".for_swipe" ).animate({
                height: "0"
            }, 500, function() {
            });
        }

    });

    $(document).on("click", '.song_line', function(){
        var id= $(this).children('.forIdSong').text()
        var artists=$(this).children('.artists').text()
        $.ajax({
            type: 'POST',
            url:'/getSongInfo',
            data:{id: id},
            success: function(result){
                var html="<b>Nome: </b>"+result.name+"</br><b>Artisti: </b>"+artists+"</br><b>Popolarità: </b>"+result.popularity
                +"%</br><b>Esplicita: </b>"+((result.explicit=="0")? "No" : "Si") +"</br><b>Data di rilascio: </b>"+result.release_date+"</br><b>Quanto è energica (0 a 1): </b>"
                +parseFloat(result.energy)+"</br><b>Quanto è dance (0 a 1): </b>"+parseFloat(result.danceability)+"</br><b>Quanto è strumentale (0 a 1): </b>"+parseFloat(result.instrumentalness)
                Swal.fire({
                    icon: 'info', 
                    title: 'Informazioni', 
                    html: html,
                    showCloseButton: true,
                    confirmButtonText: 'Ok',
                    showDenyButton: true,
                    denyButtonText: 'Modifica'
                }).then(function(result){
                    if(result.isDenied){

                    }
                })
            }
        })
    })

    $(document).on("click", '.artist_line', function(){
        var id= $(this).children('.forIdArtist').text()
        $.ajax({
            type: 'POST',
            url:'/getArtistInfo',
            data:{id: id},
            success: function(result){
                var artist=result
                var html="<b>Nome: </b>"+result.name+"</br><b>"
                var generi= result.genres
                if(generi[0]!=null){
                    html+="Generi: </b>"
                    generi.forEach(function(gen){
                        html+=gen+", "
                    })
                    html=html.substring(0, html.length-2)
                    html+="</br><b>"
                }
                html+="Numero di followers: </b>"+result.followers+"</br><b>Popolarità: </b>"+result.popularity+"%"
                Swal.fire({
                    icon: 'info', 
                    title: 'Informazioni', 
                    html: html,
                    showCloseButton: true,
                    confirmButtonText: 'Ok',
                    showDenyButton: true,
                    denyButtonText: 'Modifica'
                }).then(function(result){
                    if(result.isDenied){
                        Swal.fire({ 
                            title: 'Modifica artista', 
                            text: 'Modifica il nome',
                            input: 'text',
                            inputValue: artist.name,
                            backdrop: true,
                            showCloseButton: true,
                            confirmButtonText: 'Modifica <i class="fa fa-arrow-right"></i>',
                            showLoaderOnConfirm: true,
                            showDenyButton: true,
                            denyButtonText: 'Salta',
                            preConfirm: function(item){
                                if(item==""){
                                    Swal.showValidationMessage(
                                        'Il campo non può essere vuoto'
                                    )
                                }
                            },
                            allowOutsideClick: () => !Swal.isLoading()
                        }).then(function(result){
                            var updateJson={$set:{}}
                            if(result.isConfirmed){
                                updateJson.$set.name=result.value
                            }
                            if(result.isConfirmed || result.isDenied){
                                Swal.fire({ 
                                    title: 'Modifica artista', 
                                    text: 'Modifica numero followers',
                                    input: 'text',
                                    inputValue: artist.followers,
                                    backdrop: true,
                                    showCloseButton: true,
                                    confirmButtonText: 'Modifica <i class="fa fa-arrow-right"></i>',
                                    showLoaderOnConfirm: true,
                                    showDenyButton: true,
                                    denyButtonText: 'Salta',
                                    preConfirm: function(item){
                                        if(item==""){
                                            Swal.showValidationMessage(
                                                'Il campo non può essere vuoto'
                                            )
                                        }
                                        else if(isNaN(item)){
                                            Swal.showValidationMessage(
                                                'Il campo deve contenere un numero'
                                            )
                                        }
                                    },
                                    allowOutsideClick: () => !Swal.isLoading()
                                }).then(function(result){
                                    if(result.isConfirmed){
                                        updateJson.$set.followers=result.value
                                    }
                                    if(result.isConfirmed || result.isDenied){
                                        Swal.fire({ 
                                            title: 'Modifica artista', 
                                            text: 'Modifica popolarità artista',
                                            input: 'text',
                                            inputValue: artist.popularity,
                                            backdrop: true,
                                            showCloseButton: true,
                                            confirmButtonText: 'Modifica <i class="fa fa-arrow-right"></i>',
                                            showLoaderOnConfirm: true,
                                            showDenyButton: true,
                                            denyButtonText: 'Salta',
                                            preConfirm: function(item){
                                                if(item==""){
                                                    Swal.showValidationMessage(
                                                        'Il campo non può essere vuoto'
                                                    )
                                                }
                                                else if(isNaN(item)){
                                                    Swal.showValidationMessage(
                                                        'Il campo deve contenere un numero'
                                                    )
                                                }
                                                else if(item<0 || item>100){
                                                    Swal.showValidationMessage(
                                                        'Il valore deve essere compreso tra 0 e 100'
                                                    )
                                                }
                                            },
                                            allowOutsideClick: () => !Swal.isLoading()
                                        }).then(function(result){
                                            if(result.isConfirmed){
                                                updateJson.$set.popularity=result.value
                                            }
                                            if(result.isConfirmed || result.isDenied){
                                                var editGeneri= stringGenre(artist.genres)
                                                Swal.fire({ 
                                                    title: 'Modifica artista', 
                                                    text: 'Modifica i generi dell\'artista (scrivere "Non presenti" nel caso non ci siano)',
                                                    input: 'text',
                                                    inputValue: editGeneri,
                                                    backdrop: true,
                                                    showCloseButton: true,
                                                    confirmButtonText: 'Modifica <i class="fa fa-arrow-right"></i>',
                                                    showLoaderOnConfirm: true,
                                                    showDenyButton: true,
                                                    denyButtonText: 'Salta',
                                                    preConfirm: function(item){
                                                        if(item==""){
                                                            Swal.showValidationMessage(
                                                                'Il campo non può essere vuoto'
                                                            )
                                                        }
                                                    },
                                                    allowOutsideClick: () => !Swal.isLoading()
                                                }).then(function(result){
                                                    if(result.isConfirmed){
                                                        if(result.value=="Non presenti"){
                                                            updateJson.$set.genres="[]"
                                                        }
                                                        else{
                                                            var list= result.value.split(',')
                                                            var artistGenres="["
                                                            list.forEach(function(elem){
                                                                elem.trim()
                                                                artistGenres+="'"+elem+"'"
                                                                artistGenres+=", "
                                                            })
                                                            artistGenres= artistGenres.substr(0, artistGenres.length-2)
                                                            artistGenres+="]"
                                                            updateJson.$set.genres=artistGenres
                                                        }
                                                    }
                                                    if(result.isConfirmed || result.isDenied){
                                                        $.ajax({
                                                            type: 'POST',
                                                            url:'/editArtist',
                                                            data:{artist: updateJson, id: artist._id},
                                                            success: function(result){
                                                                Swal.fire({
                                                                    icon: 'success', 
                                                                    title: 'Artista modificato', 
                                                                    text: 'L\'artista è stato modificato con successo.',
                                                                    showCloseButton: true,
                                                                    confirmButtonText: 'Ok'
                                                                }).then(function(result){
                                                                    location.reload()
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    })

    $(document).on("click", '.generi_line', function(){
        var title= $(this).children('.title_genre').text()
        console.log(title)
        var index= pageData.findIndex(function(item){return item.title==title})
        var html="<b>Genere: </b>"+title+"</br><b>"
        var artisti= pageData[index].artistsName
        html+="Artisti: </b>"
        artisti.forEach(function(art){
            html+=art+",</br>"
        })
        html=html.substring(0, html.length-6)
        html+="</br><b>"
        Swal.fire({
            icon: 'info', 
            title: 'Informazioni', 
            html: html,
            showCloseButton: true,
            confirmButtonText: 'Ok'
        })
    })

    $('.search_artist').on('input', function(){
        var val= $(this).val()
        if (val.length==0){
            $('.artist_line').remove()
            startPage(pageName, pageData)
        }
        else{
            $.ajax({
                type: 'POST',
                url:'/searchArtists',
                data:{val: val},
                success: function(result){
                    $('.artist_line').remove()
                    $('.not_element').remove()

                    if(result.length==0){
                        if($('.not_element').length==0){
                            $('.table').after('<h2 class="not_element">Nessun artista trovato</h2>')
                        }
                    }
                    else{
                        var i=1
                        result.forEach(function(artist){
                            $('.table_body').append(['<tr class="artist_line">',
                                                        '<td>'+i+'</td>',
                                                        '<td></td>',
                                                        '<td class="forIdArtist" style="display: none;">'+artist._id+'</td>',
                                                        '<td>'+artist.name+'</td>',
                                                        '<td>'+((artist.genres[0]==null)? "Non presente" : getGenre(artist.genres))+'</td>',
                                                        '<td>'+artist.followers+'</td>',
                                                    '</tr>'].join('\n'))
                        })
                    }
                }
            })
        }
    })

    $('.search_song').on('input', function(){
        var val= $(this).val()
        console.log(val.length)
        if (val.length==0){
            $('.song_line').remove()
            startPage(pageName, pageData)
        }
        else{
            $.ajax({
                type: 'POST',
                url:'/searchSongs',
                data:{val: val},
                success: function(result){
                    $('.song_line').remove()
                    $('.not_element').remove()

                    if(result.length==0){
                        if($('.not_element').length==0){
                            $('.table').after('<h2 class="not_element">Nessuna canzone trovata</h2>')
                        }
                    }
                    else{
                        var i=1
                        result.forEach(function(song){
                            $('.table_body').append(['<tr class="song_line">',
                                                        '<td>'+i+++'</td>',
                                                        '<td></td>',
                                                        '<td class="forIdSong" style="display: none;">'+song._id+'</td>',
                                                        '<td>'+song.name+'</td>',
                                                        '<td class="artists">'+((song.artists[0]==null)? "Non presente" : getArtistsName(song.artists))+'</td>',
                                                        '<td>'+millisToMinutesAndSeconds(song.duration_ms)+'</td>',
                                                    '</tr>'].join('\n'))
                        })
                    }
                }
            })
        }
    })

    $('.search_genre').on('input', function(){
        var val= $(this).val()
        if (val.length==0){
            $('.generi_line').remove()
            startPage(pageName, pageData)
        }
        else{
            var found= pageData.filter(function(data){
                return data.title.indexOf(val)!=-1
            })

            $('.generi_line').remove()
            $('.not_element').remove()

            if(found.length==0){
                if($('.not_element').length==0){
                    $('.table').after('<h2 class="not_element">Nessuna canzone trovata</h2>')
                }
            }
            else{
                var i=1
                found.forEach(function(genre){
                    $('.table_body').append(['<tr class="generi_line">',
                                                '<td>'+i+++'</td>',
                                                '<td></td>',
                                                '<td class="title_genre">'+genre.title+'</td>',
                                                '<td>'+((genre.artistsName==null)? "Non presente" : getArtists(genre.artistsName))+'</td>',
                                                '<td></td>',
                                            '</tr>'].join('\n'))
                })
            }
        }
    })
});


function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function getArtistsName(artists){
    var text=""
    artists.forEach(function(artist){
        text+=artist.name+', '
    })
    return text.substring(0, text.length-2)
}

function getGenre(genres){
    var text=""
    genres.forEach(function(genre){
        text+=genre+', '
    })
    return text.substring(0, text.length-2)
}

function getArtists(artists){
    var text=""
    artists.slice(0,50).forEach(function(artist){
        text+=artist+', '
    })
    return text.substring(0, text.length-2)
}


function startPage(name, data){
    var i=1
    $('.not_element').remove()
    if (name=='Top 50 artisti'){
        $('.artist_line').remove()
        data.forEach(function(item){   
            $('.table_body').append(['<tr class="artist_line">',
                                        '<td>'+i+++'</td>',
                                        '<td></td>',
                                        '<td class="forIdArtist" style="display: none;">'+item._id+'</td>',
                                        '<td>'+item.name+'</td>',
                                        '<td>'+((item.genres[0]==null)? "Non presente" : getGenre(item.genres))+'</td>',
                                        '<td>'+item.followers+'</td>',
                                    '</tr>'].join('\n'))
        })
    }
    else if(name=='Generi'){
        $('.generi_line').remove()
        data.forEach(function(item){   
            $('.table_body').append(['<tr class="generi_line">',
                                        '<td>'+i+++'</td>',
                                        '<td></td>',
                                        '<td class="title_genre">'+item.title+'</td>',
                                        '<td>'+((item.artistsName==null)? "Non presenti" : getArtists(item.artistsName))+'</td>',
                                        '<td></td>',
                                    '</tr>'].join('\n'))
        })
    }
    else{
        $('.song_line').remove()
        data.forEach(function(item){
            $('.table_body').append(['<tr class="song_line">',
                                        '<td>'+i+++'</td>',
                                        '<td></td>',
                                        '<td class="forIdSong" style="display: none;">'+item._id+'</td>',
                                        '<td>'+item.name+'</td>',
                                        '<td class="artists">'+((item.artists[0]==null)? "Non presente" : getArtistsName(item.artists))+'</td>',
                                        '<td>'+millisToMinutesAndSeconds(item.duration_ms)+'</td>',
                                    '</tr>'].join('\n'))
        })
    }
}

function stringGenre(generi){
    var string=""
    if(generi[0]!=null){
        generi.forEach(function(gen){
            string+=gen+", "
        })
        string=string.substring(0, string.length-2)
    }
    else{
        string="Non presenti"
    }
    return string
}