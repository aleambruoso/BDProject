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
        Swal.fire({
            icon: 'info', 
            title: 'Informazioni', 
            html: '<b>Strumentalness:0.5<br>Popularity:8<br>foll:500</b>',
            showCloseButton: true,
            confirmButtonText: 'Ok'
        })
    })
});
