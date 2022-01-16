import React, { Component } from "react";

import "./LoginComponent.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { IP_ADDR, PORT } from "../../constants";


class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      hasLoginFailed: false,
      showSuccessMessage: false,
    };
    this.submitLogin = this.submitLogin.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
  }
  submitLogin() {
    const data = {
      username: this.state.username,
      password: this.state.password,
    };
    const request = new Request(`http://${IP_ADDR}:${PORT}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    fetch(request).then((response) => {
      if (response.ok) {
        this.props.handleLoggedIn();
        this.props.history.push("/welcome");
      } else {
        this.setState(() => {
          return { hasLoginFailed: true };
        });
      }
    });
  }
  handleChangeInput(event) {
    this.setState(() => {
      return { [event.target.name]: event.target.value };
    });
  }
  render() {
    return (
      <div className="gradient-custom" style={{ marginTop: "-1.5rem" }}>
        <div
          style={{
            position: "fixed",
            backgroundImage: `url("https://image.tmdb.org/t/p/original//d5NXSklXo0qyIYkgV94XAgMIckC.jpg")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            width: "100vw",
            height: "100vh",
            zIndex: "-99999",
          }}
        ></div>
        <section className="vh-100">
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                <div
                  className="card"
                  style={{
                    borderRadius: "1rem",
                    color: "#182D3A",
                    backgroundColor: "rgba(255,255,255,0.5)",
                  }}
                >
                  <div className="card-body p-5 text-center">
                    <div style={{ marginBottom: "2rem" }}>
                      <p style={{ fontSize: "2rem", fontWeight: "bolder" }}>
                        CINEAST
                      </p>
                    </div>
                    <div
                      className="input-group"
                      style={{ marginBottom: "1rem" }}
                    >
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend"
                        >
                          <AccountCircleIcon color="action" />
                        </span>
                      </div>
                      <input
                        onFocus={() => {
                          this.setState(() => {
                            return { hasLoginFailed: false };
                          });
                        }}
                        type="text"
                        className="form-control"
                        id="validationCustomUsername"
                        placeholder="Username"
                        name="username"
                        value={this.state.username}
                        aria-describedby="inputGroupPrepend"
                        onChange={this.handleChangeInput}
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a username.
                      </div>
                    </div>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text"
                          id="inputGroupPrepend"
                        >
                          <VpnKeyIcon color="action" />
                        </span>
                      </div>
                      <input
                        onFocus={() => {
                          this.setState(() => {
                            return { hasLoginFailed: false };
                          });
                        }}
                        type="password"
                        className="form-control"
                        id="validationCustomUsername"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        aria-describedby="inputGroupPrepend"
                        onChange={this.handleChangeInput}
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a password.
                      </div>
                    </div>
                  </div>
                  {this.state.hasLoginFailed && (
                    <div className="alert alert-danger">
                      Invalid username/password or this username already taken!
                    </div>
                  )}
                  <div style={{ marginBottom: "2rem" }}>
                    <button
                      onClick={this.submitLogin}
                      className="btn"
                      style={{
                        backgroundColor: "#182D3A",
                        color: "white",
                        width: "80%",
                      }}
                    >
                      Login
                    </button>
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <p className="mb-0">
                      Don't have an account?{" "}
                      <a href="/register" id="signUp">
                        Sign Up
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default LoginComponent;
