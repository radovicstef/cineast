import React, {Component} from "react";

class MovieDetailsPoster extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <div>
                <img src={this.props.poster_path} style={{width: "100%"}}/>
            </div>
        )
    }
}

export default MovieDetailsPoster;