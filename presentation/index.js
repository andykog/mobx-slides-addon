import React from "react";
import {
  Appear, BlockQuote, Cite, Code, CodePane, Deck, Fill, Heading, Image, Layout, Link, ListItem,
  List, Markdown, Quote, Slide, Spectacle, Text,
} from "spectacle";
import CodeSlide from 'spectacle-code-slide';
import preloader from "spectacle/lib/utils/preloader";
import createTheme from "spectacle/lib/themes/default";
import DerivationsVisualisation, { StepType, BoxTypes, makeBox, DepsVisStore } from "../assets/DerivationsVisualisation/index.jsx";
import { ColorsListReact } from "../assets/perf/ColorsListReact.jsx";
import { ColorsListRedux } from "../assets/perf/ColorsListRedux.jsx";
import { ColorsListMobx } from "../assets/perf/ColorsListMobx.jsx";
import { ColorsListVue } from "../assets/perf/ColorsListVue.jsx";
import { Charts } from "../assets/perf/Charts.jsx";
import TodoMVCRedux from "../assets/perf/TodoMVCRedux/index.js";
import TodoMVCMobX from "../assets/perf/TodoMVCMobX/index.jsx";
import TodoMVCVue from "../assets/perf/TodoMVCVue/index.jsx";
import 'normalize.css'
import 'spectacle/lib/themes/default/index.css'

localStorage.clear()

const images = {
};

preloader(images);

const theme = createTheme({
  primary: "white",
  secondary: "#2d2d2d",
  tertiary: "#cc563f",
  quartenary: "#d8624c",
}, {
  primary: "Montserrat",
  secondary: "Helvetica"
});

CodeSlide.defaultProps = CodeSlide.defaultProps || {};
CodeSlide.defaultProps.transition = ['fade'];
CodeSlide.defaultProps.lang = 'js';

const reaction1 = new DepsVisStore(
  {
    message: makeBox({ title: "message", x: 0, y: 0, val: 'hello', type: BoxTypes.ObservableValue }),
    visible: makeBox({ title: "visible", x: 150, y: 0, val: 'true', type: BoxTypes.ObservableValue }),
    observer: makeBox({ x: 300, y: 150, val: undefined, width: 172, height: 172, type: BoxTypes.Reaction, kind: 'browser' }),
  },
  [
    { type: StepType.addDependency, key: 'observer', val: 'visible' },
    { type: StepType.lookupValue, key: 'observer', val: 'visible' },
    { type: StepType.addDependency, key: 'observer', val: 'message' },
    { type: StepType.lookupValue, key: 'observer', val: 'message' },
    { type: StepType.changeValue, key: 'observer', val: 'hello' },
    { type: StepType.changeValue, key: 'visible', val: 'false' },
    { type: StepType.lookupValue, key: 'observer', val: 'visible' },
    { type: StepType.changeValue, key: 'observer', val: 'hidden' },
    { type: StepType.removeDependency, key: 'observer', val: 'message' },
  ]
);

const computed1 = new DepsVisStore(
  {
    message: makeBox({ title: "message", x: 0, y: 0, val: 'hello', type: BoxTypes.ObservableValue }),
    chars: makeBox({ title: "chars", x: 200, y: 20, val: undefined, type: BoxTypes.Computed }),
    observer: makeBox({ x: 300, y: 250, val: undefined, width: 172, height: 172, type: BoxTypes.Reaction, kind: 'browser' }),
  },
  [
    { type: StepType.addDependency, key: 'observer', val: 'message' },
    { type: StepType.lookupValue, key: 'observer', val: 'message' },
    { type: StepType.addDependency, key: 'observer', val: 'chars' },
    { type: StepType.addDependency, key: 'chars', val: 'message' },
    { type: StepType.lookupValue, key: 'chars', val: 'message' },
    { type: StepType.changeValue, key: 'chars', val: '5' },
    { type: StepType.lookupValue, key: 'observer', val: 'chars' },
    { type: StepType.changeValue, key: 'observer', val: 'hello (5)' },

    { type: StepType.changeValue, key: 'message', val: 'hi' },
    { type: StepType.lookupValue, key: 'observer', val: 'message' },
    { type: StepType.changeValue, key: 'observer', val: 'hi (5)' },
    { type: StepType.lookupValue, key: 'chars', val: 'message' },
    { type: StepType.changeValue, key: 'chars', val: '2' },
    { type: StepType.lookupValue, key: 'observer', val: 'chars' },
    { type: StepType.changeValue, key: 'observer', val: 'hi (2)' },
  ]
);

const computedFixed = new DepsVisStore(
  {
    message: makeBox({ title: "message", x: 0, y: 0, val: 'hello', type: BoxTypes.ObservableValue }),
    chars: makeBox({ title: "chars", x: 200, y: 20, val: '5', type: BoxTypes.Computed, dependencies: ['message'] }),
    observer: makeBox({ x: 300, y: 250, val: 'hello (5)', width: 172, height: 172, type: BoxTypes.Reaction, kind: 'browser', dependencies: ['message', 'chars'] }),
  },
  [
    { type: StepType.changeValue, key: 'message', val: 'hi' },
    { type: StepType.changeDerivationState, key: 'chars', val: 'stale' },
    { type: StepType.changeDerivationState, key: 'observer', val: 'stale' },
    { type: StepType.lookupValue, key: 'chars', val: 'message' },
    { type: StepType.changeValue, key: 'chars', val: '2' },
    { type: StepType.changeDerivationState, key: 'chars', val: 'up to date' },
    { type: StepType.lookupValue, key: 'observer', val: 'message' },
    { type: StepType.lookupValue, key: 'observer', val: 'chars' },
    { type: StepType.changeValue, key: 'observer', val: 'hi (2)' },
    { type: StepType.changeDerivationState, key: 'observer', val: 'up to date' },
  ]
);

const computedMaybeStale = new DepsVisStore(
  {
    a: makeBox({ title: "a", x: 0, y: 0, val: 2, type: BoxTypes.ObservableValue }),
    b: makeBox({ title: "b", x: 0, y: 200, val: 3, type: BoxTypes.ObservableValue }),
    sum: makeBox({ title: "sum", x: 200, y: 100, val: 5, type: BoxTypes.Computed, dependencies: ['a', 'b'] }),
    observer: makeBox({ x: 400, y: 79, val: '5', width: 172, height: 172, type: BoxTypes.Reaction, kind: 'browser', dependencies: ['sum'] }),
  },
  [
    { type: StepType.changeValue, key: 'a', val: '3' },
    { type: StepType.changeDerivationState, key: 'sum', val: 'stale' },
    { type: StepType.changeDerivationState, key: 'observer', val: 'maybe stale' },
    { type: StepType.changeValue, key: 'b', val: '2' },
    { type: StepType.lookupValue, key: 'sum', val: 'a' },
    { type: StepType.lookupValue, key: 'sum', val: 'b' },
    { type: StepType.changeDerivationState, key: 'sum', val: 'up to date' },
    { type: StepType.changeDerivationState, key: 'observer', val: 'up to date' },
  ]
);


export default class Presentation extends React.Component {

  render() {
    return (
      <Spectacle theme={theme}>

        <Deck transition={["fade", "slide"]}>
          <Slide>
            <Heading>MobX</Heading>
          </Slide>
          <CodeSlide
            code={
`const state = observable({
  message: 'hello',
  visible: true,
});

Greeting = observer(() => (
  <div>
    {state.visible ? state.message : 'hidden'}
  </div>
));
render(<Greeting />, document.body);
`
            }
            ranges={[
              { loc: [0, 4] },
              { loc: [5, 10] },
            ]}
          />
          <Slide><DerivationsVisualisation store={reaction1} /></Slide>
          <CodeSlide
            code={
`const state = observable({
  message: 'hello',
  chars: computed(function() {
    return this.message.length
  }),
});

Greeting = observer(() => (
  <div>
    {state.message} ({state.chars})
  </div>
));
render(<Greeting />, document.body);
`
            }
            ranges={[
              { loc: [0, 6] },
              { loc: [7, 12] },
            ]}
          />
          <Slide><DerivationsVisualisation store={computed1} /></Slide>
          <Slide><DerivationsVisualisation store={computedFixed} /></Slide>
          <CodeSlide
            code={
`const state = observable({
   a: 2,
   b: 3,
   sum: computed(function() {
     return this.a + this.b
   }),
});

Greeting = observer(() => (
  <div>{state.sum}</div>
));
render(<Greeting />, document.body);
`
            }
            ranges={[
              { loc: [0, 7] },
              { loc: [8, 11] },
            ]}
          />
          <Slide><DerivationsVisualisation store={computedMaybeStale} /></Slide>
          <Slide><ColorsListReact /></Slide>
          <Slide><ColorsListRedux /></Slide>
          <Slide><ColorsListMobx /></Slide>
          <Slide><ColorsListVue /></Slide>
          <Slide><Charts nameSpace="colorsList"/></Slide>
          <Slide><TodoMVCRedux /></Slide>
          <Slide><TodoMVCMobX /></Slide>
          <Slide><TodoMVCVue /></Slide>
          <Slide><Charts nameSpace="todos"/></Slide>
          <Slide>
            <Heading>End</Heading>
          </Slide>
        </Deck>
      </Spectacle>
    );
  }
}
