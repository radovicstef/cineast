import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import BannerComponent from "./BannerComponent/BannerComponent.jsx";
import FooterComponent from "./FooterComponent/FooterComponent.jsx";
import HeaderComponent from "./HeaderComponent/HeaderComponent.jsx";
import TrendingMoviesComponent from "./TrendingMoviesComponent/TrendingMoviesComponent.jsx";
import LoginComponent from "./LoginComponent/LoginComponent.jsx";
import ProcessingComponent from "./ProcessingComponent/ProcessingComponent.jsx";
import RegisterComponent from "./RegisterComponent/RegisterComponent.jsx";
import WelcomeComponent from "./WelcomeComponent/WelcomeComponent.jsx";
import MovieDetails from "./MovieDetails/MovieDetails.jsx";
import AuthenticatedRoute from "./Authentication/AuthenticatedRoute.jsx";

import AuthenticationService from "./Authentication/AuthenticationService.js";
import bannerImage from "../../static/images/banner.jpg";
import "../../static/css/index.css";
import ExploreComponent from "./ExploreComponent/ExploreComponent.jsx";
import FavoritesComponent from "./FavoritesComponent/FavoritesComponent.jsx";

class CineastApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loggedin: undefined,
      activeHeaderSection: undefined,
      searchedMovies: []
    };
    this.genre = "All";
    this.rating = "All";
    this.year = "All";
    this.finishLoading = this.finishLoading.bind(this);
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.startLoading = this.startLoading.bind(this);
    this.activateHeaderSection = this.activateHeaderSection.bind(this);
    this.passSearchedMovies = this.passSearchedMovies.bind(this);
    this.storeLastFilter = this.storeLastFilter.bind(this);
  }
  startLoading() {
    this.setState(() => {
      return { loading: true };
    });
  }
  finishLoading() {
    this.setState(() => {
      return { loading: false };
    });
  }
  handleLoggedIn() {
    this.setState(() => {
      return { loggedin: true };
    });
  }
  handleLogout() {
    this.storeLastFilter("All", "All", "All");
    this.setState(() => {
      return { loggedin: false };
    });
  }
  async componentDidMount() {
    const isLoggedIn = await this.checkIfLoggedIn();
    this.setState(() => {
      return { loggedin: isLoggedIn };
    });
  }
  async checkIfLoggedIn() {
    return AuthenticationService.isUserLoggedIn();
  }
  activateHeaderSection(headerSection) {
    this.setState(() => {
      return {activeHeaderSection: headerSection};
    });
  }
  passSearchedMovies(movies) {
    this.setState(() => {
      return {searchedMovies: movies}
    })
  }
  storeLastFilter(genre, rating, year){
    this.genre = genre;
    this.rating = rating;
    this.year = year;
    console.log("storeLastFilter(): " + this.genre + " " + this.rating + " " + this.year)
  }
  render() {
    return (
      <Router>
        <>
          <HeaderComponent
            handleLogout={this.handleLogout}
            loggedin={this.state.loggedin}
            startLoading={this.startLoading}
            activeHeaderSection={this.state.activeHeaderSection}
            passSearchedMovies={this.passSearchedMovies}
          />
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
              <Route path="/movie/:id" component={MovieDetails} />
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
              <AuthenticatedRoute
                path="/explore/:page"
                component={() => <ExploreComponent filter={[this.genre, this.rating, this.year]} searchedMovies={this.state.searchedMovies} activeHeaderSection={this.state.activeHeaderSection} activateHeaderSection={this.activateHeaderSection} storeLastFilter={this.storeLastFilter}/>}
              />
              <AuthenticatedRoute
                path="/favorites"
                component={() => <FavoritesComponent activeHeaderSection={this.state.activeHeaderSection} activateHeaderSection={this.activateHeaderSection}/>}
              />
            </Switch>
          </div>
          <FooterComponent />
        </>
      </Router>
    );
  }
}

export default CineastApp;
