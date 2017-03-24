import React, {Component} from 'react';
import {BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar} from 'recharts';
import {getPerfResults} from './utils';

const mock = false && [{
  "groupKey": "colorsListReact",
  "subgroupKey": "add 10000 items (to 0)",
  "start": 21608.955,
  "syncEnd": 21610.025,
  "end": 21666.980000000003
}, {
  "groupKey": "colorsListReact",
  "subgroupKey": "reverse 10000 items",
  "start": 22777.655000000002,
  "syncEnd": 22777.755,
  "end": 22815.445
}, {
  "groupKey": "colorsListReact",
  "subgroupKey": "remove 10000 items (from 10000)",
  "start": 23428.880000000005,
  "syncEnd": 23428.955,
  "end": 23446.465000000004
}, {
  "groupKey": "colorsListRedux",
  "subgroupKey": "add 10000 items (to 0)",
  "start": 25543.660000000003,
  "syncEnd": 25549.575,
  "end": 26143.93
}, {
  "groupKey": "colorsListRedux",
  "subgroupKey": "reverse 10000 items",
  "start": 26959.815000000002,
  "syncEnd": 26969.86,
  "end": 26971.940000000002
}, {
  "groupKey": "colorsListRedux",
  "subgroupKey": "remove 10000 items (from 10000)",
  "start": 27696.08,
  "syncEnd": 27696.125000000004,
  "end": 27828.77
}, {
  "groupKey": "colorsListMobx",
  "subgroupKey": "add 10000 items (to 0)",
  "start": 30327.38,
  "syncEnd": 30417.21,
  "end": 31014.160000000003
}, {
  "groupKey": "colorsListMobx",
  "subgroupKey": "reverse 10000 items",
  "start": 31734.100000000002,
  "syncEnd": 31738.410000000003,
  "end": 32145.450000000004
}, {
  "groupKey": "colorsListMobx",
  "subgroupKey": "remove 10000 items (from 10000)",
  "start": 32718.515000000003,
  "syncEnd": 32718.585000000003,
  "end": 32842.41
}, {
  "groupKey": "colorsListVue",
  "subgroupKey": "add 10000 items (to 0)",
  "start": 34877.695,
  "syncEnd": 34922.21,
  "end": 35481.41
}, {
  "groupKey": "colorsListVue",
  "subgroupKey": "reverse 10000 items",
  "start": 36245.060000000005,
  "syncEnd": 36245.715000000004,
  "end": 36381.48500000001
}, {
  "groupKey": "colorsListVue",
  "subgroupKey": "remove 10000 items (from 10000)",
  "start": 37031.575000000004,
  "syncEnd": 37031.780000000006,
  "end": 37098.315
}]

const getData = (nameSpace) => {
  const results = mock || getPerfResults(nameSpace);
  const groupKeys = {};
  const formatted = [];
  const bySubgroup = {};
  results.forEach(({ groupKey, subgroupKey, start, end, syncEnd }) => {
    if (!bySubgroup[subgroupKey]) {
      bySubgroup[subgroupKey] = { subgroupKey };
      formatted.push(bySubgroup[subgroupKey]);
    }
    bySubgroup[subgroupKey][groupKey] = end - start;
    if (!groupKeys[groupKey]) { groupKeys[groupKey] = true; };
  });
  return {
    data: formatted,
    groupKeys,
  };
};

export class Charts extends Component {
  
  componentWillMount() {
    this.setState(getData(this.props.nameSpace))
  }

  render() {
    // console.log(JSON.stringify(getData()));
    return (
      <div style={{ fontSize: '25px' }}>
        <h4>{this.props.nameSpace} results</h4>
        <BarChart width={700} height={500} data={this.state.data} layout="vertical">
          <XAxis type="number"/>
          <YAxis dataKey="subgroupKey" type="category" width={270}/>
          <CartesianGrid stroke="#f5f5f5"/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip />
          <Legend />
          {this.state.groupKeys.Mobx &&
            <Bar dataKey="Mobx" name="MobX" fill="#ff7506" barSize={20}/>
          }
          {this.state.groupKeys.Redux &&
            <Bar dataKey="Redux" name="Redux" fill="#784eba" barSize={20}/>
          }
          {this.state.groupKeys.React &&
            <Bar dataKey="React" name="React" fill="#0dbded" barSize={20}/>
          }
          {this.state.groupKeys.Vue &&
            <Bar dataKey="Vue" name="Vue" fill="#41b883" barSize={20}/>
          }
        </BarChart>
      </div>
    );
  }
}
