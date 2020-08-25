import React, { Component } from "react";
import { Card, Radio } from "antd";
import {
  Chart,
  registerShape,
  Geom,
  Axis,
  Tooltip,
  Interval,
  Interaction,
  Coordinate,
} from "bizcharts";
const data = [
  {
    type: "分类一",
    value: 20,
  },
  {
    type: "分类二",
    value: 18,
  },
  {
    type: "分类三",
    value: 32,
  },
  {
    type: "分类四",
    value: 15,
  },
  {
    type: "Other",
    value: 15,
  },
];
const sliceNumber = 0.01; // 自定义 other 的图形，增加两条线

registerShape("interval", "sliceShape", {
  draw(cfg, container) {
    const points = cfg.points;
    let path = [];
    path.push(["M", points[0].x, points[0].y]);
    path.push(["L", points[1].x, points[1].y - sliceNumber]);
    path.push(["L", points[2].x, points[2].y - sliceNumber]);
    path.push(["L", points[3].x, points[3].y]);
    path.push("Z");
    path = this.parsePath(path);
    return container.addShape("path", {
      attrs: {
        fill: cfg.color,
        path: path,
      },
    });
  },
});
export default class index extends Component {
  handleChange = (e) => {
    console.log(e.target.value);
  };
  render() {
    return (
      <Card
        title={"销售额占比"}
        extra={
          <>
            <Radio.Group defaultValue="a" onChange={this.handleChange}>
              <Radio.Button value="a">Hangzhou</Radio.Button>
              <Radio.Button value="b">Shanghai</Radio.Button>
              <Radio.Button value="c">Beijing</Radio.Button>
              <Radio.Button value="d">Chengdu</Radio.Button>
            </Radio.Group>
          </>
        }
      >
        <Chart data={data} height={500} autoFit>
          <Coordinate type="theta" radius={0.8} innerRadius={0.75} />
          <Axis visible={false} />
          <Tooltip showTitle={false} showContent={true}/>
          <Interval
            adjust="stack"
            position="value"
            color="type"
            shape="sliceShape"
          />
          <Interaction type="element-single-selected" />
        </Chart>
      </Card>
    );
  }
}
