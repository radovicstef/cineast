import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router";

import "./ExploreComponent.css";
import "../ExploreComponent/ExploreComponent.jsx";
import MovieCardWrapperComponent from "../MovieCard/MovieCardWrapperComponent.jsx";
import explore from "../../../static/images/explore.jpg";
import FilterComponent from "../FilterComponent/FilterComponent.jsx";
import TuneIcon from "@material-ui/icons/Tune";

import processingGif from "../../../static/images/processing.gif";
import { IP_ADDR, PORT } from "../../constants";

class ExploreComponent extends Component {
  isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      imageReady: false,
      loading: this.props.searchedMovies.length !== 0 ? false : true,
      movies:
        this.props.searchedMovies.length !== 0 ? this.props.searchedMovies : [],
      searching: this.props.searchedMovies.length !== 0 ? true : false,
      numPages: 0,
      pageNumber: 1,
    };

    this.genre = this.props.filter[0];
    this.rating = this.props.filter[1];
    this.year = this.props.filter[2];

    const image = new Image();
    image.onload = () => {
      this.setState(() => {
        return {
          imageReady: true,
        };
      });
    };
    image.src = processingGif;

    this.filterMovies = this.filterMovies.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.getNumOfPages = this.getNumOfPages.bind(this);
    this.loadMovies = this.loadMovies.bind(this);
    this.changeGenre = this.changeGenre.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.changeYear = this.changeYear.bind(this);
  }
  componentDidMount() {
    this.getNumOfPages();
    this.filterMovies(this.props.match.params.page);
    if (this.props.activeHeaderSection !== "explore") {
      this.props.activateHeaderSection("explore");
    }
    this.isMounted = true;
  }
  componentWillUnmount() {
    this.props.storeLastFilter(this.genre, this.rating, this.year);
    if (this.props.activeHeaderSection !== undefined) {
      this.props.activateHeaderSection(undefined);
    }
    this.isMounted = false;
  }
  //handleChangePage(data) is automatically triggered by changing page using page pagination bar
  //data will be passed as selected page number - 1 in form {selected: pageNumber-1}
  handleChangePage(data) {
    window.scrollTo(0, 0);
    const pageNumber = data.selected + 1;
    this.setState(() => {
      return { pageNumber: pageNumber };
    });
    this.props.history.push(`/explore/${pageNumber}`);
    //loads movies for specified page
    this.loadMovies(pageNumber);
  }
  //Filters the movies based on the current filter and calls handleChangePage(pageNumber-1) method
  //By default, pageNumber is 1
  filterMovies(pageNumber=1) {
    fetch(
      `http://${IP_ADDR}:${PORT}/api/filter/${this.genre}/${this.rating}/${this.year}`
    )
      .then((resp) => resp.json())
      .then((data) => {
        this.handleChangePage({ selected: pageNumber-1 });
      });
  }
  getNumOfPages() {
    fetch(`http://${IP_ADDR}:${PORT}/api/explore/pages`)
      .then((resp) => resp.json())
      .then((data) =>
        this.setState(() => {
          return { numPages: data };
        })
      );
  }
  loadMovies(pageNumber) {
    //if searching is active movies will not be loaded
    if (this.props.searchedMovies.length === 0) {
      this.setState(() => {
        return {
          loading: true,
        };
      });
      fetch(`http://${IP_ADDR}:${PORT}/api/explore/${pageNumber}`)
        .then((resp) => resp.json())
        .then((data) => {
          if (this.isMounted) {
            this.setState(() => {
              return { movies: data, loading: false };
            });
          }
        })
        .catch((error) => {
          this.setState(() => {
            return {
              movies: [],
              loading: false,
            };
          });
        });
    } //this.handleChangePage({ selected: 0 });
    this.getNumOfPages();
  }
  changeGenre(genreValue) {
    this.genre = genreValue;
    this.props.storeLastFilter(this.genre, this.rating, this.year);
  }
  changeYear(yearValue) {
    this.year = yearValue;
    this.props.storeLastFilter(this.genre, this.rating, this.year);
  }
  changeRating(ratingValue) {
    this.rating = ratingValue;
    this.props.storeLastFilter(this.genre, this.rating, this.year);
  }
  render() {
    return (
      <div>
        {this.state.searching && (
          <div style={{ width: "100%", paddingBottom: "2.5rem" }}></div>
        )}
        {!this.state.searching && this.state.movies.length !== 0 && (
          <div
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
              default={this.props.filter[0]}
            />
            <FilterComponent
              updateFilter={this.changeRating}
              type="Rating"
              values={["All", "5+", "7+", "9+"]}
              default={this.props.filter[1]}
            />
            <FilterComponent
              updateFilter={this.changeYear}
              type="Year"
              values={[
                "All",
                "1950-1990",
                "1990-2000",
                "2000-2010",
                "2010-2021",
              ]}
              default={this.props.filter[2]}
            />
            <button onClick={() => {this.filterMovies(1)}} className="btn btn-secondary">
              <TuneIcon />
            </button>
          </div>
        )}
        <div>
          {this.state.movies.length !== 0 && (
            <div className="container" style={{ minHeight: "90vh" }}>
              <div className="row" style={{ alignItems: "center" }}>
                {this.state.movies.map((movie, i) => {
                  return (
                    <div className="col" key={movie.id}>
                      <MovieCardWrapperComponent
                        loadMovies={this.filterMovies}
                        pageNumber={this.state.pageNumber}
                        movie_id={movie.id}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {this.state.loading && !this.state.imageReady && (
            <div style={{ width: "100%", height: "90%" }}></div>
          )}
          {this.state.loading && this.state.imageReady && (
            <div style={{ padding: "7rem", width: "100%", height: "90%" }}>
              <img
                src={processingGif}
                style={{ width: "20rem" }}
                alt="processing..."
              />
            </div>
          )}
          {!this.state.loading && this.state.movies.length === 0 && (
            <div>
              <img style={{ marginTop: "3rem", width: "50%" }} src={explore} />
              <div className="start-searching" style={{ marginBottom: "3rem" }}>
                {!this.state.searching &&
                  "Start searching favorite movies to explore suggestions..."}
                {this.state.searching && "No movie found..."}
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
