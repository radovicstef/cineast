import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

class ChartBudget extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    dataDought: {
      labels: ["Budget", "Revenue"],
      datasets: [
        {
          data: [this.props.budget, this.props.revenue],
          backgroundColor: ["rgba(255, 195, 0, 0.6)", "rgba(198, 84, 73, 0.6)"],
          hoverBackgroundColor: [
            "rgba(255, 195, 0, 0.3)",
            "rgba(198, 84, 73, 0.3)",
          ],
        },
      ],
    },
  };
  render() {
    return (
      <MDBContainer>
        <Doughnut
          data={this.state.dataDought}
          options={{
            responsive: false,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  color: "white",
                  font: { family: "Trebuchet MS"},
                },
              },
            },
            elements: { arc: { borderWidth: 0 } },
          }}
        />
      </MDBContainer>
    );
  }
}

export default ChartBudget;
