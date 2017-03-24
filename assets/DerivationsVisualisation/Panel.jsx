import React, { Component } from "react";
import { observer } from "mobx-react";

@observer
export default class Panel extends Component {
  render() {
    return (
      <div className="Panel">
        <div className="Panel__item">
          {this.props.store.status &&
            <div>
              <span className="Panel__label Panel__label--status">
                Status:
              </span>
              <span className="Panel__value Panel__value--status Panel__value--status-idle">
                Idle
              </span>
            </div>
          }
        </div>
      </div>
    );
  }
}
