$(document).ready(function(){

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

    $('.song_line').click(function(){
        var html=""
        var id= $(this).children('.forIdSong').text()
        var artists=$(this).children('.artists').text()
        $.ajax({
            type: 'POST',
            url:'/getSongInfo',
            async:false,
            data:{id: id},
            success: function(result){
                html="<b>Nome: </b>"+result.name+"</br><b>Artisti: </b>"+artists+"</br><b>Popolarità: </b>"+result.popularity
                +"%</br><b>Esplicita: </b>"+((result.explicit=="0")? "No" : "Si") +"</br><b>Data di rilascio: </b>"+result.release_date+"</br><b>Quanto è energica (0 a 1): </b>"
                +parseFloat(result.energy)+"</br><b>Quanto è dance (0 a 1): </b>"+parseFloat(result.danceability)+"</br><b>Quanto è strumentale (0 a 1): </b>"+parseFloat(result.instrumentalness)
            }
        })
        Swal.fire({
            icon: 'info', 
            title: 'Informazioni', 
            html: html,
            showCloseButton: true,
            confirmButtonText: 'Ok'
        })
    })

    $('.artist_line').click(function(){
        var id= $(this).children('.forIdArtist').text()
        var html=""
        $.ajax({
            type: 'POST',
            url:'/getArtistInfo',
            async:false,
            data:{id: id},
            success: function(result){
                html="<b>Nome: </b>"+result.name+"</br><b>"
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
            }
        })
        Swal.fire({
            icon: 'info', 
            title: 'Informazioni', 
            html: html,
            showCloseButton: true,
            confirmButtonText: 'Ok'
        })
    })
});
