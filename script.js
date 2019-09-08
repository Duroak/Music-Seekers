const musicApi="195003";
const musicUrl="theaudiodb.com/api/v1/json/" + musicApi + "/search.php";
const youtubeApi="AIzaSyCzRVlhRJlpk8YC4JeE555PJAfpeiMHM9U";
const youtubeUrl="https://www.googleapis.com/youtube/v3/search";

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayresults(responseJson) {
    console.log(responseJson);
    $('#js-artist-results').empty();
    for (let i=0; i < responseJson.artists.length; i++) {
        $('#js-artist-results').append(
            `<h1>${responseJson.artists[i].strArtist}<h1>
            <img src="${responseJson.artists[i].strArtistThumb}">
            <p>${responseJson.artists[i].strBiographyEN}</p>`
        )};
    $('#js-results-page').removeClass('hidden');
} 

function getArtist(query) {
    const params = {
        s: query,  
    };
    const queryString = formatQueryParams(params)
    const url = musicUrl + '?' + queryString;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayresults(responseJson))
        .catch(err => {
            $('#js-error-msg').text(`Something went wrong: ${err.message}`); 
        });
}

//function getYoutubeVideo(params) {}

function submitform() {
    $('form').submit(event => {
        event.preventDefault();
        const searchArtist = $('#js-search-artist').val();
        getArtist(searchArtist);
    });
}

$(submitform);