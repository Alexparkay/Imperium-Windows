import React from 'react';
import toast from 'react-hot-toast';
import { IconType } from 'react-icons';
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  Line,
  Bar,
  Pie,
  Area,
  Cell,
  XAxis,
  YAxis,
  // CartesianGrid,
  Tooltip,
  // Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartBoxProps {
  chartType: string; // 'line', 'bar', 'area', 'pie'
  color?: string;
  IconBox?: IconType;
  title?: string;
  dataKey?: string;
  number?: number | string;
  percentage?: number;
  chartData?: object[];
  chartPieData?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  chartAreaData?: Array<{
    name: string;
    smartphones: number;
    consoles: number;
    laptops: number;
    others: number;
  }>;
  isLoading?: boolean;
  isSuccess?: boolean;
}

const ChartBox: React.FC<ChartBoxProps> = ({
  chartType,
  color,
  IconBox,
  title,
  dataKey,
  number,
  percentage,
  chartData,
  chartPieData,
  chartAreaData,
  isLoading,
  isSuccess,
}) => {
  if (chartType === 'line') {
    if (isLoading) {
      return (
        <div className="w-full h-full flex justify-between items-end xl:gap-5">
          <div className="flex h-full flex-col justify-between items-start">
            <div className="flex items-center gap-2">
              {IconBox && (
                <IconBox className="m-0 p-0 text-[24px] xl:text-[30px] 2xl:text-[42px] leading-none" />
              )}
              <span className="w-[88px] xl:w-[60px] 2xl:w-[82px] m-0 p-0 text-[16px] xl:text-[15px] 2xl:text-[20px] leading-[1.15] 2xl:leading-tight font-semibold">
                {title}
              </span>
            </div>
            <div className="skeleton w-16 h-6"></div>
            <div className="skeleton w-12 h-4"></div>
          </div>
          <div className="flex h-full grow flex-col justify-between items-end">
            <div className="skeleton w-20 h-10"></div>
            <div className="skeleton w-16 h-6"></div>
          </div>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="w-full h-full flex justify-between items-end xl:gap-5">
          <div className="flex h-full flex-col justify-between items-start">
            <div className="flex items-center gap-2">
              {IconBox && (
                <IconBox className="m-0 p-0 text-[24px] xl:text-[30px] 2xl:text-[42px] 3xl:text-[48px] leading-none" />
              )}
              <span className="w-[88px] xl:w-[60px] 2xl:w-[82px] 3xl:w-[140px] m-0 p-0 text-[16px] xl:text-[15px] 2xl:text-[20px] 3xl:text-[24px] leading-[1.15] 2xl:leading-tight font-semibold">
                {title}
              </span>
            </div>
            <span className="font-bold text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl m-0 p-0">
              {number}
            </span>
            <button
              onClick={() =>
                toast('View detailed analytics', {
                  icon: '📊',
                })
              }
              className="px-0 py-0 min-h-0 max-h-5 btn btn-link font-medium text-base-content no-underline m-0 hover:text-primary transition-colors"
            >
              View All
            </button>
          </div>
          <div className="flex h-full grow flex-col justify-between items-end">
            <div className="w-full h-full xl:h-[60%] group">
              <ResponsiveContainer width="99%" height="100%">
                <LineChart 
                  width={300} 
                  height={100} 
                  data={chartData}
                  margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                >
                  <XAxis 
                    dataKey="name" 
                    hide={false} 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#888' }}
                    dy={5}
                  />
                  <YAxis hide={true} />
                  <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ 
                      r: 6, 
                      strokeWidth: 0,
                      fill: color,
                      className: "animate-pulse"
                    }}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                  <Tooltip
                    contentStyle={{
                      background: color,
                      border: 'none',
                      color: 'white',
                      borderRadius: '8px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    itemStyle={{ color: 'white', fontWeight: 'bold' }}
                    labelStyle={{ color: 'white', fontWeight: 'normal', marginBottom: '5px' }}
                    formatter={(value) => [`${value} ${dataKey === 'kWh' ? 'kWh' : ''}`]}
                    animationDuration={300}
                    animationEasing="ease-out"
                    cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex xl:flex-col 2xl:flex-row gap-2 xl:gap-2 items-end xl:items-end 2xl:items-center">
              <span
                className={`${
                  percentage && percentage > 0
                    ? 'text-success'
                    : 'text-error'
                } text-2xl xl:text-xl 2xl:text-3xl font-bold transition-all duration-300 hover:scale-110`}
              >
                {percentage || ''}%
              </span>
              <span className="font-medium xl:text-sm 2xl:text-base">
                this month
              </span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  if (chartType === 'bar') {
    if (isLoading) {
      return (
        <div className="w-full h-full p-0 m-0 flex flex-col items-start gap-3 xl:gap-4">
          <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
            {title || 'No title'}
          </span>
          <div className="w-full min-h-40 xl:min-h-[150px] skeleton"></div>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="w-full h-full p-0 m-0 flex flex-col items-start 3xl:justify-between gap-3 xl:gap-4">
          <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
            {title || 'No title'}
          </span>
          <div className="w-full min-h-40 xl:min-h-[150px] 2xl:min-h-[180px] 3xl:min-h-[250px]">
            {chartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <Bar dataKey={dataKey || ''} fill={color || ''} />
                  <XAxis dataKey="name" />
                  <Tooltip
                    contentStyle={{
                      background: color,
                      borderRadius: '5px',
                    }}
                    itemStyle={{ color: 'white' }}
                    labelStyle={{ display: 'none' }}
                    cursor={{ fill: 'none' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <span>No data</span>
            )}
          </div>
        </div>
      );
    }

    return null;
  }

  if (chartType === 'pie') {
    if (isLoading) {
      return (
        <div className="w-full h-full p-0 m-0 flex flex-col items-start justify-between gap-3 xl:gap-4">
          <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
            {title || 'no title'}
          </span>
          <div className="w-full min-h-[300px] skeleton"></div>
          <div className="w-full flex flex-col 2xl:flex-row justify-between gap-2 items-start 2xl:items-center 2xl:flex-wrap">
            <div className="skeleton w-full h-5"></div>
            <div className="skeleton w-full h-5"></div>
            <div className="skeleton w-full h-5"></div>
            <div className="skeleton w-full h-5"></div>
          </div>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="w-full h-full p-0 m-0 flex flex-col items-start justify-between gap-3 xl:gap-4">
          <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
            {title || 'no title'}
          </span>
          <div className="w-full min-h-[300px] 2xl:min-h-[360px] 3xl:min-h-[420px]">
            {chartPieData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      padding: '8px 12px',
                      border: 'none'
                    }}
                    formatter={(value, name, props) => {
                      return [
                        `${value} facilities`,
                        <span style={{ color: props.payload.color }}>{name}</span>
                      ];
                    }}
                    animationDuration={300}
                    animationEasing="ease-out"
                  />
                  <Pie
                    data={chartPieData}
                    innerRadius={'70%'}
                    outerRadius={'90%'}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      
                      return percent > 0.15 ? (
                        <text
                          x={x}
                          y={y}
                          fill="#888"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          fontSize={12}
                          fontWeight="medium"
                        >
                          {name}
                        </text>
                      ) : null;
                    }}
                  >
                    {chartPieData?.map((item, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={item.color} 
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span>No data</span>
            )}
          </div>
          <div className="w-full flex flex-col 2xl:flex-row justify-between gap-2 items-start 2xl:items-center 2xl:flex-wrap">
            {chartPieData?.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 transition-transform hover:translate-x-1"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  }

  if (chartType === 'area') {
    if (isLoading) {
      return (
        <div className="w-full h-full p-0 m-0 flex flex-col items-start gap-4 xl:gap-7 justify-between">
          <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
            {title || 'no title'}
          </span>
          <div className="w-full min-h-[300px] skeleton"></div>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="w-full h-full p-0 m-0 flex flex-col items-start gap-4 xl:gap-7 justify-between">
          <span className="text-2xl xl:text-2xl 2xl:text-4xl font-bold">
            {title || 'no title'}
          </span>
          <div className="w-full min-h-[300px] 2xl:min-h-[360px] 3xl:min-h-[420px]">
            {chartAreaData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartAreaData}>
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="smartphones"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                  <Area
                    type="monotone"
                    dataKey="consoles"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Area
                    type="monotone"
                    dataKey="laptops"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                  />
                  <Area
                    type="monotone"
                    dataKey="others"
                    stackId="1"
                    stroke="#969595"
                    fill="#969595"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              'no data'
            )}
          </div>
        </div>
      );
    }

    return null;
  }

  return null;
};

export default ChartBox;
