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
                    confirmButtonText: 'Ok'
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
                    confirmButtonText: 'Ok'
                })
            }
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
                            $('.table_body').append('<h2 class="not_element">Nessun artista trovato</h2>')
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
                            i++
                        })
                    }
                }
            })
        }
    })

    $('.search_song').on('input', function(){
        var val= $(this).val()
        if (val.length==0){
            $('.artist_line').remove()
            startPage(pageName, pageData)
        }
        else{
            $.ajax({
                type: 'POST',
                url:'/searchSongs',
                data:{val: val},
                success: function(result){
                    console.log(result)
                    $('.song_line').remove()
                    $('.not_element').remove()

                    if(result.length==0){
                        if($('.not_element').length==0){
                            $('.table_body').append('<h2 class="not_element">Nessuna canzone trovata</h2>')
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
                            i++
                        })
                    }
                }
            })
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


function startPage(name, data){
    var i=1
    if (name=='Top 50 artisti'){
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
    else{
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