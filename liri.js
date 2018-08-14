// require .env file
require("dotenv").config();


var fs = require('fs');
// keys for twitter and spotify api
var keys = require("./keys.js");
var Twitter = require('twitter');
var client = new Twitter(keys.twitter);
var command = process.argv[2];
var input = JSON.stringify(process.argv[3]); 

// Switch statement to call functions
switch (command) {
  case 'my-tweets':
    getTweets();
    break;
  case 'spotify-this-song':
  	if (input === undefined){
  		input = 'The Sign (Ace of Base)';
  		spotifyThis();
  	}
    spotifyThis();
    break;
  case 'movie-this':
  	if (input === undefined){
  		input = 'Mr. Nobody';
  		movieSearch();
  	}
    movieSearch();
    break;
  case 'do-what-it-says':
  	doWhatItSays();
  	break;  
  default:
    console.log('Invalid Command');
};

// To get last 20 tweets and their creation date
function getTweets(){

		//Display last 20 Tweets
		var screenName = 'Alexandr_Bakilin';
		client.get('statuses/user_timeline', screenName, function(error, tweets, response){
			console.log(error);
			
		  if(!error){
			for(var i = 0; i<20; i++){
			  var date = tweets[i].created_at;
			  console.log("@AlexandrBakilin: " + tweets[i].text + " Created At: " + date.substring(0, 19));
			  console.log("-----------------------");
			  
			  //adds text to log.txt file
			  fs.appendFile('log.txt', "@AlexandrBakilin: " + tweets[i].text + " Created At: " + date.substring(0, 19));
			  fs.appendFile('log.txt', "-----------------------");
			}
		  }else{
			console.log('Error occurred');
		  }
		});
	  }


// To search Spotify for tracks
function spotifyThis(){
  var Spotify = require("node-spotify-api");
  var spotify = new Spotify(keys.spotify);

  spotify.search({ type: 'track', query: input}, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
	else {
    const trackData = data.tracks.items[0];
    console.log('Artist: ' + trackData.artists[0].name);
    console.log('Title: ' + trackData.name);
    console.log('Preview Link: ' + trackData.preview_url);
    console.log('Album: ' + trackData.album.name);            
    };
  });
}; //close spotifyThis

// To search OMDB for movies
function movieSearch(){
  var request = require("request");

  var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=b1f78fbd";

  request(queryUrl, function(error, response, body) {
  // console.log(body)
  	if (!error && response.statusCode === 200) {
		const parseBody = JSON.parse(body);
		console.log('Title: ' + parseBody.Title);
		console.log('Year: ' + parseBody.Year);
	    console.log('IMDB Rating: ' + parseBody.imdbRating);
	    console.log('Rotten Tomatoes Rating: ' + parseBody.Ratings[1].Value);	
	    console.log('Country: ' + parseBody.Country);
	    console.log('Language: ' + parseBody.Language);
	    console.log('Plot: ' + parseBody.Plot);
	    console.log('Actors: ' + parseBody.Actors);
    } 
  });
}; // close movieSearch  

// For node liri.js do-what-it-says
function doWhatItSays(){
var fs = require("fs");

  fs.readFile("random.txt", "utf8", function(error, data) {
  
  	if (error) {
      return console.log(error);
    } 
  	  var dataArr = data.split(",");  	
      command = dataArr[0];
      input = dataArr[1];

      switch (command) {
		case 'spotify-this-song':
			spotifyThis(input);
			break;
		case 'movie-this':
			movieSearch(input);
			break;
		default:
			console.log('Unable to execute command.');
	}  
  });
}; // close doWhatItSays
