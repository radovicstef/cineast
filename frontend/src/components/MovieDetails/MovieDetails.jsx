import { Box, Grid, Item } from "@material-ui/core";
import React, { Component } from "react";

import "./MovieDetails.css";
import MovieDetailsPoster from "./MovieDetailsPoster.jsx";
import StarIcon from "@material-ui/icons/Star";
import GenreComponent from "../GenreComponent.jsx";
import TheatersIcon from "@material-ui/icons/Theaters";
import CastComponent from "./CastComponent.jsx";

class MovieDetails extends Component {
  constructor(props) {
    super(props);
    this.IMG_PREFIX = "https://image.tmdb.org/t/p/original/";
    this.state = {
      details: undefined,
    };
    this.getMovieDetails = this.getMovieDetails.bind(this);
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
  componentDidMount() {
    this.getMovieDetails();
  }
  render() {
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

        <section style={{minHeight: "100%"}}>
          {this.state.details !== undefined && (
            <Box sx={{ flexGrow: 1 }}>
              <Grid container>
                <Grid
                  item
                  xs={2}
                  style={{ marginTop: "3rem", marginLeft: "3rem" }}
                >
                  <MovieDetailsPoster
                    poster_path={
                      this.IMG_PREFIX + this.state.details.poster_path
                    }
                  />
                </Grid>
                <Grid item xs={8}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      float: "left",
                      marginTop: "3rem",
                      marginLeft: "2rem",
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
                      width: "100%",
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
                      width: "100%",
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
                      marginLeft: "2rem",
                      marginTop: "1rem",
                      color: "white",
                      backgroundColor: "rgba(24, 45, 58, 0.5)",
                      padding: "1rem",
                      borderRadius: "1rem",
                      position: "relative",
                      width: "90%"
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
                      marginLeft: "2rem",
                      marginTop: "1rem",
                      color: "white",
                      padding: "1rem",
                      borderRadius: "1rem",
                      backgroundColor: "rgba(24, 45, 58, 0.5)",
                      width: "40%"
                    }}
                  >
                    <p style={{fontSize: "1.5rem", fontWeight: "bold"}}>DIRECTOR</p>
                    {this.state.details.directors.slice(0,2).map((member, i) => {
                      return (
                        <CastComponent
                          key={i}
                          profile_path={member.profile_path}
                          name={member.name}
                          type="director"
                        />
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      float: "left",
                      textAlign: "center",
                      marginLeft: "2rem",
                      marginTop: "1rem",
                      color: "white",
                      padding: "1rem",
                      borderRadius: "1rem",
                      backgroundColor: "rgba(24, 45, 58, 0.5)",
                      marginLeft: "10%",
                      width: "40%"
                    }}
                  >
                    <p style={{fontSize: "1.5rem", fontWeight: "bold"}}>WRITER</p>
                    {this.state.details.writers.slice(0,2).map((member, i) => {
                      return (
                        <CastComponent
                          key={i}
                          profile_path={member.profile_path}
                          name={member.name}
                          type="writer"
                        />
                      );
                    })}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      float: "left",
                      textAlign: "center",
                      marginLeft: "2rem",
                      marginTop: "1rem",
                      color: "white",
                      padding: "1rem",
                      borderRadius: "1rem",
                      backgroundColor: "rgba(24, 45, 58, 0.5)",
                      width: "90%"
                    }}
                  >
                    <p style={{fontSize: "1.5rem", fontWeight: "bold"}}>CAST</p>
                    {this.state.details.cast.map((member, i) => {
                      return (
                        <CastComponent
                          key={i}
                          profile_path={member.profile_path}
                          name={member.name}
                          type="actor"
                        />
                      );
                    })}
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