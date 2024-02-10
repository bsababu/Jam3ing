// The API keys
const clientId  ='5ee0f028e33d4143968be50823b7f544';
const redireUri ='http://localhost:3001/';
let accessToken='BQAJhbhkDDASBgGm8n-7n8aLYWm0Y3_kimlVu9UTIdNgASsD-2x8IEg-zy6JV6-9QFiO8g9GZ0O7P48N7qRHRl7TAKrq0tWcIDFGB6hP2q5IUd1CXQM"';
let userId='6hjijyo5x3gjh9m40u5zgbvsi';
//userId='';
let playlistId;

const Spotify = {
    
    getAccessToken() {
        if(accessToken){
            return accessToken;
        }
        // const clientId  ='5ee0f028e33d4143968be50823b7f544';

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
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redireUri}`;
            window.location = accessUrl;
        }
    },

    async search(term) {
        const accessToken = Spotify.getAccessToken();
        const response = fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
            return [];
        }
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artists: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    },

    async savePlayList(name, trackUris, id ) {
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
        .then(async jsonResponse => {
            //userId = jsonResponse.id;
            userId='6hjijyo5x3gjh9m40u5zgbvsi';
            const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    headers: headers,
                    method: `POST`,
                    body: JSON.stringify({ name: name })
                });
            const jsonResponse_1 = await response.json();
            playlistId = jsonResponse_1.id;
            return await fetch(`https://api.spotify.com/v1/users/${userId}/
             playlists/${playlistId}/tracks`, {
                headers: headers,
                method: `POST`,
                body: JSON.stringify({ uris: trackUris })
            });
            });
    },

    async getUserPlaylists() {

        if(userId) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`}

        return fetch(`https://api.spotify.com/v1/me`, {headers: headers})
        .then(response => response.json())
        .then(jsonResponse => {
            //userId = jsonResponse.id;
            userId='6hjijyo5x3gjh9m40u5zgbvsi';
        const response = fetch(`https://api.spotify.com/v1/users/${userId}/playlists`);
            const jsonResponse_1 = response.json();
            return jsonResponse_1.items.map(playlist => ({
                playlistId: playlist.id,
                name: playlist.name
            }));
    })
    },

    async getCurrentUserId() {
        
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`}

        const response = await fetch(`https://api.spotify.com/v1/me`, { headers: headers });
        const jsonResponse = await response.json();
        // userId = jsonResponse.id;

        userId='6hjijyo5x3gjh9m40u5zgbvsi';
    },

    async getPlaylist(id) {
        const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${id}/tracks`);
        const jsonResponse = await response.json();
        return jsonResponse.id;
    }
 }

export default Spotify;