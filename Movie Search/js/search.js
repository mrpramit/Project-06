let TOPMOVIESAPIURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
let SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
var container = document.querySelector(".container");





async function fetchMovies(API) {
    var response = await fetch(API);
    var data = await response.json();
    showMovies(data.results)
}

fetchMovies(TOPMOVIESAPIURL)


function showMovies(movies) {
    container.innerHTML = ""
    for (let data of movies) {
        console.log(data)
        var path = "https://image.tmdb.org/t/p/w1280" + data.poster_path;
        var div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = ` <span class="rating">${data.vote_average} ⭐</span>
        <img height="350" width="100%" src=${path}
                alt="">
            <div class="overview">
                <h2>${data.title} (${data.release_date.substring(0, 4)})</h2>
                <p>
                    <b>Overview:</b>
                  ${data.overview}
                </p>

            </div>`
        console.log(div);

        container.appendChild(div)
    }
}


document.querySelector(".input-container input").addEventListener(
    "keyup",
    function (e) {
        var value = e.target.value;
        if (value == "") {
            fetchMovies(TOPMOVIESAPIURL)
        } else {
            fetchMovies(SEARCHAPI + value)
        }
    }
)

