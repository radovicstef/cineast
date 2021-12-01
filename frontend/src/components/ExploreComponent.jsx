import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router";

import "./ExploreComponent.css";
import MovieCardWrapperComponent from "./MovieCardWrapperComponent.jsx";
import explore from "../../static/images/explore.jpg";
import FilterComponent from "./FilterComponent.jsx";
import TuneIcon from '@material-ui/icons/Tune';

class ExploreComponent extends Component {
  isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      movies:
        this.props.searchedMovies.length !== 0 ? this.props.searchedMovies : [],
      searching: this.props.searchedMovies.length !== 0 ? true : false,
      numPages: 0,
      pageNumber: 1,
      genre: "All",
      rating: "All",
      year: "All",
    };
    this.filterMovies = this.filterMovies.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.getNumOfPages = this.getNumOfPages.bind(this);
    this.loadMovies = this.loadMovies.bind(this);
    this.changeGenre = this.changeGenre.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.changeYear = this.changeYear.bind(this);
    this.filterMovies = this.filterMovies.bind(this);
  }
  componentDidMount() {
    this.getNumOfPages();
    if (this.props.activeHeaderSection !== "explore") {
      this.props.activateHeaderSection("explore");
    }
    console.log("lengthhhhhhh" + this.props.searchedMovies.length);
    this.isMounted = true;
    this.loadMovies(this.props.match.params.page);
  }
  componentWillUnmount() {
    if (this.props.activeHeaderSection !== undefined) {
      this.props.activateHeaderSection(undefined);
    }
    this.isMounted = false;
  }
  handleChangePage(data) {
    const pageNumber = data.selected + 1;
    this.setState(() => {
      return { pageNumber: pageNumber };
    });
    console.log("handleChangePage");
    this.props.history.push(`/explore/${pageNumber}`);
    this.loadMovies(pageNumber);
  }
  filterMovies() {
    console.log(
      this.state.genre + " " + this.state.year + " " + this.state.rating
    );
    fetch(
      `http://localhost:8000/api/filter/${this.state.genre}/${this.state.rating}/${this.state.year}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        this.loadMovies(1);
        this.handleChangePage({ selected: 0 });
      });
  }
  getNumOfPages() {
    fetch("http://localhost:8000/api/explore/pages")
      .then((resp) => resp.json())
      .then((data) =>
        this.setState(() => {
          return { numPages: data };
        })
      );
  }
  loadMovies(pageNumber) {
    console.log("LOAD MOVIES");
    if (this.props.searchedMovies.length === 0) {
      console.log("LINK: " + `http://localhost:8000/api/explore/${pageNumber}`);
      fetch(`http://localhost:8000/api/explore/${pageNumber}`)
        .then((resp) => resp.json())
        .then((data) => {
          if (this.isMounted) {
            this.setState(() => {
              return { movies: data };
            });
          }
        });
    } //this.handleChangePage({ selected: 0 });
    this.getNumOfPages();
  }
  changeGenre(genreValue) {
    this.setState(() => {
      return { genre: genreValue };
    });
  }
  changeYear(yearValue) {
    this.setState(() => {
      return { year: yearValue };
    });
  }
  changeRating(ratingValue) {
    this.setState(() => {
      return { rating: ratingValue };
    });
  }
  render() {
    console.log("MOVIES LENGTH : " + this.state.movies.length);
    return (
      <div>
        {this.state.movies.length !== 0 && <div
          className="filter"
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            paddingTop: "0.5rem",
            paddingBottom: "1rem",
            marginBottom: "0.2rem",
            paddingLeft: "25%",
            paddingRight: "25%",
            float: "left",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FilterComponent
            updateFilter={this.changeGenre}
            type="Genre"
            className="filter-component"
            values={[
              "All",
              "Action",
              "Adventure",
              "Animation",
              "Biography",
              "Crime",
              "Comedy",
              "Crime",
              "Documentary",
              "Drama",
              "Family",
              "Science Fiction",
              "History",
              "Horror",
              "Mistery",
              "Romance",
              "Thriller",
            ]}
            default="All"
          />
          <FilterComponent
            updateFilter={this.changeRating}
            type="Rating"
            values={["All", "5+", "7+", "9+"]}
            default="All"
          />
          <FilterComponent
            updateFilter={this.changeYear}
            type="Year"
            values={["All", "1950-1990", "1990-2000", "2000-2010", "2010-2021"]}
            default="All"
          />
          <button onClick={this.filterMovies} className="btn btn-secondary">
            <TuneIcon/>
          </button>
        </div>}
        <div>
          <div className="container" style={{ minHeight: "90vh" }}>
            {this.state.movies.length !== 0 && (
              <div className="row" style={{ alignItems: "center" }}>
                {this.state.movies.map((movie, i) => {
                  return (
                    <div className="col" key={movie.id}>
                      <MovieCardWrapperComponent
                        loadMovies={this.loadMovies}
                        pageNumber={this.state.pageNumber}
                        movie_id={movie.id}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {this.state.movies.length === 0 && (
            <div>
              <img style={{ marginTop: "3rem", width: "50%" }} src={explore} />
              <div className="start-searching" style={{ marginBottom: "3rem" }}>
                Start searching favorite movies to explore suggestions...
              </div>
            </div>
          )}
          {this.state.movies.length !== 0 && !this.state.searching && (
            <div>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={this.state.numPages}
                marginPagesDisplayed={2}
                onPageChange={this.handleChangePage}
                containerClassName="pagination justify-content-center"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
                forcePage={this.props.match.params.page - 1}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(ExploreComponent);
