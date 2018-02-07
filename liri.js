//look to my .env file in order to know my personal keys
require("dotenv").config();

// Load the fs package to read and write as well as NPM files
var fs = require("fs");
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

//pull in keys from environmental variables file (other user's will have to create their own unqiue .env file w/ their own key info for features to work)
var importKeys = require('./keys');
var spotifyKey = new Spotify(importKeys.spotify);
var twitterKey = new Twitter(importKeys.twitter);

//Limits Twitter callback function to show max of 20 Tweets
var tweetLimit = 20;

// user input (need to add prompt)
var userInput = process.argv[2];

/*describe various commands available to user when they run NodeJS (via terminal);
NOTE: refer to functions below which will describe in detail what is happening in each 'case' */
// console will listen in order to run one of these cases based on user's input
    switch(userInput) {
        case 'my-tweets':
            console.log('my tweets');
            myTweets();
            break;

        case 'spotify-this-song':
            console.log('spotify my song');
            spotifyRequest();
            break;

        case 'movie-this':
            console.log('OMDB my movie');
            omdbRequest();
            break;

        case 'do-what-i-say':
            console.log('obey my command');
            break;

        default :
            console.log('Sorry, that is not an input I recognize. Please try one of the following inputs, instead: '
            + '\r\n' + '1) "my-tweets" to read latest tweets from the linked account'
            + '\r\n' + '2) "spotify-this-song" + a song name or lyric'
            + '\r\n' + '3) "movie-this" + a film title (the latter should be in quotes or part might get cut off)'
            + '\r\n' + '4) "do-what-i-say"');
        }

//describe each of callback functions that will execute when aforementioned commands are run

    //Twitter API (show last 20 tweets. I need to make more...)
    function myTweets () {
      var params = {screen_name: 'LiriNodeTweets', count: tweetLimit};
      twitterKey.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
          console.log(error);
          }
        else if (!error) {
          console.log("\nThese are your last " + (tweets.length) + " tweets: \n");
          for (var i = 0; i < tweets.length; i++) {
            console.log("Tweet # " + (i+1) + ": " + "\n" + tweets[i].text +
            "\n" + "Created on: " + tweets[i].created_at);
            console.log("--------------------");
          }
        }
      });
    }



    // Spotify API
      function spotifyRequest() {
          var songRequest = process.argv[3];

            spotifyKey.search({
                type: 'track',
                query: songRequest,
                limit: 5
              },

          function(err, data) {
              if (err) {
                return console.log('error: ' + err);
              }

          //   console.log(JSON.stringify(data));
          //   console.log(data.tracks.items[0].artists);
            for (let i = 0; i < 5; i++) {
                //https://developer.spotify.com/web-api/object-model/
                var songData = data.tracks.items;
                  //var songUrl = songData[i].preview_url;
                var artistName = songData[i].album.artists[0].name;
                var albumTitle = songData[i].album.name;
                var songUrl = '';

             if (songUrl === null) {
                 songUrl = 'no preview found :-(';
             }
             else {
                 console.log('--------------------------');
                 console.log(`Artist Name: ${artistName}`);
                 console.log(`Album Title: ${albumTitle}`);
                 //have to assign preview before loggin it
                 songUrl = songData[i].preview_url;

                 console.log(`Preview URL: ${songUrl}`);


                  }
            }

            });


      }

    // OMDB API
      function omdbRequest() {
          var omdbRequest = require("request");
          var movieTitle = process.argv[3];
          //apply for and switch out personal key when I get the chance; use bootcamp's for now
          var omdbApiKey = 'trilogy';
          var fullRequest = `http://www.omdbapi.com/?t=${movieTitle}&y=&plot=short&apikey=${omdbApiKey}`;

          omdbRequest(fullRequest, function(error, response, body) {
          // If the request is successful (i.e. if response status code equals 200)
          if (!error && response.statusCode === 200) {
            // possible properties to reference: https://github.com/misterhat/omdb/blob/master/index.js#L237
              console.log("Title: " +JSON.parse(body).Title
              + "\n " + "Genre(s): " +JSON.parse(body).Genre
              + "\n " + "Year Released: " + JSON.parse(body).Released
              + "\n " + "Maturity Rating: " + JSON.parse(body).Rated
              + "\n " + "Original Language: " + JSON.parse(body).Language
              + "\n " + "Actors: " + JSON.parse(body).Actors
              + "\n " + "Plot Summary: " + JSON.parse(body).Plot
              );
          }
          });
      }
