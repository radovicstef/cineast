import React, { Component } from "react";
import { Redirect, Route } from "react-router";
import AuthenticationService from "./AuthenticationService";
import ProcessingComponent from "../ProcessingComponent/ProcessingComponent.jsx";

class AuthenticatedRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: undefined,
    };
  }
  componentDidMount() {
    fetch("http://localhost:8000/api/user")
      .then((response) => {
        if (!response.ok) {
          this.setState(() => {
            return { authenticated: false };
          });
        } else {
          this.setState(() => {
            return { authenticated: true };
          });
        }
      })
      .catch(() => {
        this.setState(() => {
          return { authenticated: false };
        });
      });
  }
  render() {
    return (
      <div>
        {this.state.authenticated === undefined && <ProcessingComponent />}
        {this.state.authenticated !== undefined &&
          this.state.authenticated === false && <Redirect to="/login" />}
        {this.state.authenticated !== undefined &&
          this.state.authenticated === true && <Route {...this.props} />}
      </div>
    );
  }
}

export default AuthenticatedRoute;
