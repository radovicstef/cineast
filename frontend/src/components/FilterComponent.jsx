import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { Component } from "react";

import "./FilterComponent.css";

class FilterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      [this.props.type]: this.props.default,
    };
    this.changeSelectedFilter = this.changeSelectedFilter.bind(this);
  }
  changeSelectedFilter(event) {
    this.setState(() => {
      return { [event.target.name]: event.target.value };
    });
    this.props.updateFilter(event.target.value);
  }
  render() {
    return (
      <div>
        <FormControl fullWidth>
          <InputLabel style={{ color: "white" }} id="demo-simple-select-label">
            {this.props.type}
          </InputLabel>
          <Select
            label={this.props.type}
            name={this.props.type}
            value={this.state[this.props.type]}
            onChange={this.changeSelectedFilter}
            className="filter-select"
            classes={{
              icon: "filter-select",
              underline: "filter-select"
            }}
          >
            {this.props.values.map((value) => {
              return <MenuItem value={value}>{value}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </div>
    );
  }
}

export default FilterComponent;
