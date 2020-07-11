$(document).ready(function(){

    var pathStartSearch = "https://api.themoviedb.org/3/search/movie?api_key=2e9106137e566a1c862c47d7251bb5fe&language=en-US&query=";
    var pathEndSearch = "&page=1&include_adult=false";

    var pathStartCast = "https://api.themoviedb.org/3/movie/";
    var pathEndCast = "/credits?api_key=2e9106137e566a1c862c47d7251bb5fe";

    var pathStartTrailer = "https://api.themoviedb.org/3/movie/";
    var pathEndTrailer = "/videos?api_key=2e9106137e566a1c862c47d7251bb5fe&language=en-US";

    $("#movie-table").hide();

    $("#search-movie").submit(function(e){
        e.preventDefault(); // Prevent form from redirection
        let searchMovie = pathStartSearch + $("#search-box").val() + pathEndSearch;

        // Search Movie API
        $.ajax({
            method: "GET",
            url: searchMovie,
            dataType: "json",
            success: function(result){

                if (result.total_pages == 0){
                    movieNotFound();
                }
                else {
                    movieFound(result);
                }
            },

            error: function(){ // Just incase there is an error with the API
                $("#movie-table").hide();
                $("#movie-img-results").html("");
                $("#movie-text-results").html("");
                $("#movie-title").html("");
                $("#movie-trailer").html("");
                $("#text-error").html("ERROR: Please Enter a Movie Title");
                $("#text-error").css("color", "red");
            }

        });
    });

    function movieFound(result){
        $("#text-error").html("");
        let imgPath = "https://image.tmdb.org/t/p/original" + result.results[0].poster_path;
        let description = result.results[0].overview;
        let movieId = result.results[0].id;
        let searchCast = pathStartCast + movieId + pathEndCast;
        let searchTrailer = pathStartTrailer + movieId + pathEndTrailer;

        $("#movie-table").show();

        // Movie Image
        $("#movie-img-results").html("<img class='img-fluid' src='" + imgPath + "' alt='movie image'>");

        // Movie Description
        $("#summary").html("Summary:");
        $("#movie-text-results").html(description);
        // $("#movie-text-results").html("<h5>" + description + "</h5>");

        // Movie Title
        $("#movie-title").html(result.results[0].title);

        // Release Date
        $("#release-date").html(result.results[0].release_date);
        $("#release-date-title").html("Release Date:");

        // Get Cast From API
        $.ajax({
            method: "GET",
            url: searchCast,
            dataType: "json",
            success: function(result){

                if (result){
                    displayCast(result);
                }

            },
        });

        // Get trailer From API
        $.ajax({
            method: "GET",
            url: searchTrailer,
            dataType: "json",
            success: function(result){

                if (result){
                    displayTrailer(result);
                }

            },
        });

    }

    function movieNotFound(){
        $("#movie-table").hide();
        $("#text-error").html("Movie was not found");
        $("#text-error").css("color", "red");
        $("#movie-img-results").html("");
        $("#movie-text-results").html("");
        $("#movie-title").html("");
        $("#movie-trailer").html("");
    }

    function displayCast(result){
        $("#cast-title").html("Cast:");
        $("#cast").html("");
        for (let i = 0; i < 3; i++){
            if (i == 2){
                $("#cast").append(result.cast[i].name);
            }
            else {
                $("#cast").append(result.cast[i].name + ", ");
            }
            
        }
    }

    function displayTrailer(result){
        $("#movie-trailer").html("<iframe class='embed-responsive-item' src='https://www.youtube.com/embed/" + result.results[0].key + "'" +
            " frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"
        );
    }

})

