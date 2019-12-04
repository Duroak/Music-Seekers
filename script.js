const musicApi="1"; // not the real api key
const musicUrl="https://theaudiodb.com/api/v1/json/" + musicApi + "/search.php";
const youtubeApi="AIzaSyD2I3yBkdDXs1k4WTLiNSlyMm85yebB5Nc"; //not the real api key
const youtubeUrl="https://www.googleapis.com/youtube/v3/search";

function formatQueryParams(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//displays in the artist results section of the html the title,
//the thumbnail, and the Biography
function displayArtists(responseJson) {
    console.log(responseJson);
    $('#js-artist-results').empty();
    for (let i=0; i < responseJson.artists.length; i++) {
        $('#js-artist-results').append(
            `<p id="name">${responseJson.artists[i].strArtist}<p>
            <img src="${responseJson.artists[i].strArtistThumb}">
            <p>${responseJson.artists[i].strBiographyEN}</p>`
        )};
    $('#js-results-page').removeClass('hidden');
} 

//displays the response from youtube api (the videos) in a list
//unorder list that also includes a title for the video 
function displayYoutube(responseJson) {
    console.log(responseJson);
    $('#js-videos').empty();
    for (let i=0; i < responseJson.items.length; i++) {
        $('#js-videos').append(
            `<li><iframe id="ytplayer" type="text/html" width="640" height="360"
            src="https://www.youtube-nocookie.com/embed/${responseJson.items[i].id.videoId}?autoplay=0 frameborder="0" allowfullscreen></iframe><li>`            
        )};   
}

//fetching the artist Picture and description
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
            $('#js-error-msg').text(`Artist description not found check spelling`); 
        });
}

//fetching the arist videos from youtube api
function getYoutubeVideo(query) {
    const params = {
        key: youtubeApi,
        part: 'snippet', 
        q: query,
        type: 'videos', 
        maxResults: '6'
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
            $('#js-error-msg').text(`Youtube video not found`);
        }); 
}

function scroll() {
    $('html, body').animate({
        scrollTop: $("#js-results-page").offset().top
    }, 1000);

}

//searching the name of artist or group and scrolls to the section of artist bio
function submitform() {
    $('form').on('submit', function() {
        event.preventDefault();
        const searchArtist = $('#js-search-artist').val();
        getArtist(searchArtist);
        getYoutubeVideo(searchArtist);
        $('#js-error-msg').empty();
        scroll();
    });
}

$(submitform);