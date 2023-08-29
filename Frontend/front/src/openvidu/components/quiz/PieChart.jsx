import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#f37c7c', '#2569e1', '#c47bd5', '#c0efaf'];
const RADIAN = Math.PI / 180;

export default class Example extends PureComponent {
  state = {
    data: this.props.data,
  };

  componentDidUpdate() {
    if (this.state.data !== this.props.data) {
      this.setState({
        data: this.props.data,
      });
    }
  }

  static demoUrl =
    'https://codesandbox.io/s/pie-chart-with-padding-angle-7ux0o';

  renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + 22;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent) {
      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
        >
          {`${Math.round(this.state.data[index].value)}표`}
        </text>
      );
    }
  };

  render() {
    return (
      <PieChart width={300} height={300} onMouseEnter={this.onPieEnter}>
        <Pie
          data={this.state.data}
          cx={150}
          cy={150}
          innerRadius={80}
          outerRadius={140}
          fill="#8884d8"
          paddingAngle={1}
          dataKey="value"
          labelLine={false}
          label={this.renderCustomizedLabel}
          animationDuration={250}
          animationEasing={'ease-in-out'}
        >
          {this.state.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    );
  }
}
