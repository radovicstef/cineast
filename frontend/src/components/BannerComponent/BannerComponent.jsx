import React, { Component } from "react";

import "./BannerComponent.css";

class BannerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topmargin: 0,
    };
    this.handleResize = this.handleResize.bind(this);
    this.renderImage = this.renderImage.bind(this);
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  handleResize() {
    if (window.innerWidth > 1000) {
      this.setState(() => {
        return { topmargin: "0" };
      });
    } else if (window.innerWidth < 1000 && window.innerWidth > 950) {
      this.setState(() => {
        return { topmargin: "1rem" };
      });
    } else if (window.innerWidth < 950 && window.innerWidth > 900) {
      this.setState(() => {
        return { topmargin: "2rem" };
      });
    } else if (window.innerWidth < 900 && window.innerWidth > 650) {
      this.setState(() => {
        return { topmargin: "3rem" };
      });
    } else if (window.innerWidth < 650 && window.innerWidth > 600) {
      this.setState(() => {
        return { topmargin: "4rem" };
      });
    } else if (window.innerWidth < 600 && window.innerWidth > 400) {
      this.setState(() => {
        return { topmargin: "6rem" };
      });
    } else if (window.innerWidth < 400 && window.innerWidth > 350) {
      this.setState(() => {
        return { topmargin: "7rem" };
      });
    } else if (window.innerWidth < 350) {
      this.setState(() => {
        return { topmargin: "11rem" };
      });
    }
  }
  renderImage() {
    return <img
      onLoad={this.props.finishLoading}
      className="bannerImage"
      src={this.props.bannerImage}
      style={{
        width: "100%",
        marginTop: `${this.state.topmargin}`,
        marginBottom: `${this.props.loading ? "0" : "1rem"}`,
      }}
    />;
  }
  render() {
    return (
      <div style={{ position: "relative" }}>
        {!this.props.loading && (
          <div
            style={{
              position: "absolute",
              padding: "3rem",
              paddingTop: "2.3rem",
              paddingLeft: "10%",
              textAlign: "left",
              fontWeight: "bold",
              color: "#182D3A",
            }}
          >
            <h1 className="header-title" style={{ fontWeight: "bolder" }}>
              Welcome to CINEAST
            </h1>
            <h2
              className="header-title"
              style={{ fontWeight: "lighter", fontSize: "1.7rem" }}
            >
              It's movie time and you need suggestion
            </h2>
            <br />
            <button
              className="btn btn-info"
              style={{
                backgroundColor: "#182D3A",
                color: "white",
                border: "none",
              }}
            >
              Join now
            </button>
          </div>
        )}
        <div>{this.renderImage()}</div>
      </div>
    );
  }
}

export default BannerComponent;
