import React, { Component } from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SearchIcon from "@material-ui/icons/Search";
import { InputAdornment } from "@material-ui/core";
import "./HeaderComponent.css";
import { TextField } from "@material-ui/core";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedInput: ""
    }
    this.onLogout = this.onLogout.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }
  onLogout() {
    this.props.startLoading();
    const request = new Request("http://localhost:8000/api/logout", {
      method: "POST",
    });
    fetch(request).then((response) => {
      if (response.ok) {
        this.props.handleLogout();
      }
    });
  }
  onSearch(event) {
    event.preventDefault();
    if (event.target.value == "") {
      this.props.passSearchedMovies([])
    } else {
      console.log(event.target.value);
      fetch(`http://localhost:8000/api/search/${event.target.value}`)
        .then((reply) => reply.json())
        .then((data) => {
          this.props.passSearchedMovies(data);
        });
    }
    this.setState(() => {
      return {searchedInput: event.target.value}
    })
  }
  render() {
    return (
      <div className="sticky-top">
        <nav className="navbar navbar-expand-lg navbar-light navbar-custom">
          <div
            className="navbar-header"
            style={{ paddingTop: "0.7rem", paddingBottom: "0.7rem" }}
          >
            <a
              href="/#"
              className="navbar-brand navbar-brand-custom"
              style={{ color: "white", marginLeft: "5%", marginTop: "0.5rem" }}
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
              {!this.props.loggedin && this.props.loggedin !== undefined && (
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
              {!this.props.loggedin && this.props.loggedin !== undefined && (
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
              {this.props.loggedin &&
                this.props.activeHeaderSection === "explore" && (
                  <li
                    className="nav-item"
                    style={{ padding: "0.5rem", textAlign: "right" }}
                  >
                    <TextField
                      autoFocus
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon style={{ fill: "white" }} />
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        style: { color: "white" },
                      }}
                      key="searchedInput"
                      type="text"
                      name="searchedInput"
                      value={this.state.searchedInput}
                      placeholder="Search movies..."
                      onChange={this.onSearch}
                    />
                  </li>
                )}
              {this.props.loggedin && (
                <li
                  className="nav-item"
                  style={{ padding: "0.7rem", textAlign: "right" }}
                >
                  <Link className="header-item" to="/explore">
                    {this.props.activeHeaderSection !== "explore" && (
                      <span className="navigation-section">Explore</span>
                    )}
                    {this.props.activeHeaderSection === "explore" && (
                      <span style={{ opacity: "100%" }}>Explore</span>
                    )}
                  </Link>
                </li>
              )}
              {this.props.loggedin && (
                <li
                  className="nav-item"
                  style={{ padding: "0.7rem", textAlign: "right" }}
                >
                  <Link className="header-item" to="/favorites">
                    {this.props.activeHeaderSection !== "favorites" && (
                      <span className="navigation-section">Favorites</span>
                    )}
                    {this.props.activeHeaderSection === "favorites" && (
                      <span style={{ opacity: "100%" }}>Favorites</span>
                    )}
                  </Link>
                </li>
              )}
              {this.props.loggedin && (
                <li
                  className="nav-item"
                  style={{ padding: "0.7rem", textAlign: "right" }}
                >
                  <div className="dropdown">
                    <AccountCircleIcon className="dropdown-button" />
                    <div className="dropdown-content">
                      <Link className="profile">Profile</Link>
                      <span className="triangle">''</span>
                      <Link to="/" onClick={this.onLogout}>
                        Logout
                        <ExitToAppIcon style={{ paddingLeft: "0.2rem" }} />
                      </Link>
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
