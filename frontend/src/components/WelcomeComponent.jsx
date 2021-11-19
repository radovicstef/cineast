import React, { Component } from "react";

import { withRouter } from "react-router";

import "./WelcomeComponent.css";
import welcomeimage from "../../static/images/welcome.jpg";

class WelcomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        username: ""
    }
  }
  componentDidMount() {
      fetch("http://localhost:8000/api/user")
      .then(reply => reply.json())
      .then(data => {
          this.setState(() => {
              return {username: data.username}
          })
      })
      this.timer = setTimeout(() => this.props.history.push("/explore/1"), 5000);
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  render() {
    return (
      <div>
        <div
          className="background-welcome"
          style={{
            position: "fixed",
            backgroundImage: `url("static/images/welcome.jpg")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            width: "100vw",
            height: "150vh",
            zIndex: "-9999",
          }}
        ></div>
        <div class="main-div">
          <div className="welcome">Welcome, {this.state.username}!</div>
          <div className="cineast-welcome">CINEAST</div>
        </div>
      </div>
    );
  }
}

export default withRouter(WelcomeComponent);
