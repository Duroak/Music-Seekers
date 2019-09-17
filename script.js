const musicApi="1"; // not the real api key
const musicUrl="https://theaudiodb.com/api/v1/json/" + musicApi + "/search.php";
const youtubeApi="AIzaSyD2I3yBkdDXs1k4WTLiNSlyMm85yebB5Nc"; //not the real api key
const youtubeUrl="https://www.googleapis.com/youtube/v3/search";

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayArtists(responseJson) {
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

function displayYoutube(responseJson) {
    console.log(responseJson);
    $('#js-videos').empty();
    for (let i=0; i < responseJson.items.length; i++) {
        $('#js-videos').append(
            `<li><h3>${responseJson.items[i].snippet.title}</h3>
            <iframe id="ytplayer" type="text/html" width="640" height="360"
            src="https://www.youtube-nocookie.com/embed/${responseJson.items[i].id.videoId}?autoplay=0 frameborder="0"></iframe><li>`            
        )};   
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
        .then(responseJson => displayArtists(responseJson))
        .catch(err => {
            $('#js-error-msg').text(`Something went wrong with artist search: ${err.message}`); 
        });
}

function getYoutubeVideo(query) {
    const params = {
        key: youtubeApi,
        part: 'snippet', 
        q: query,
        type: 'videos', 
        maxResult: '4'
    }

    const queryString2 = formatQueryParams(params)
    const url2 = youtubeUrl + '?' + queryString2
    
    fetch(url2)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayYoutube(responseJson))
        .catch(err => {
            $('#js-error-msg').text(`Something went wrong with youtube search: ${err.message}`);
        }); 
}

function submitform() {
    $('form').submit(event => {
        event.preventDefault();
        const searchArtist = $('#js-search-artist').val();
        getArtist(searchArtist);
        getYoutubeVideo(searchArtist);
        $('#js-error-msg').empty();
    });
}

$(submitform);