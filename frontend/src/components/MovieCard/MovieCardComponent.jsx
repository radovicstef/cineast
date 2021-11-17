import { Link } from "@material-ui/core";
import React, { Component } from "react";
import { withRouter } from "react-router";

import GenreComponent from "./GenreComponent.jsx";
import "./MovieCardComponent.css";
import MovieRatingComponent from "./MovieRatingComponent.jsx";

class MovieCardComponent extends Component {
  BASE_POSTER_PATH = "https://image.tmdb.org/3/t/p/original/";
  API_KEY = "?api_key=aac569ce5b81de3e31bee34323e9745e";
  constructor(props) {
    super(props);
    this.shortOverview = this.props.overview.substring(0, 150).trim();
    if (this.shortOverview.endsWith(".")) {
      this.shortOverview = this.shortOverview + "..";
    } else {
      this.shortOverview = this.shortOverview + "...";
    }
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
                fontSize: "0.7rem",
                fontWeight: "normal",
              }}
            >
              {this.shortOverview}
            </p>
            <button
              onClick={() => {this.props.history.push(`/movie/${this.props.id}`)}}
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
          <p style={{ marginBottom: 0 }} rel="tooltip" title={this.props.title}>{this.props.title.substring(0,20).trim() + ((this.props.title.length > 20) ? "..." : "")}</p>
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
