import React, { Component } from "react";
import { observable, computed, action } from "mobx";
import { observer, Provider } from "mobx-react";
import Browser from "./Browser.jsx";
import Value from "./Value.jsx";
import Panel from "./Panel.jsx";
import Dependencies from "./Dependencies.jsx";
import "./index.css";

export const BoxTypes = {
  ObservableValue: 'Observable',
  Computed: 'Computed',
  Reaction: 'Reaction',
  browser: 'browser',
};

export const StepType = {
  changeValue: 'changeValue',
  changeDerivationState: 'changeDerivationState',
  addDependency: 'addDependency',
  removeDependency: 'removeDependency',
  lookupValue: 'lookupValue',
};

export const makeBox = (obj) => observable({
  ...obj,
  x: obj.x || 0,
  y: obj.y || 0,
  width: obj.width || 130,
  height: obj.height || 130,
  dependencies: obj.dependencies ? obj.dependencies.slice() : [],
  cx: computed(function() { return this.x + this.width / 2 }),
  cy: computed(function() { return this.y + this.height / 2 }),
  xx: computed(function() { return this.x + this.width }),
  yy: computed(function() { return this.y + this.height }),
  leftSeg: computed(function() { return { x1: this.x, x2: this.x, y1: this.y, y2: this.yy } }),
  rightSeg: computed(function() { return { x1: this.xx, x2: this.xx, y1: this.y, y2: this.yy } }),
  topSeg: computed(function() { return { x1: this.x, x2: this.xx, y1: this.y, y2: this.y } }),
  bottomSeg: computed(function() { return { x1: this.x, x2: this.xx, y1: this.yy, y2: this.yy } }),
});

export class DepsVisStore {

  @observable boxes;
  @observable $nextSteps = [];
  @observable $prevSteps = [];

  layoutFrameWidth = 920;

  layoutFrameHeight = 500;

  constructor(boxesMap, nextSteps) {
    this.boxes = boxesMap;
    this.$nextSteps = nextSteps;
  }

  @observable lastShownStep;

  $applyStep(step) {
    this.lastShownStep = step;
    const { key, val } = step;
    const box = this.boxes[step.key];
    switch (step.type) {
      case StepType.changeValue: {
        const oldVal = box.val;
        box.val = val;
        return { type: StepType.changeValue, key, val: oldVal };
      }
      case StepType.changeDerivationState: {
        const oldVal = box.derivationState;
        box.derivationState = val;
        return { type: StepType.changeDerivationState, key, val: oldVal };
      }
      case StepType.addDependency: {
        box.dependencies.push(val);
        return { type: StepType.removeDependency, key, val };
      }
      case StepType.removeDependency: {
        this.boxes[step.key].dependencies = this.boxes[step.key].dependencies.filter(a => a !== val);
        return { type: StepType.addDependency, key, val };
      }
      case StepType.lookupValue: {
        return { type: StepType.lookupValue, key: val, val: key };
      }
    }
  }

  @action nextStep() {
    if (this.$nextSteps.length > 0) {
      this.$prevSteps.unshift(this.$applyStep(this.$nextSteps[0]));
      this.$nextSteps.splice(0, 1);
    }
  }

  @action prevStep() {
    if (this.$prevSteps.length > 0) {
      this.$nextSteps.unshift(this.$applyStep(this.$prevSteps[0]));
      this.$prevSteps.splice(0, 1);
    }
  }

  @action reset() {
    while(this.$prevSteps.length) {
      this.prevStep();
    }
  }
}

@observer
class Box extends Component {

  renderContent(box, animateValueTo) {
    switch (box.type) {
      case BoxTypes.Reaction:
        if (box.kind === 'browser') {
          return <Browser val={box.val} />
        }
        return (
          <div>
            <div className="DV__box__type">{box.title}</div>
            <Value val={box.val} className="DV__box__text-val" animateTo={animateValueTo} />
          </div>
        )
      default:
        return (
          <div>
            <div className="DV__box__type">{box.title}</div>
            {box.val !== undefined &&
              <Value val={box.val} className="DV__box__round-val" animateTo={animateValueTo} />
            }
          </div>
        );
    }
  }

  render() {
    const { box, animateValueTo } = this.props;

    return (
      <div
        className={`DV__box DV__box--type-${box.type} DV__box--kind-${box.kind}`}
        style={{ left: box.x, top: box.y, width: box.width, height: box.height }}
        onMouseUp={() => { box.dragged = false; }}
        onMouseDown={e => {
          const startX = box.x - e.clientX;
          const startY = box.y - e.clientY;
          const onMove = e => {
            box.x = startX + e.clientX;
            box.y = startY + e.clientY;
          };
          const onMouseUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onMouseUp)
          };
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onMouseUp)
        }}
      >
        {this.renderContent(box, animateValueTo)}
        {box.derivationState &&
          <div className={`DV__box__derivation-state DV__box__derivation-state--${box.derivationState.replace(/\s/g, '-')}`}>
            {box.derivationState}
          </div>
        }
      </div>
    );

  }
}

@observer
export default class DerivationsVisualisation extends Component {

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = e => {
    switch(e.keyCode) {
      case 40: return this.props.store.nextStep(); // down
      case 38: return this.props.store.prevStep(); // up
      case 82: return this.props.store.reset(); // r
    }
  };

  render() {
    const { boxes, layoutFrameWidth, layoutFrameHeight, lastShownStep } = this.props.store;
    return (
      <div className="DV">
        <Panel store={this.props.store} />
        <div className="DV__body" style={{ width: layoutFrameWidth, height: layoutFrameHeight }}>
          {Object.keys(boxes).map(key => {
            const animateValueTo = lastShownStep
              && lastShownStep.type === StepType.lookupValue
              && lastShownStep.val === key
              && boxes[lastShownStep.key];

            return (
              <Box
                key={key}
                boxKey={key}
                box={boxes[key]}
                animateValueTo={animateValueTo}
                lastShownStep={lastShownStep}
              />
            );
          })}
          <Dependencies store={this.props.store} />
        </div>
      </div>
    );
  }
}
