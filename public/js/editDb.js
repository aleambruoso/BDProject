$(document).ready(function(){
    $('.addArtist').on('click', function(){
        Swal.fire({ 
            title: 'Aggiungi artista', 
            text: 'Inserisci il nome dell\'artista',
            input: 'text',
            inputPlaceholder: 'Nome artista...',
            backdrop: true,
            showCloseButton: true,
            confirmButtonText: 'Avanti <i class="fa fa-arrow-right"></i>',
            showLoaderOnConfirm: true,
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
                var artistName= result.value
                Swal.fire({ 
                    title: 'Aggiungi artista', 
                    text: 'Inserisci il numero di followers',
                    input: 'text',
                    inputPlaceholder: 'numero followers...',
                    backdrop: true,
                    showCloseButton: true,
                    confirmButtonText: 'Avanti <i class="fa fa-arrow-right"></i>',
                    showLoaderOnConfirm: true,
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
                        var artistFollowers= result.value
                        Swal.fire({ 
                            title: 'Aggiungi artista', 
                            text: 'Inserisci la popolarità dell\'artista',
                            input: 'text',
                            inputPlaceholder: 'popolarità da 0 a 100...',
                            backdrop: true,
                            showCloseButton: true,
                            confirmButtonText: 'Avanti <i class="fa fa-arrow-right"></i>',
                            showLoaderOnConfirm: true,
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
                                var artistPopularity= result.value
                                Swal.fire({ 
                                    title: 'Aggiungi artista', 
                                    text: 'Inserisci i generi dell\'artista (scrivere "Non presenti" nel caso non ci siano)',
                                    input: 'text',
                                    inputPlaceholder: 'Generi (separa con una virgola)...',
                                    backdrop: true,
                                    showCloseButton: true,
                                    confirmButtonText: 'Avanti <i class="fa fa-arrow-right"></i>',
                                    showLoaderOnConfirm: true,
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
                                            var artistGenres="[]"
                                        }
                                        else{
                                            var generi= result.value.split(',')
                                            var artistGenres="["
                                            generi.forEach(function(elem){
                                                elem.trim()
                                                artistGenres+="'"+elem+"'"
                                                artistGenres+=", "
                                            })
                                            artistGenres= artistGenres.substr(0, artistGenres.length-2)
                                            artistGenres+="]"
                                        }
                                        var artist={name: artistName, popularity: artistPopularity, followers: artistFollowers, genres: artistGenres}
                                        $.ajax({
                                            type: 'POST',
                                            url:'/saveArtist',
                                            data:{artist: artist},
                                            success: function(result){
                                                Swal.fire({
                                                    icon: 'success', 
                                                    title: 'Artista salvato', 
                                                    text: 'L\'artista è stato salvato con successo.',
                                                    showCloseButton: true,
                                                    confirmButtonText: 'Ok'
                                                })
                                                .then(function(result){
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
    })


})