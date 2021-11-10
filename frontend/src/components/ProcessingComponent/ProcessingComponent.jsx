import React, {Component} from "react";

import "./ProcessingComponent.css";

class ProcessingComponent extends Component {
    render() {
        return(
            <div style={{width: "100%", height: "90%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor:"#aa413e"}}>
                <p className="cineast" data-fill-text="CINEAST">CINEAST</p>
            </div>
        )
    }
}

export default ProcessingComponent;