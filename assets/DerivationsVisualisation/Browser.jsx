import React, { Component } from "react";
import { observer } from "mobx-react";
import animaze from "animaze";

@observer
export default class DerivationsVisualisation extends Component {

  state = {
    animating: false,
    prevValAnimating: undefined,
    nextValAnimating: undefined,
  };

  componentDidUpdate(prevProps) {
    const { browserEl, nextEl } = this.refs;
    if (this.props.val !== prevProps.val) {
      this.animation = (this.animation || Promise.resolve())
        .then(() => new Promise(resolve => this.setState({ prevValAnimating: prevProps.val, nextValAnimating: this.props.val, animating: true }, resolve)))
        .then(() => animaze({
          tick: v => { if (this.refs.browserEl) {
            nextEl.style.maxHeight = `${100 * v}%`;
            let scale = 1;
            let sv = v < 0.5 ? (v * 2) : 1 - (v - 0.5) * 2;
            browserEl.style.transform = `scale(${1 + 0.2 * sv})`;
          }},
          duration: 800,
        }))
        .then(() => new Promise(resolve => this.setState({ prevValAnimating: undefined, nextValAnimating: undefined, animating: false }, resolve)));
    }
  }

  render() {
    const animating = this.state.animating;
    return (
      <div className="DV__browser" ref="browserEl">
        {animating &&
          <div className="DV__browser__content">
            {this.state.prevValAnimating}
          </div>
        }
        <div className={`DV__browser__content ${animating ? 'DV__browser__content--animating' : ''}`} ref="nextEl">
          {animating ? this.state.nextValAnimating : this.props.val}
        </div>
      </div>
    );
  }
}
