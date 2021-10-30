import React, { Component } from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import "./HeaderComponent.css";

class HeaderComponent extends Component {
    render() {
      return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light navbar-custom py-3">
            <div className="container-fluid">
              <div className="navbar-header">
                <a
                  href="/#"
                  className="navbar-brand navbar-brand-custom"
                  style={{ color: "white" }}
                >
                  CINEAST
                </a>
              </div>
              <ul className="nav navbar-nav navbar-right ms-3">
                <li className="nav-item">
                  <a className="nav-link active" href="/#">
                    <AccountCircleIcon style={{color: "white"}}/>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      );
    }
  }
  
  export default HeaderComponent;