// The API keys
const clientId  ='';
const redireUri ='http://localhost:3001/';
let accessToken;
let userId;
let playlistId;

const Spotify = {
    
    getAccessToken() {
        if(accessToken){
            return accessToken;
        }


        //check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
        
            //clears the params to avoid access after expiration

            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/')
            return accessToken;
        }
        else {
            const accessUrl = `https://accounts.spotify.com/authorize?
            client_id=${clientId}&response_type=token&
            scope=playlist-modify-public&redirect_uri=${redireUri}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
        ).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artists: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
    },

    savePlayList(name, trackUris, id ) {
        if (!name || !trackUris.length) {
            return;
        }
        if(id) {
            
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId} `)
            .then(response => response.json())
            .then(jsonResponse => {
                name = jsonResponse.name
            })
        
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`}
        

        return fetch(`https://api.spotify.com/v1/me`, {headers: headers})
        .then(response => response.json())
        .then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {headers: headers,
            method: `POST`,
            body: JSON.stringify({name: name})
         }).then(response => response.json())
         .then(jsonResponse => {
             playlistId = jsonResponse.id;
             return fetch(`https://api.spotify.com/v1/users/${userId}/
             playlists/${playlistId}/tracks`, {
                 headers: headers,
                method: `POST`,
                body: JSON.stringify({uris: trackUris})
            })
         })
            });
    },

    getUserPlaylists() {

        if(userId) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`}

        return fetch(`https://api.spotify.com/v1/me`, {headers: headers})
        .then(response => response.json())
        .then(jsonResponse => {
            userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`)
        .then(response => response.json())
        .then(jsonResponse => {
            return jsonResponse.items.map(playlist => ({
                playlistId : playlist.id,
                name: playlist.name,
            }))
        })
    })
    },

    getCurrentUserId() {
        
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`}

        return fetch(`https://api.spotify.com/v1/me`, {headers: headers})
        .then(response => response.json())
        .then(jsonResponse => {
            userId = jsonResponse.id; })
    },

    getPlaylist(id) {
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${id}/tracks`)
        .then(response => response.json())
        .then(jsonResponse => jsonResponse.id)
    }
 }

export default Spotify;