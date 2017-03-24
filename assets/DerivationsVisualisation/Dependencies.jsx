import React, {Component} from "react";
import {observer} from "mobx-react";
import { BoxTypes } from './index.jsx';

function segsIntersection(line1, line2) {
  const A1 = line1.y2 - line1.y1;
  const B1 = line1.x1 - line1.x2;
  const A2 = line2.y2 - line2.y1;
  const B2 = line2.x1 - line2.x2;
  const delta = A1 * B2 - A2 * B1;
  if (delta == 0) return null;
  const C2 = A2 * line2.x1 + B2 * line2.y1;
  const C1 = A1 * line1.x1 + B1 * line1.y1;
  const invdelta = 1 / delta;
  return { x: (B2 * C1 - B1 * C2) * invdelta, y: (A1 * C2 - A2 * C1) * invdelta };
}

function getVectorFromBoxes(fromBox, toBox) {

  const line = {
    x1: (fromBox.cx),
    y1: (fromBox.cy),
    x2: (toBox.cx),
    y2: (toBox.cy),
  };

  let slope = 180 * Math.atan2(line.y2 - line.y1, line.x2 - line.x1) / Math.PI;

  switch (slope) {
    case 45: return { x1: fromBox.xx, y1: fromBox.yy, x2: toBox.x, y2: toBox.y };
    case -135: return { x1: fromBox.x, y1: fromBox.y, x2: toBox.xx, y2: toBox.yy };
    case 135: return { x1: fromBox.x, y1: fromBox.yy, x2: toBox.xx, y2: toBox.y };
    case -45: return { x1: fromBox.xx, y1: fromBox.y, x2: toBox.x, y2: toBox.yy };
  }
  let p1;
  let p2;
  if (slope > 135 || slope < -135) { // rtl
    p1 = segsIntersection(line, fromBox.leftSeg);
    p2 = segsIntersection(line, toBox.rightSeg);
  } else if (slope > -45 && slope < 45) { // ltr
    p1 = segsIntersection(line, fromBox.rightSeg);
    p2 = segsIntersection(line, toBox.leftSeg);
  } else if (slope < 0) { // btt
    p1 = segsIntersection(line, fromBox.topSeg);
    p2 = segsIntersection(line, toBox.bottomSeg);
  } else { // ttb
    p1 = segsIntersection(line, fromBox.bottomSeg);
    p2 = segsIntersection(line, toBox.topSeg);
  }
  if (p1 && p2) {
    return { x1: p1.x, x2: p2.x, y1: p1.y, y2: p2.y };
  } else {
    return line;
  }
}


@observer
class Arrow extends Component {

  $uid = Math.random().toString(32).slice(2);

  render() {
    const { fromBox, toBox, dashed } = this.props;
    let { x1, x2, y1, y2 } = getVectorFromBoxes(fromBox, toBox);

    const color = dashed ? 'silver' : 'black';
    const maxX = Math.max(x1, x2);
    const minX = Math.min(x1, x2);
    const maxY = Math.max(y1, y2);
    const minY = Math.min(y1, y2);
    const width = maxX - minX + 20;
    const height = maxY - minY + 20;
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    x1 -= minX - 10;
    x2 -= minX - 10;
    y1 -= minY - 10;
    y2 -= minY - 10;

    return (
      <div style={{position: 'absolute', top: minY - 10, left: minX - 10, width, height }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
      >
        <defs>
          <marker
            id={`${this.$uid}-arrowhead`}
            viewBox="0 0 10 10"
            refX="3"
            refY="5"
            markerWidth="0"
            markerHeight="6"
            orient="auto"
          >
            <animate
              attributeName="markerWidth"
              from="0"
              to="6"
              dur="0.3s"
              begin="0.5s"
              fill="freeze"
            />
            <path d="M 0 0 L 10 5 L 0 10 z">
            </path>
          </marker>
        </defs>
        <path
          d={`M${x1},${y1} ${x2},${y2}`}
          stroke={color}
          strokeWidth="2"
          strokeDasharray={dashed ? 5 : length}
          strokeDashoffset={dashed ? 5 : length}
          markerEnd={dashed ? undefined : `url(#${this.$uid}-arrowhead)`}
        >
          {!dashed &&
            <animate
              attributeName="stroke-dashoffset"
              from={length}
              to="0"
              dur="0.5s"
              begin="0s"
              fill="freeze"
            />
          }
        </path>
      </svg>
      </div>
    );
  }
}

@observer
export default class Dependencies extends Component {

  render() {
    const { boxes, layoutFrameHeight, layoutFrameWidth } = this.props.store;
    const depBoxes = Object.keys(boxes).filter(key => boxes[key].dependencies.length > 0);
    if (depBoxes.length === 0) return null;
    return (
      <div className="Dependencies">
        {depBoxes.map(key => {
          const box = boxes[key];
          return (
            <div key={key}>
              {box.dependencies.map(depKey =>
                <Arrow
                  key={depKey}
                  fromBox={box}
                  toBox={boxes[depKey]}
                  dashed={boxes[depKey].type === BoxTypes.Reaction}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
