import React, { Component } from "react";

import StarIcon from "@material-ui/icons/Star";

class MovieRatingComponent extends Component {
  constructor(props) {
    super(props);
    this.ratingStr = this.props.rating.toString();
  }
  render() {
    return (
      <div>
        <div
          className="progress"
          style={{ width: "73%", display: "inline-block" }}
        >
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={this.props.rating * 10}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{
              width: `${this.props.rating * 10}%`,
              alignItems: "right",
              backgroundColor: "#FAD02C",
            }}
          >
            <span
              style={{
                textAlign: "right",
                paddingRight: "0.35rem"
              }}
            >
              <StarIcon
                style={{
                  width: "1rem",
                  marginTop: "-0.25rem",
                  marginRight: "0.2rem",
                }}
              />
              {this.props.rating}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default MovieRatingComponent;
