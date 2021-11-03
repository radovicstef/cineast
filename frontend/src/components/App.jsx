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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.finishLoading = this.finishLoading.bind(this);
  }
  finishLoading() {
    this.setState(() => {
      return { loading: false };
    });
  }
  render() {
    console.log("rendering");
    return (
      <Router>
        <HeaderComponent />
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
            <Route path="/login">
              <LoginComponent />
            </Route>
          </Switch>
        </div>
        <FooterComponent />
      </Router>
    );
  }
}

export default App;
