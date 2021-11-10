import React, { Component } from "react";

import "./RegisterComponent.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

class RegisterComponent extends Component {
  constructor(props) {
    super(props);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.state = {
      username: "",
      password: "",
      passwordVisible: false,
    };
    this.submitRegister = this.submitRegister.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
  }
  handleChangeInput(event) {
    this.setState(() => {
      return { [event.target.name]: event.target.value };
    });
  }
  toggleVisibility() {
    this.setState((prevValue) => {
      return { passwordVisible: !prevValue.passwordVisible };
    });
  }
  submitRegister() {
    const data = {
      username: this.state.username,
      password: this.state.password,
    };
    const request = new Request("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    fetch(request).then((response) => {
      if (response.ok) {
        this.setState(() => {
          return {username: "", password: ""}
        });
      }
    });
  }
  render() {
    return (
      <div className="gradient-custom" style={{ marginTop: "-1.5rem" }}>
        <div
          style={{
            position: "fixed",
            backgroundImage: `url("https://image.tmdb.org/t/p/original/qA2TyqPldTtoTVY3LKrNIG5g6bH.jpg")`,
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
                        type="text"
                        className="form-control"
                        id="validationCustomUsername"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChangeInput}
                        placeholder="Username"
                        aria-describedby="inputGroupPrepend"
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
                          onClick={this.toggleVisibility}
                        >
                          {!this.state.passwordVisible && (
                            <VisibilityOffIcon color="action" />
                          )}
                          {this.state.passwordVisible && (
                            <VisibilityIcon color="action" />
                          )}
                        </span>
                      </div>
                      <input
                        type={this.state.passwordVisible ? "text" : "password"}
                        className="form-control"
                        id="validationCustomUsername"
                        placeholder="Password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChangeInput}
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <div className="invalid-feedback">
                        Please choose a password.
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: "2rem" }}>
                    <button
                      onClick={this.submitRegister}
                      className="btn"
                      style={{
                        backgroundColor: "#182D3A",
                        color: "white",
                        width: "80%",
                      }}
                    >
                      Sign up
                    </button>
                  </div>
                  <div style={{ marginBottom: "1rem" }}>
                    <p className="mb-0">
                      Already have an account?{" "}
                      <a href="/login" id="logIn">
                        Login
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

export default RegisterComponent;
