import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  {
    name: 'Jan',

    pv: 300,
    amt: 300,
  },
  {
    name: 'Feb',

    pv: 200,
    amt: 200,
  },
  {
    name: 'Mar',

    pv: 10,
    amt: 100,
  },
  {
    name: 'Apr',

    pv: 500,
    amt: 500,
  },
  {
    name: 'May',
    pv: 600,
    amt: 600,
  },
  {
    name: 'Jun',
    pv: 700,
    amt: 700,
  },
  {
    name: 'Jul',
    pv: 750,
    amt: 800,
  },
  {
    name: 'Aug',
    pv: 750,
    amt: 800,
  },
  {
    name: 'Sep',
    pv: 750,
    amt: 800,
  },
  {
    name: 'Oct',
    pv: 750,
    amt: 800,
  },
  {
    name: 'Nov',
    pv: 750,
    amt: 800,
  },
  {
    name: 'Dec',
    pv: 750,
    amt: 800,
  },
];

interface ISimpleLineChart {
  stokeColor?: string;
  isYaxisVisible?: boolean;
}
export const SimpleLineChart = ({ isYaxisVisible, stokeColor }: ISimpleLineChart) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        {isYaxisVisible && <YAxis />}
        <Tooltip />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="pv"
          stroke={stokeColor}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
