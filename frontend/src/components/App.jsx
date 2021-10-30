import React, { Component } from "react";
import "../../static/css/index.css";
import HeaderComponent from "./HeaderComponent.jsx";
import TrendingMoviesComponent from "./TrendingMoviesComponent.jsx";


class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <HeaderComponent/>
        <TrendingMoviesComponent/>
      </div>
    );
  }
}

export default App;
