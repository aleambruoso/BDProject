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




    $('.addSong').on('click', function(){
        Swal.fire({ 
            title: 'Aggiungi brano', 
            text: 'Inserisci il nome del brano',
            input: 'text',
            inputPlaceholder: 'Nome brano...',
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
                var track={}
                track.name= result.value
                Swal.fire({ 
                    title: 'Aggiungi brano', 
                    text: 'Inserisci la popolarità del brano (da 0 a 100)',
                    input: 'text',
                    inputPlaceholder: 'popolarità brano...',
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
                        track.popularity= result.value
                        Swal.fire({ 
                            title: 'Aggiungi brano', 
                            text: 'Inserisci la durata del brano in millisecondi',
                            input: 'text',
                            inputPlaceholder: 'durata brano in ms...',
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
                                track.duration_ms= result.value 
                                Swal.fire({ 
                                    title: 'Aggiungi brano', 
                                    text: 'Il brano è esplicito? (0-no 1-si)',
                                    input: 'text',
                                    inputPlaceholder: 'esplicito (0 o 1)...',
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
                                        else if(item!=0 && item!=1){
                                            Swal.showValidationMessage(
                                                'Il valore deve essere o 0 o 1'
                                            )
                                        }
                                    },
                                    allowOutsideClick: () => !Swal.isLoading()
                                }).then(function(result){
                                    if(result.isConfirmed){
                                        track.explicit= result.value
                                        Swal.fire({
                                            title: 'Aggiungi brano',
                                            html: '<p>Inserisci la data di rilascio del brano</p></br><input class="swal2-input" id="expiry-date">',
                                            backdrop: true,
                                            showCloseButton: true,
                                            confirmButtonText: 'Avanti <i class="fa fa-arrow-right"></i>',
                                            showLoaderOnConfirm: true,
                                            preConfirm: () => {
                                              if (flatpickrInstance.selectedDates[0] > new Date()) {
                                                Swal.showValidationMessage('La data di uscita non può essere nel futuro')
                                              }
                                            },
                                            willOpen: () => {
                                              flatpickrInstance = flatpickr(
                                                Swal.getPopup().querySelector('#expiry-date')
                                              )
                                            }
                                        }).then(function(result){
                                            if(result.isConfirmed){
                                                track.release_date= new Date(flatpickrInstance.selectedDates[0].getTime()- (flatpickrInstance.selectedDates[0].getTimezoneOffset()*60*1000)).toISOString().split('T')[0]
                                                Swal.fire({ 
                                                    title: 'Aggiungi brano', 
                                                    text: 'Inserisci quanto il brano sia dance (da 0 a 1)',
                                                    input: 'range',
                                                    inputAttributes: {
                                                        min: 0,
                                                        max: 1,
                                                        step: 0.01
                                                    },
                                                    inputValue: 0,
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
                                                        else if(item<0 || item>1){
                                                            Swal.showValidationMessage(
                                                                'Il valore deve essere compreso tra 0 e 1'
                                                            )
                                                        }
                                                    },
                                                    allowOutsideClick: () => !Swal.isLoading()
                                                }).then(function(result){
                                                    if(result.isConfirmed){
                                                        track.danceability= result.value 
                                                        Swal.fire({ 
                                                            title: 'Aggiungi brano', 
                                                            text: 'Inserisci quanto il brano sia energico (da 0 a 1)',
                                                            input: 'range',
                                                            inputAttributes: {
                                                                min: 0,
                                                                max: 1,
                                                                step: 0.01
                                                            },
                                                            inputValue: 0,
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
                                                                else if(item<0 || item>1){
                                                                    Swal.showValidationMessage(
                                                                        'Il valore deve essere compreso tra 0 e 1'
                                                                    )
                                                                }
                                                            },
                                                            allowOutsideClick: () => !Swal.isLoading()
                                                        }).then(function(result){
                                                            if(result.isConfirmed){
                                                                track.energy= result.value 
                                                                Swal.fire({ 
                                                                    title: 'Aggiungi brano', 
                                                                    text: 'Inserisci quanto il brano sia strumentale (da 0 a 1)',
                                                                    input: 'range',
                                                                    inputAttributes: {
                                                                        min: 0,
                                                                        max: 1,
                                                                        step: 0.01
                                                                    },
                                                                    inputValue: 0,
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
                                                                        else if(item<0 || item>1){
                                                                            Swal.showValidationMessage(
                                                                                'Il valore deve essere compreso tra 0 e 1'
                                                                            )
                                                                        }
                                                                    },
                                                                    allowOutsideClick: () => !Swal.isLoading()
                                                                }).then(function(result){
                                                                    if(result.isConfirmed){
                                                                        track.instrumentalness= result.value 
                                                                        var ids=[]
                                                                        Swal.fire({ 
                                                                            title: 'Aggiungi brano', 
                                                                            text: 'Inserisci gli artisti del brano (scrivere "Non presenti" nel caso non ci siano)',
                                                                            input: 'text',
                                                                            inputPlaceholder: 'Artisti (separa con una virgola)...',
                                                                            backdrop: true,
                                                                            showCloseButton: true,
                                                                            confirmButtonText: 'Avanti <i class="fa fa-arrow-right"></i>',
                                                                            showLoaderOnConfirm: true,
                                                                            preConfirm: function(item){
                                                                                return new Promise(function(resolve, reject){
                                                                                    ids=[]
                                                                                    if(item==""){
                                                                                        Swal.showValidationMessage(
                                                                                            'Il campo non può essere vuoto'
                                                                                        )
                                                                                    }
                                                                                    if(item!="Non presenti"){
                                                                                        var artisti= item.split(',')
                                                                                        $.ajax({
                                                                                            type: 'POST',
                                                                                            url:'/getArtistId',
                                                                                            data:{name: artisti},
                                                                                            success: function(result){
                                                                                                var i=0
                                                                                                result.forEach(function(elem){
                                                                                                    elem.trim()
                                                                                                    if(elem=="No"){
                                                                                                        Swal.showValidationMessage(
                                                                                                            'Impossibile trovare l\'artista '+artisti[i]
                                                                                                        )
                                                                                                    }
                                                                                                    else{
                                                                                                        ids.push(elem)
                                                                                                    }
                                                                                                    i++
                                                                                                })
                                                                                                resolve()
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                })
                                                                            },
                                                                            allowOutsideClick: () => !Swal.isLoading()
                                                                        }).then(function(result){
                                                                            if(result.isConfirmed){
                                                                                if(ids.length==0){
                                                                                    var trackArtists="[]"
                                                                                }
                                                                                else{
                                                                                    var trackArtists="["
                                                                                    ids.forEach(function(elem){
                                                                                        elem.trim()
                                                                                        trackArtists+="'"+elem+"'"
                                                                                        trackArtists+=", "
                                                                                    })
                                                                                    trackArtists= trackArtists.substr(0, trackArtists.length-2)
                                                                                    trackArtists+="]"
                                                                                }
                                                                                track.id_artists=trackArtists
                                                                                $.ajax({
                                                                                    type: 'POST',
                                                                                    url:'/saveTrack',
                                                                                    data:{track: track},
                                                                                    success: function(result){
                                                                                        Swal.fire({
                                                                                            icon: 'success', 
                                                                                            title: 'Brano salvato', 
                                                                                            text: 'Il brano è stato salvato con successo.',
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