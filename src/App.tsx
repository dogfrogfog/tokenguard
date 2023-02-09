import { SetStateAction, useState, Dispatch } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import samples_data from './sample_data.json';
import { getGranulatedData, DataUnit } from './utils';
import './App.css';

type ChartVisability = {
  transfers_count: boolean;
  avg_transfer_value: boolean;
}

const GRANULARITY_OPTIONS = [1, 7, 30]; // in days

const App = () => {
  const [granularity, setGranularity] = useState(GRANULARITY_OPTIONS[0]);
  const [chartsVisability, setChartsVisability] = useState({
    avg_transfer_value: true,
    transfers_count: true,
  });

  return (
    <div className='app'>
      <p className='title'>
        Chart represents 2 series: <b>transfers_count</b> and <b>avg_transfer_value</b> on timeline
      </p>
      <Chart
        data={getGranulatedData(samples_data as DataUnit[], granularity)}
        chartsVisability={chartsVisability}
      />
      <br />
      <ChartDisplayOptions
        granularity={granularity}
        setGranularity={setGranularity}
        chartsVisability={chartsVisability}
        setChartsVisability={setChartsVisability}
      />
    </div>
  );
};

const Chart = ({
  data,
  chartsVisability,
}: {
  data: DataUnit[];
  chartsVisability: ChartVisability;
}) => (
  <div className='chart-wrapper'>
    <AreaChart width={1500} height={700} data={data}>
      <defs>
        {chartsVisability.transfers_count && 
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
        }
        {chartsVisability.avg_transfer_value && 
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
          </linearGradient>
        }
      </defs>
      <XAxis dataKey="date" tickFormatter={(v) => v.split(' 00:00:00+00')[0]} />
      <YAxis tickFormatter={v => v / 1000 + 'k'} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip labelFormatter={(v) => v.split(' 00:00:00+00')[0]} />
      <Legend />
      {chartsVisability.transfers_count &&
        <Area type="monotone" dataKey="transfers_count" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
      }
      {chartsVisability.avg_transfer_value &&
        <Area type="monotone" dataKey="avg_transfer_value" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
      }
    </AreaChart>
  </div>
);

type ChartDisplayOptionsProps = {
  granularity: number;
  setGranularity: Dispatch<SetStateAction<number>>;
  chartsVisability: ChartVisability;
  setChartsVisability: Dispatch<SetStateAction<ChartVisability>>;
}

const ChartDisplayOptions = ({
  granularity,
  setGranularity,
  chartsVisability,
  setChartsVisability,
}: ChartDisplayOptionsProps) => {
  return (
    <>
      <div className='granularity-options'>
        Granularity {'('}in days{'): '}
        {GRANULARITY_OPTIONS.map(v => (
          <button
            key={v}
            className={granularity === v ? 'active-option option' : 'option'}
            onClick={() => setGranularity(v)}
          >
            {v}
          </button>
        ))}
      </div>
      <div className='visability-options'>
        Active charts:{' '}
        {Object.entries(chartsVisability).map(([k, isVisible]) => (
          <button
            key={k}
            className={isVisible ? 'active-option option' : 'option'}
            onClick={() => setChartsVisability(v => ({ ...v, [k]: !isVisible  }))}
          >
            {k}
          </button>
        ))}
      </div>
    </>
  );
};

export default App;