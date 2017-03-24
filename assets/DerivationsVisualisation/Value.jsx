import React, { Component } from "react";
import { observer } from "mobx-react";
import animaze from "animaze";

@observer
export default class Value extends Component {

  state = {
    displayValue: undefined,
  };

  componentDidUpdate(prevProps, prevState) {
    const { containerEl } = this.refs;
    const { val, animateTo } = this.props;

    if (containerEl && this.props.val !== prevProps.val) {
      this.animation = (this.animation || Promise.resolve())
        .then(() => new Promise(resolve => this.setState({ displayValue: prevProps.val }, resolve)))
        .then(() => animaze({
          tick: v => { containerEl.style.transform = `scale(${1 + 0.2 * v})` },
          duration: 300,
        }))
        .then(() => new Promise(resolve => this.setState({ displayValue: undefined }, resolve)))
        .then(() => animaze({
          tick: v => { containerEl.style.transform = `scale(${1 + 0.2 * (1 - v)})` },
          duration: 300,
        }));
    }

    if (containerEl && animateTo && animateTo !== prevProps.animateTo) {
      this.animation = (this.animation || Promise.resolve())
        .then(() => new Promise(resolve => {
          const containerElClone = containerEl.cloneNode(true);
          const originalRect = containerEl.getBoundingClientRect();
          const offsetRect = containerEl.offsetParent.offsetParent.getBoundingClientRect();
          containerElClone.style.opacity = 0.5;
          containerElClone.style.position = 'fixed';
          containerElClone.style.top = `${originalRect.top}px`;
          containerElClone.style.left = `${originalRect.left}px`;
          containerElClone.style.transition = `none 700ms ease`;
          containerElClone.style.transitionProperty = `left, top, transform, opacity`;
          containerElClone.style.margin = `0 0`;
          document.body.appendChild(containerElClone);
          setTimeout(() => {
            containerElClone.style.top = `${animateTo.cy + offsetRect.top - originalRect.height / 2}px`;
            containerElClone.style.left = `${animateTo.cx + offsetRect.left - originalRect.width / 2}px`;
            resolve(containerElClone);
          }, 0);
        }))
        .then(containerElClone => new Promise(resolve => {
          setTimeout(() => {
            containerElClone.style.transform = `scale(1.3)`;
            containerElClone.style.opacity = 0;
            resolve(containerElClone);
          }, 700);
        }))
        .then(containerElClone => new Promise(resolve => {
          setTimeout(() => {
            if (containerElClone.parentNode) {
              containerElClone.parentNode.removeChild(containerElClone);
            }
            resolve();
          }, 1200);
        }))
      }
  }

  render() {
    return (
      <div>
        <div className={this.props.className} ref="containerEl">
          {this.state.displayValue !== undefined ? this.state.displayValue : this.props.val}
        </div>
      </div>
    );
  }
}
