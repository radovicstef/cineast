import React, { Component } from "react";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import MovieCreationIcon from "@material-ui/icons/MovieCreation";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import RecentActors from "@material-ui/icons/RecentActors";

class CastComponent extends Component {
  constructor(props) {
    super(props);
    this.IMG_PREFIX = "https://image.tmdb.org/t/p/original/";
  }
  render() {
    return (
      <div style={{ width: "100%", textAlign: "center", margin: "0.5rem" }}>
        <div>
          {this.props.profile_path !== null && (
            <img
              style={{
                objectFit: "cover",
                borderRadius: "50%",
                height: "60",
                width: "60",
              }}
              src={this.IMG_PREFIX + this.props.profile_path}
            />
          )}
          {this.props.profile_path === null && this.props.type === "writer" && (
            <MenuBookIcon
              style={{
                objectFit: "cover",
                height: "60",
                width: "60",
              }}
            />
          )}
          {this.props.profile_path === null && this.props.type === "director" && (
            <MovieCreationIcon
              style={{
                objectFit: "cover",
                height: "60",
                width: "60",
              }}
            />
          )}
          {this.props.profile_path === null && this.props.type === "actor" && (
            <RecentActors
              style={{
                objectFit: "cover",
                height: "60",
                width: "60",
              }}
            />
          )}
          <br></br>
          <span style={{ fontWeight: "lighter", fontSize: "0.9rem" }}>
            {this.props.type === "actor" && this.props.name}
            {this.props.type !== "actor" &&
              this.props.name.split(" ").map((name) => {
                return (
                  <span>
                    {name}
                    <br></br>
                  </span>
                );
              })}
          </span>
        </div>
      </div>
    );
  }
}

export default CastComponent;
