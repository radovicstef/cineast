import React, { Component } from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import "./HeaderComponent.css";

class HeaderComponent extends Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div className="sticky-top">
        <nav className="navbar navbar-expand-lg navbar-light navbar-custom">
          <div className="navbar-header">
            <a
              href="/#"
              className="navbar-brand navbar-brand-custom"
              style={{ color: "white", marginLeft: "5%" }}
            >
              CINEAST
            </a>
          </div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{marginRight: "1.5rem"}}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            id="navbarSupportedContent"
            className="collapse navbar-collapse"
            style={{ float: "right", justifyContent: "end", marginRight: "1.5rem" }}
          >
            <ul className="nav navbar-nav navbar-right mt-2 mt-lg-0 ms-3 mr-auto" style={{width: "100%", justifyContent: "end"}}>
              <li className="nav-item" style={{padding: "0.5rem"}}>
                <button className="btn btn-success" style={{ padding: "none", float: "right" }}>
                  Sign up
                </button>
              </li>
              <li className="nav-item" style={{padding: "0.5rem"}}>
                <button className="btn btn-success" style={{ padding: "none", float: "right" }}>
                  Login
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default HeaderComponent;
