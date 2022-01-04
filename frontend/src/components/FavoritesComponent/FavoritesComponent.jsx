import React, { Component } from "react";
import MovieCardWrapperComponent from "../MovieCard/MovieCardWrapperComponent.jsx";
import explore from "../../../static/images/explore.jpg";

class FavoritesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favoriteMovies: [],
    };
    this.loadFavorites = this.loadFavorites.bind(this);
  }
  componentDidMount() {
    if (this.props.activeHeaderSection !== "favorites") {
      this.props.activateHeaderSection("favorites");
    }
    this.loadFavorites();
  }
  loadFavorites() {
    fetch("http://localhost:8000/api/favorites")
      .then((reply) => reply.json())
      .then((data) => {
        console.log("FAVORITES");
        console.log(data)
        this.setState(() => {
          return { favoriteMovies: data };
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
        <div className="container" style={{ minHeight: "90vh" }}>
          {this.state.favoriteMovies.length !== 0 && <div className="row" style={{justifyContent: "space-between"}}>
            {this.state.favoriteMovies.map((movie, i) => {
              return <div className="col"><MovieCardWrapperComponent key={movie.movie_id} loadFavorites={this.loadFavorites} movie_id={movie.movie_id} /></div>;
            })}
            {this.state.favoriteMovies.length%3 === 2 && <div className="col"></div>}
          </div>}
          {this.state.favoriteMovies.length === 0 && (
            <div>
              <img style={{ marginTop: "3rem", width: "50%" }} src={explore} />
              <div className="start-searching" style={{ marginBottom: "3rem" }}>
                Start searching movies in explore section and add to favorites...
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default FavoritesComponent;
