// dependencies
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
var unirest = require("unirest");
let errorResposne = {
    results: []
};
var port = process.env.PORT || 8080;
// create serve and configure it.
const server = express();
server.use(bodyParser.json());
server.post('/getMovies', function (request, response) {
    console.log(request);
    if (request.body && request.body.result) {
        if (request.body.result.parameters['top-rated']) {
            var req = unirest("GET", "https://api.themoviedb.org/3/movie/top_rated");
            req.query({
                "page": "1",
                "language": "en-US",
                "api_key": "3b4419b59edd5853e4186bc447541b0e"
            });
            req.send("{}");
            req.end(function (res) {
                if (res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech": "Error. Can you try it again ? ",
                        "displayText": "Error. Can you try it again ? "
                    }));
                } else if (res.body.results.length > 0) {
                    let result = res.body.results;
                    let output = '';
                    for (let i = 0; i < result.length; i++) {
                        output += result[i].title;
                        output += "\n"
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech": output,
                        "displayText": output
                    }));
                }
            });
        } else if (request.body.result.parameters['movie-name']) {
            //   console.log('popular-movies param found');
            let movie = request.body.result.parameters['movie-name'];
            var req = unirest("GET", "https://api.themoviedb.org/3/search/movie");
            req.query({
                "include_adult": "false",
                "page": "1",
                "query": movie,
                "language": "en-US",
                "api_key": ""
            });
            req.send("{}");
            req.end(function (res) {
                if (res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech": "Error. Can you try it again ? ",
                        "displayText": "Error. Can you try it again ? "
                    }));
                } else if (res.body.results.length > 0) {
                    let result = res.body.results[0];
                    let output = "Average Rating : " + result.vote_average +
                        "\n Plot : " + result.overview + "url" + result.poster_path
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech": output,
                        "displayText": output
                    }));
                } else {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech": "Couldn't find any deatails. :(  ",
                        "displayText": "Couldn't find any deatails. :(  "
                    }));
                }
            });

        } else if (request.body.result.parameters['popular-movies']) {
            var req = unirest("GET", "https://api.themoviedb.org/3/movie/popular");
            req.query({
                "page": "1",
                "language": "en-US",
                "api_key": ""
            });
            req.send("{}");
            req.end(function (res) {
                if (res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech": "Error. Can you try it again ? ",
                        "displayText": "Error. Can you try it again ? "
                    }));
                } else {
                    let result = res.body.results;
                    let output = '';
                    for (let i = 0; i < result.length; i++) {
                        output += result[i].title;
                        output += "\n"
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech": output,
                        "displayText": output
                    }));
                }
            });
        }
    } else {
        var req = unirest("GET", "https://api.themoviedb.org/3/movie/top_rated");
        req.query({
            "page": "1",
            "language": "en-US",
            "api_key": "3b4419b59edd5853e4186bc447541b0e"
        });
        req.send("{}");
        req.end(function (res) {
            if (res.error) {
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify({
                    "speech": "Error. Can you try it again ? ",
                    "displayText": "Error. Can you try it again ? "
                }));
            } else if (res.body.results.length > 0) {
                let result = res.body.results;
                let output = '';
                for (let i = 0; i < result.length; i++) {
                    output += result[i].title;
                    output += "\n"
                }
                response.setHeader('Content-Type', 'application/json');
                response.send(JSON.stringify(/*{
                    "speech": output,
                    "displayText": output
                }*//*{
                    "payload": {
                        "google": {
                            "expectUserResponse": true,
                            "richResponse": {
                                "items": [
                                    {
                                        "simpleResponse": {
                                            "textToSpeech": "Howdy! I can tell you fun facts about almost any number."
                                        }
                                    },
                                    {
                                        "simpleResponse": {
                                            "textToSpeech": "What number do you have in mind?"
                                        }
                                    }
                                ],
                                "suggestions": [
                                    {
                                        "title": "25"
                                    },
                                    {
                                        "title": "45"
                                    },
                                    {
                                        "title": "Never mind"
                                    }
                                ],
                                "linkOutSuggestion": {
                                    "destinationName": "Website",
                                    "url": "https://assistant.google.com"
                                }
                            }
                        }
                    }
                }*/
                    {
                        "payload": {
                            "slack": {
                                "text": "This is a mrkdwn section block :ghost: *this is bold*, and ~this is crossed out~, and <https://google.com|this is a link>"
                            }

                        }
                    }));
            }
        });
    }
});
server.get('/getName', function (req, res) {
    res.send('Swarup Bam');
});
server.listen(port, function () {
    console.log("Server is up and running...");
});
