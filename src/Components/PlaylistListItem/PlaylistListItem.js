import React from "react";
import '../TrackList/TrackList.css'

class PlaylistListItem extends React.Component {
    render() {
        return (
            <div className="TrackList">
                <div className="Track-information">
                    <h3 onClick={this.props.onSelect}>{this.props.names.name} </h3>
                </div>
                
            </div>
        )
    }
}

export default PlaylistListItem;