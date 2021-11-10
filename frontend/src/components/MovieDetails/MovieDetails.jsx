import { Box, Grid, Item } from "@material-ui/core";
import React, { Component } from "react";

import "./MovieDetails.css";
import MovieDetailsPoster from "./MovieDetailsPoster.jsx";
import StarIcon from "@material-ui/icons/Star";
import GenreComponent from "../MovieCard/GenreComponent.jsx";
import TheatersIcon from "@material-ui/icons/Theaters";
import CastComponent from "./CastComponent.jsx";
import AuthenticationService from "../Authentication/AuthenticationService";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChartBudget from "./ChartBudget.jsx";

class MovieDetails extends Component {
  constructor(props) {
    super(props);
    this.IMG_PREFIX = "https://image.tmdb.org/t/p/original/";
    this.state = {
      details: undefined,
      loggedin: false,
      favorite: false,
      productionWidth: "43%",
      compact: false,
      numActors: 5
    };
    this.getMovieDetails = this.getMovieDetails.bind(this);
    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.removeFromFavorites = this.removeFromFavorites.bind(this);
    this.handleResizeMovieDetails = this.handleResizeMovieDetails.bind(this);
    window.addEventListener("resize", this.handleResizeMovieDetails);
  }
  getMovieDetails() {
    fetch(`http://localhost:8000/api/movie/${this.props.match.params.id}`)
      .then((reply) => reply.json())
      .then((reply) => {
        this.setState(() => {
          return { details: reply };
        });
      });
  }
  async componentDidMount() {
    this.getMovieDetails();
    const isLoggedIn = await this.checkIfLoggedIn();
    this.setState(() => {
      return { loggedin: isLoggedIn };
    });
    this.handleResizeMovieDetails();
  }
  checkIfLoggedIn() {
    return AuthenticationService.isUserLoggedIn();
  }
  addToFavorites() {
    const data = {movie_id: this.props.match.params.id}
    const request = new Request("http://localhost:8000/api/add_favorite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    fetch(request).then((response) => {
      if (response.ok) {
        console.log("Added favorite movie")
      }
    });
    this.setState(() => {
      return { favorite: true };
    });
  }
  removeFromFavorites() {
    this.setState(() => {
      return { favorite: false };
    });
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  handleResizeMovieDetails() {
    if (window.innerWidth >= 1100) {
      this.setState(() => {
        return { productionWidth: "43%", compact: false, numActors:5 };
      });
    } else if (window.innerWidth < 1100 && window.innerWidth > 810) {
      this.setState(() => {
        return { productionWidth: "90%", compact: false, numActors:5};
      });
    } else if (window.innerWidth < 810 && window.innerWidth > 540) {
      this.setState(() => {
        return { productionWidth: "90%", compact: true, numActors:5};
      });
    }
    else if (window.innerWidth < 540) {
      this.setState(() => {
        return { productionWidth: "90%", numActors: 4 };
      });
    }
  }
  render() {
    console.log("actorRow: " + this.state.numActors);

    return (
      <div
        className="movie-details-gradient-custom"
        style={{ marginTop: "-1.5rem" }}
      >
        {this.state.details !== undefined && (
          <div
            style={{
              position: "fixed",
              backgroundImage: `url(${
                this.IMG_PREFIX + this.state.details.background_image
              })`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: "100vw",
              height: "100vh",
              zIndex: "-99999",
            }}
          ></div>
        )}

        <section style={{ minHeight: "100%" }}>
          {this.state.details !== undefined && (
            <Box sx={{ flexGrow: 1 }}>
              <Grid container>
                {!this.state.compact && <Grid
                  item
                  xs={2}
                  style={{ marginTop: "3rem", marginLeft: "3rem" }}
                >
                  <MovieDetailsPoster
                    poster_path={
                      this.IMG_PREFIX + this.state.details.poster_path
                    }
                  />
                  {this.state.loggedin && (
                    <div style={{ marginTop: "1rem" }}>
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
                </Grid>}
                <Grid item xs={this.state.compact ? 12 : 8}>
                  <div
                    style={{
                      width: "90%",
                      display: "flex",
                      float: "left",
                      marginTop: "3rem",
                      marginLeft: "2rem",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: "3rem", color: "white" }}>
                      {this.state.details.title}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "1.7rem",
                      display: "flex",
                      float: "left",
                      marginLeft: "2rem",
                      width: "90%",
                    }}
                  >
                    <span style={{ color: "white" }}>
                      {parseInt(this.state.details.release_date)}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        marginLeft: "2rem",
                        fontSize: "1rem",
                        color: "rgba(255,255,255,0.65)",
                      }}
                    >
                      <TheatersIcon />
                      {this.state.details.duration}min
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      float: "left",
                      marginLeft: "2rem",
                      marginTop: "1rem",
                      width: "90%",
                    }}
                  >
                    <StarIcon style={{ fontSize: "2rem", color: "#F4D03F" }} />
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        marginLeft: "0.5rem",
                        fontSize: "1.5rem",
                        color: "#F4D03F",
                      }}
                    >
                      {this.state.details.rating}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        marginLeft: "0.5rem",
                      }}
                    >
                      {this.state.details.genres.map((genre, i) => {
                        return (
                          <span>
                            <GenreComponent key={i} genre={genre} />
                          </span>
                        );
                      })}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      float: "left",
                      textAlign: "left",
                      marginLeft: `${this.state.compact ? "1rem" : "2rem"}`,
                      marginRight: `${this.state.compact ? "1rem" : "0rem"}`,
                      marginTop: "1rem",
                      color: "white",
                      backgroundColor: "rgba(24, 45, 58, 0.5)",
                      padding: "1rem",
                      borderRadius: "1rem",
                      position: "relative",
                      width: "90%",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bolder",
                        position: "absolute",
                        width: "100%",
                        fontSize: "1.2rem",
                      }}
                    >
                      Synopsis:
                    </span>
                    <span style={{ marginTop: "2.5rem" }}>
                      {this.state.details.overview}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      float: "left",
                      textAlign: "center",
                      alignItems: "center",
                      marginLeft: `${this.state.compact ? "1rem" : "2rem"}`,
                      marginRight: `${this.state.compact ? "1rem" : "0rem"}`,
                      marginTop: "1rem",
                      color: "white",
                      borderRadius: "1rem",
                      backgroundColor: "rgba(24, 45, 58, 0.5)",
                      width: `${this.state.productionWidth}`,
                      justifyContent: "space-between",
                      padding: "2rem",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                        DIRECTOR
                      </p>
                      <span style={{ display: "flex", textAlign: "left" }}>
                        {this.state.details.directors
                          .slice(0, 2)
                          .map((member, i) => {
                            return (
                              <CastComponent
                                key={i}
                                profile_path={member.profile_path}
                                name={member.name}
                                type="director"
                              />
                            );
                          })}
                      </span>
                    </div>
                    <div>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                        WRITER
                      </p>
                      <span style={{ display: "flex", textAlign: "right" }}>
                        {this.state.details.writers
                          .slice(0, 2)
                          .map((member, i) => {
                            return (
                              <CastComponent
                                key={i}
                                profile_path={member.profile_path}
                                name={member.name}
                                type="writer"
                              />
                            );
                          })}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      float: "left",
                      textAlign: "center",
                      marginLeft: `${this.state.compact ? "1rem" : "2rem"}`,
                      marginRight: `${this.state.compact ? "1rem" : "0rem"}`,
                      marginTop: "1rem",
                      color: "white",
                      padding: "2rem",
                      borderRadius: "1rem",
                      backgroundColor: "rgba(24, 45, 58, 0.5)",
                      width: `${this.state.productionWidth}`,
                      height: "14.7rem",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        margin: "auto 0",
                      }}
                    >
                      {this.state.details.budget !== 0 &&
                        this.state.details.revenue !== 0 && (
                          <ChartBudget
                            budget={this.state.details.budget}
                            revenue={this.state.details.revenue}
                          />
                        )}
                      {(this.state.details.budget === 0 ||
                        this.state.details.revenue === 0) && (
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                            PRODUCTION
                          </p>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            {this.state.details.production_companies
                              .slice(0, 2)
                              .map((company, i) => {
                                return (
                                  <CastComponent
                                    key={i}
                                    name={company.name}
                                    profile_path={company.logo_path}
                                    type="director"
                                  />
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      float: "left",
                      textAlign: "center",
                      marginLeft: `${this.state.compact ? "1rem" : "2rem"}`,
                      marginRight: `${this.state.compact ? "1rem" : "0rem"}`,
                      marginTop: "1rem",
                      marginBottom: "3rem",
                      color: "white",
                      padding: "1rem",
                      borderRadius: "1rem",
                      backgroundColor: "rgba(24, 45, 58, 0.5)",
                      width: "90%",
                    }}
                  >
                    <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                      CAST
                    </p>
                    <span
                      style={{
                        width: "100%",
                        display: "flex",
                        float: "left",
                        justifyContent: "center",
                      }}
                    >
                      {this.state.details.cast
                        .slice(0, this.state.numActors).map((member, i) => {
                          return (
                            <CastComponent
                              key={i}
                              profile_path={member.profile_path}
                              name={member.name}
                              type="actor"
                            />
                          );
                        })}
                    </span>
                  </div>
                </Grid>
              </Grid>
            </Box>
          )}
        </section>
      </div>
    );
  }
}

export default MovieDetails;
