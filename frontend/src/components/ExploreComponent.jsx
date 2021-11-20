import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import { withRouter } from "react-router";

import "./ExploreComponent.css";
import MovieCardWrapperComponent from "./MovieCardWrapperComponent.jsx";
import explore from "../../static/images/explore.jpg";

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
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.getNumOfPages = this.getNumOfPages.bind(this);
    this.loadMovies = this.loadMovies.bind(this);
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
  }
  render() {
    console.log("MOVIES LENGTH : " + this.state.movies.length);
    return (
      <div>
        <div className="container" style={{minHeight: "90vh"}}>
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
            <div className="start-searching" style={{ marginBottom: "3rem"}}>Start searching favorite movies to explore suggestions...</div>
          </div>
        )}
        {this.state.movies.length !== 0 && <div>
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
        </div>}
      </div>
    );
  }
}

export default withRouter(ExploreComponent);
