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
});