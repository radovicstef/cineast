import React, { Component } from "react";
import MovieCardWrapperComponent from "../MovieCard/MovieCardWrapperComponent.jsx";
import explore from "../../../static/images/explore.jpg";

import processingGif from "../../../static/images/processing.gif";
import { IP_ADDR, PORT } from "../../constants.js";


class FavoritesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageReady: false,
      loading: true,
      favoriteMovies: [],
    };

    const image = new Image();
    image.onload = () => {
      this.setState(() => {
        return {
          imageReady: true,
        };
      });
    };
    image.src = processingGif;

    this.loadFavorites = this.loadFavorites.bind(this);
  }
  componentDidMount() {
    if (this.props.activeHeaderSection !== "favorites") {
      this.props.activateHeaderSection("favorites");
    }
    this.loadFavorites();
  }
  loadFavorites() {
    fetch(`http://${IP_ADDR}:${PORT}/api/favorites`)
      .then((reply) => reply.json())
      .then((data) => {
        console.log("FAVORITES");
        console.log(data);
        this.setState(() => {
          return { favoriteMovies: data, loading: false };
        });
      })
      .catch((error) => {
        this.setState(() => {
          return { loading: false };
        });
      });
  }
  componentWillUnmount() {
    if (this.props.activeHeaderSection !== undefined) {
      this.props.activateHeaderSection(undefined);
    }
  }
  render() {
    console.log("favoriteMovies: " + this.state.favoriteMovies);
    return (
      <div>
        <div className="container" style={{ minHeight: "90vh", paddingTop: "2.5rem" }}>
          {this.state.favoriteMovies.length !== 0 && (
            <div className="row" style={{ justifyContent: "space-between" }}>
              {this.state.favoriteMovies.map((movie, i) => {
                return (
                  <div className="col">
                    <MovieCardWrapperComponent
                      key={movie.movie_id}
                      loadFavorites={this.loadFavorites}
                      movie_id={movie.movie_id}
                    />
                  </div>
                );
              })}
              {this.state.favoriteMovies.length % 3 === 2 && (
                <div className="col"></div>
              )}
            </div>
          )}
          {this.state.loading && !this.state.imageReady && (
            <div style={{ width: "100%", height: "90%" }}></div>
          )}
          {this.state.loading && this.state.imageReady && (
            <div style={{ padding: "7rem" }}>
              <img
                src={processingGif}
                style={{ width: "20rem" }}
                alt="processing..."
              />
            </div>
          )}
          {this.state.favoriteMovies.length === 0 && !this.state.loading && (
            <div>
              <img style={{ marginTop: "3rem", width: "50%" }} src={explore} />
              <div className="start-searching" style={{ marginBottom: "3rem" }}>
                Start searching movies in explore section and add to
                favorites...
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default FavoritesComponent;
