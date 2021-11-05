import React, { Component } from "react";
import MovieCardComponent from "./MovieCardComponent.jsx";
import Carousel from "react-material-ui-carousel";

class TrendingMoviesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      cardNum: 4,
    };
    this.handleResize = this.handleResize.bind(this);
    this.renderSlides = this.renderSlides.bind(this);
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  componentDidMount() {
    console.log("here");
    fetch("http://localhost:8000/api/trending_movies")
      .then((reply) => reply.json())
      .then((reply) => {
        this.setState(() => {
          return { movies: reply };
        });
      });
  }
  handleResize() {
    if (window.innerWidth < 600) {
      this.setState(() => {
        return { cardNum: 1 };
      });
    }
    else if (window.innerWidth > 600 && window.innerWidth < 900) {
      this.setState(() => {
        return { cardNum: 2 };
      });
    }
    else if (window.innerWidth > 900 && window.innerWidth < 1200) {
      this.setState(() => {
        return { cardNum: 3 };
      });
    }
    else if (window.innerWidth > 1200) {
      this.setState(() => {
        return { cardNum: 4 };
      });
    }
  }
  renderSlides() {
    let content = [];
    let index_begin = 0;
    let index_end = this.state.cardNum;
    for (var i = 0; i < this.state.movies.length / this.state.cardNum; i++) {
      content.push(
        <div key={i} style={{ display: "flex", justifyContent: "center" }}>
          {this.state.movies.slice(index_begin, index_end).map((item, i) => {
            return (
              <MovieCardComponent
                key={i}
                title={item.title}
                poster_path={item.poster_path}
                rating={item.vote_average}
                genres={item.genres}
                year={item.year}
                overview={item.overview}
                id={item.id}
              />
            );
          })}
        </div>
      );
      index_begin = index_begin + this.state.cardNum;
      index_end = index_end + this.state.cardNum;
    }
    return content;
  }
  render() {
    return (
      <div>
        {this.state.movies.length === 0 && (<div style={{padding: "3rem"}}><img src="./static/images/processing.gif" style={{width: "10rem"}}/></div>)}
        {this.state.movies.length !== 0 && <div><h3 style={{fontWeight: "bold", fontSize: "1.2rem", color: "#182D3A"}}>Popular movies</h3></div>}
        {this.state.movies.length !== 0 && (
          <div style={{marginBottom: "3rem"}}>
            <Carousel>{this.renderSlides()}</Carousel>
          </div>
        )}
      </div>
    );
  }
}

export default TrendingMoviesComponent;
