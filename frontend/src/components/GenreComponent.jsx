import React, { Component } from "react";

class GenreComponent extends Component {
    render() {
        return(
            <div className="badge bg-secondary" style={{margin: "0.2rem", padding: "0.5rem", fontSize: "0.7rem", display: "inline-block"}}>
                {this.props.genre}
            </div>
        );
    }
}

export default GenreComponent;
