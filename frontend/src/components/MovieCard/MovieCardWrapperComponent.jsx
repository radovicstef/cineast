import React, { Component } from "react";
import { IP_ADDR, PORT } from "../../constants.js";
import MovieCardComponent from "./MovieCardComponent.jsx";

class MovieCardWrapperComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie_info: undefined,
    };
  }
  componentDidMount() {
    fetch(`http://${IP_ADDR}:${PORT}/api/movie_overview/${this.props.movie_id}/`)
      .then((reply) => reply.json())
      .then((data) => {
        this.setState(() => {
          return { movie_info: data };
        });
      });
  }
  render() {
    return (
      <>
        {this.state.movie_info !== undefined && (
          <div>
            <MovieCardComponent
              loadFavorites={this.props.loadFavorites}
              loadMovies={this.props.loadMovies}
              pageNumber={this.props.pageNumber}
              key={this.props.movie_id}
              title={this.state.movie_info.title}
              poster_path={this.state.movie_info.poster_path}
              rating={this.state.movie_info.rating}
              genres={this.state.movie_info.genres.slice(0, 2)}
              year={this.state.movie_info.year}
              overview={this.state.movie_info.overview}
              id={this.props.movie_id}
            />
          </div>
        )}
      </>
    );
  }
}

export default MovieCardWrapperComponent;
