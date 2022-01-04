import React from "react";
import Spotify from "../../util/Spotify";
import '../Playlist/Playlist.css';
import PlaylistListItem from "../PlaylistListItem/PlaylistListItem";

class PlaylistList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            PlaylistLists: [Spotify.getUserPlaylists],
        }
    }
    componentWillMount() {
        Spotify.getUserPlaylists();
    }
    render() {
        return (
            <div className="Playlist">
                <label>MY playlists</label>
                {this.state.playlistLists.map(names => {
                    return <PlaylistListItem names={names} key={names.id} onSelect={this.props.selectedPlaylist}/>
                })}
            </div>
        );
    }
}

export default PlaylistList;