const express    = require('express'),
      bodyParser = require('body-parser'),
      axios      = require('axios'),
      keys       = require('./config/keys');

const app = express();

/**
 * parse application/x-www-form-urlencoded
 */
app.use(bodyParser.urlencoded({ extended: false }));
/**
 * parse application/json
 */ 
app.use(bodyParser.json());

/**
 * middleware request spotify access token
 */
const getSpotifyAccessToken = async (req, res, next) => {
    const accessToken = await axios({
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': `Basic ${keys.spotifyEncoded}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=client_credentials'
    }).catch(error => {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
    })

    req.authorization = accessToken.data.access_token    

    next();
};

/**
 * Perform a query towards spotify server
 * 
 * @param String type filter for search i.e track,album,artist
 * @param String q    search query 
 */
app.get('/search/:type/:q', [getSpotifyAccessToken], async (req, res) => {
    let type = req.params.type,
        query = req.params.q;       
    
    const spotifyResponse = await axios({
        method: 'GET',
        url: `https://api.spotify.com/v1/search?q=${query}&type=${type}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${req.authorization}`
        }
    }).catch(error => {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else if (error.request) {
            console.log(error.request);            
        } else {
            console.log('Error', error.message)
        }
    });    

    res.json(spotifyResponse.data);
});

const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));