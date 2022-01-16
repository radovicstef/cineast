import { Link } from "@material-ui/core";
import React, { Component } from "react";
import { withRouter } from "react-router";

import GenreComponent from "./GenreComponent.jsx";
import "./MovieCardComponent.css";
import MovieRatingComponent from "./MovieRatingComponent.jsx";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AuthenticationService from "../Authentication/AuthenticationService";


class MovieCardComponent extends Component {
  BASE_POSTER_PATH = "https://image.tmdb.org/3/t/p/original/";
  API_KEY = "?api_key=aac569ce5b81de3e31bee34323e9745e";
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      favorite: false
    };
    this.shortOverview = this.props.overview.substring(0, 150).trim();
    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.removeFromFavorites = this.removeFromFavorites.bind(this);
    if (this.shortOverview.endsWith(".")) {
      this.shortOverview = this.shortOverview + "..";
    } else {
      this.shortOverview = this.shortOverview + "...";
    }
  }
  checkIfLoggedIn() {
    return AuthenticationService.isUserLoggedIn();
  }
  async componentDidMount() {
    const isLoggedIn = await this.checkIfLoggedIn();
    let isMovieLiked = await AuthenticationService.isMovieLiked(
      this.props.id
    );
    isMovieLiked = isMovieLiked === "true";
    this.setState(() => {
      return { loggedin: isLoggedIn, favorite: isMovieLiked };
    });
  }
  addToFavorites() {
    const data = { movie_id: this.props.id };
    const request = new Request("http://localhost:8000/api/add_favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    fetch(request).then((response) => {
      if (response.ok) {
        console.log("Added favorite movie");
        if(this.props.loadFavorites !== undefined){
          this.props.loadFavorites();
        }
        if(this.props.loadMovies !== undefined){
          this.props.loadMovies(this.props.pageNumber);
        }
      }
    });
    this.setState(() => {
      return { favorite: true };
    });
  }
  removeFromFavorites() {
    fetch(
      `http://localhost:8000/api/remove_favorite/${this.props.id}/`
    ).then((response) => {
      if (response.ok) {
        console.log("Removed favorite movie");
        if(this.props.loadFavorites !== undefined){
          this.props.loadFavorites();
        }
        if(this.props.loadMovies !== undefined){
          this.props.loadMovies(this.props.pageNumber);
        }
        this.setState(() => {
          return { favorite: false };
        });
      }
    });
  }
  render() {
    return (
      <div
        className="card movie-card shadow-sm p-3 mb-5 bg-white rounded"
        style={{ margin: 20, justifyContent: "center" }}
      >
        <div className="container-image">
          <img
            src={this.BASE_POSTER_PATH + this.props.poster_path + this.API_KEY}
            className="card-img-top movie-card-img"
            style={{ paddingBottom: 5, width: "80%" }}
          />
          <div
            className="card-img-top movie-card-img overlay-image"
            style={{
              padding: "0.5rem",
              paddingLeft: "13%",
              paddingRight: "13%",
              paddingBottom: 5,
              color: "white",
            }}
          >
            <div style={{ padding: "0.5rem", marginTop: "10%" }}>Synopsis</div>
            <p
              style={{
                padding: "0.7rem",
                paddingBottom: "0rem",
                fontSize: "0.7rem",
                fontWeight: "normal",
              }}
            >
              {this.shortOverview}
            </p>
            {this.state.loggedin && (
              <div style={{ marginBottom: "1rem" }}>
                {!this.state.favorite && (
                  <button
                    className="favorite-button"
                    onClick={this.addToFavorites}
                    data-toggle="tooltip"
                    title="Add to favorites"
                  >
                    <FavoriteIcon className="favorite" />
                  </button>
                )}
                {this.state.favorite && (
                  <button
                    className="favorite-button"
                    onClick={this.removeFromFavorites}
                    data-toggle="tooltip"
                    title="Remove from favorites"
                  >
                    <FavoriteIcon
                      style={{
                        color: "rgba(224, 36, 1)",
                        transform: "scale(1.2)",
                      }}
                    />
                  </button>
                )}
              </div>
            )}
            <button
              onClick={() => {
                this.props.history.push(`/movie/${this.props.id}`);
              }}
              type="button"
              className="btn btn-secondary"
              style={{
                fontSize: "0.8rem",
                border: "none",
                backgroundColor: "rgb(24, 45, 58)",
              }}
            >
              Movie details
            </button>
          </div>
        </div>
        <span style={{ textAlign: "center" }}>
          <MovieRatingComponent rating={this.props.rating} />
        </span>
        <div className="card-body" style={{ paddingBottom: "0.5rem" }}>
          <p style={{ marginBottom: 0 }} rel="tooltip" title={this.props.title}>
            {this.props.title.substring(0, 20).trim() +
              (this.props.title.length > 20 ? "..." : "")}
          </p>
          <small
            className="text-muted"
            style={{ fontSize: "0.8rem", opacity: "60%" }}
          >
            {this.props.year}
          </small>
          <span
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              margin: "0.5rem",
              marginTop: "1rem",
              marginBottom: 0,
            }}
          >
            {this.props.genres.slice(0, 3).map((item, i) => {
              return <GenreComponent key={i} genre={item} />;
            })}
          </span>
        </div>
      </div>
    );
  }
}

export default withRouter(MovieCardComponent);
