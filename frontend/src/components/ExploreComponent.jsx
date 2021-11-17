import React, { Component } from "react";
import ReactPaginate from "react-paginate";

import "./ExploreComponent.css";
import MovieCardWrapperComponent from "./MovieCardWrapperComponent.jsx";

class ExploreComponent extends Component {
  isMounted = false;
  numPages = 0;
  constructor(props) {
    super(props);
    this.state = {
      movies: (this.props.searchedMovies.length !== 0) ? this.props.searchedMovies : [],
      searching: (this.props.searchedMovies.length !== 0) ? true : false
    };
    this.handleChangePage = this.handleChangePage.bind(this);
    this.getNumOfPages = this.getNumOfPages.bind(this);
    this.getNumOfPages();
  }
  componentDidMount() {
    if (this.props.activeHeaderSection !== "explore") {
      this.props.activateHeaderSection("explore");
    }
    console.log("lengthhhhhhh" + this.props.searchedMovies.length)
    if(this.props.searchedMovies.length === 0) this.handleChangePage({ selected: 0 });
    this.isMounted = true;
  }
  componentWillUnmount() {
    if (this.props.activeHeaderSection !== undefined) {
      this.props.activateHeaderSection(undefined);
    }
    this.isMounted = false;
  }
  handleChangePage(data) {
    const pageNumber = data.selected + 1;
    console.log("handleChangePage");
    fetch(`http://localhost:8000/api/explore/${pageNumber}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (this.isMounted) {
          this.setState(() => {
            return { movies: data };
          });
        }
      });
  }
  getNumOfPages() {
    fetch("http://localhost:8000/api/explore/pages")
    .then(resp => resp.json())
    .then(data => this.numPages = data)
  }
  render() {
    return (
      <div>
        <div className="container">
          {this.state.movies.length !== 0 && (
            <div className="row" style={{ alignItems: "center" }}>
              {this.state.movies.map((movie, i) => {
                return (
                  <div className="col" key={movie.id}>
                    <MovieCardWrapperComponent movie_id={movie.id} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div>
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={this.numPages}
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
          />
        </div>
      </div>
    );
  }
}

export default ExploreComponent;
