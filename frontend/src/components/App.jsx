import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import BannerComponent from "./BannerComponent.jsx";
import FooterComponent from "./FooterComponent.jsx";
import HeaderComponent from "./HeaderComponent.jsx";
import TrendingMoviesComponent from "./TrendingMoviesComponent.jsx";
import "../../static/css/index.css";
import LoginComponent from "./LoginComponent.jsx";
import ProcessingComponent from "./ProcessingComponent.jsx";
import bannerImage from "../../static/images/banner.jpg";
import RegisterComponent from "./RegisterComponent.jsx";
import AuthenticatedRoute from "./AuthenticatedRoute.jsx";
import WelcomeComponent from "./WelcomeComponent.jsx";
import AuthenticationService from "./AuthenticationService.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loggedin: undefined,
    };
    this.finishLoading = this.finishLoading.bind(this);
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
  }
  finishLoading() {
    this.setState(() => {
      return { loading: false };
    });
  }
  handleLoggedIn() {
    console.log("handleLoggedIn");
    this.setState(() => {
      return { loggedin: true };
    });
  }
  async componentDidMount() {
    const isLoggedIn = await this.checkIfLoggedIn();
    this.setState(() => {
      return {loggedin: isLoggedIn}
    })
  }
  async checkIfLoggedIn() {
    return fetch("http://localhost:8000/api/user")
      .then((response) => {
        if (!response.ok) {
          return false;
        } else {
          return true;
        }
      })
      .catch(() => {
        return false;
      });
  }
  render() {
    return (
      <Router>
        <>
          <HeaderComponent loggedin={this.state.loggedin} />
          <div className="App">
            <Switch>
              <Route path="/" exact>
                {this.state.loading && <ProcessingComponent />}
                <BannerComponent
                  loading={this.state.loading}
                  finishLoading={this.finishLoading}
                  bannerImage={bannerImage}
                />
                {!this.state.loading && <TrendingMoviesComponent />}
              </Route>
              <Route
                path="/login"
                render={(props) => (
                  <LoginComponent
                    {...props}
                    handleLoggedIn={this.handleLoggedIn}
                  />
                )}
              />
              <Route path="/register">
                <RegisterComponent />
              </Route>
              <AuthenticatedRoute
                path="/welcome"
                component={WelcomeComponent}
              />
            </Switch>
          </div>
          <FooterComponent />
        </>
      </Router>
    );
  }
}

export default App;
