import React, { Component } from "react";

import "./LoginComponent.css";

class LoginComponent extends Component {
  render() {
    return (
      <div className="gradient-custom">
        <section className="vh-100" style={{marginBottom: "10rem"}}>
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                <div
                  className="card bg-light"
                  style={{ borderRadius: "1rem", color: "#182D3A" }}
                >
                  <div className="card-body p-5 text-center">
                    <div className="mb-md-5 mt-md-4 pb-5">
                      <h2 className="fw-bold mb-2 text-uppercase">LOGIN</h2>
                      <p className="mb-5">
                        Please enter your username and password
                      </p>
                    </div>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="username"
                        id="username"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="username">
                        Username
                      </label>
                    </div>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        id="password"
                        className="form-control form-control-lg"
                      />
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                    </div>
                    <p className="small mb-5 pb-lg-2">
                      <a href="#">Forgot password?</a>
                    </p>
                  </div>
                  <div>
                    <p className="mb-0">
                      Don't have an account?{" "}
                      <a href="#!" className="fw-bold">
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
