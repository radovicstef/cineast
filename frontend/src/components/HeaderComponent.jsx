import React, { Component } from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import "./HeaderComponent.css";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="sticky-top">
        <nav className="navbar navbar-expand-lg navbar-light navbar-custom">
          <div className="navbar-header" style={{paddingTop: "0.7rem", paddingBottom: "0.7rem"}}>
            <a
              href="/#"
              className="navbar-brand navbar-brand-custom"
              style={{ color: "white", marginLeft: "5%", marginTop: "0.5rem"}}
            >
              CINEAST
            </a>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ marginRight: "1.5rem" }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            id="navbarSupportedContent"
            className="collapse navbar-collapse"
            style={{
              float: "right",
              justifyContent: "end",
              marginRight: "1.5rem",
            }}
          >
            <ul
              className="nav navbar-nav navbar-right mt-2 mt-lg-0 ms-3 mr-auto"
              style={{ width: "100%", justifyContent: "end" }}
            >
              {!this.props.loggedin && this.props.loggedin!==undefined && (
                <li className="nav-item" style={{ padding: "0.5rem" }}>
                  <Link to="/register">
                    <button
                      className="btn btn-success"
                      style={{ padding: "none", float: "right" }}
                    >
                      Sign up
                    </button>
                  </Link>
                </li>
              )}
              {!this.props.loggedin && this.props.loggedin!==undefined &&  (
                <li className="nav-item" style={{ padding: "0.5rem" }}>
                  <Link to="/login">
                    <button
                      className="btn btn-success"
                      style={{ padding: "none", float: "right" }}
                    >
                      Login
                    </button>
                  </Link>
                </li>
              )}
              {this.props.loggedin && (
                <li
                  className="nav-item"
                  style={{ padding: "0.7rem", textAlign: "right" }}
                >
                  <Link className="header-item" to="/login">
                    <span>Explore</span>
                  </Link>
                </li>
              )}
              {this.props.loggedin && (
                <li
                  className="nav-item"
                  style={{ padding: "0.7rem", textAlign: "right" }}
                >
                  <Link className="header-item" to="/login">
                    <span>Favorites</span>
                  </Link>
                </li>
              )}
              {this.props.loggedin && (
                <li
                  className="nav-item"
                  style={{ padding: "0.7rem", textAlign: "right" }}
                >
                  <div className="dropdown">
                    <AccountCircleIcon className="dropdown-button"/>
                    <div className="dropdown-content">
                      <Link className="profile">Profile</Link>
                      <span className="triangle">''</span>
                      <Link>Logout<ExitToAppIcon style={{paddingLeft: "0.2rem"}}/></Link>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default HeaderComponent;
