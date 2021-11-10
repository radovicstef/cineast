import React, { Component } from "react";

class FooterComponent extends Component {
  render() {
    return (
      <footer
        className="text-center-text-lg-start"
        style={{ background: "#182D3A", color: "white"}}
      >
        <div className="container p-4">
          <div className="row">
            <div
              className="col-lg-6 col-md-12 mb-4 mb-md-0"
              style={{ width: "60%" }}
            >
              <h5
                style={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textAlign: "left",
                }}
              >
                CONTACT US
              </h5>
              <p
                style={{
                  fontWeight: "lighter",
                  fontSize: "0.7rem",
                  textAlign: "left",
                }}
              >
                You have a suggestion for future features or you want to
                collaborate, do not hesitate to contact us at{" "}
                <a>contact@cineast.com</a>
                <br />
              </p>
            </div>
            <div
              className="col-lg-6 col-md-12 mb-4 mb-md-0"
              style={{ width: "40%" }}
            >
              <img
                src="../../static/images/cineastlogo.png"
                style={{ width: "3rem", float: "right" }}
              />
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default FooterComponent;
