export type DataUnit = {
  date: string;
  transfers_count: number;
  avg_transfer_value: number;
}

const collapseGranulesIntoOne = (data: DataUnit[]) => {
  const { date, total_avg_transfer_value, total_transfers_count } = data.reduce((acc, dataUnit, i, arr) => {
    // date equals to the last element date
    if(i === arr.length - 1) {
      acc.date = dataUnit.date;
    }
    acc.total_avg_transfer_value += dataUnit.avg_transfer_value;
    acc.total_transfers_count += dataUnit.transfers_count;

    return acc;
  }, { date: '', total_avg_transfer_value: 0, total_transfers_count: 0 });

  console.log({
    date,
    avg_transfer_value: total_avg_transfer_value / data.length,
    transfers_count: total_transfers_count,
  })

  return {
    date,
    avg_transfer_value: total_avg_transfer_value / data.length,
    transfers_count: total_transfers_count,
  };
}

export const getGranulatedData = (data: DataUnit[], granularity: number) => {
  if(granularity === 1) {
    return data;
  } else {
    const { resultGranules } = data.reduce((acc, dataUnit, i, arr) => {
      // collapse remaining granules in the end
      // (size of the last granule might me less then selected value)
      if(i === arr.length - 1) {
        const lastGranule = collapseGranulesIntoOne([...acc.accumulatingGranule, dataUnit]);

        acc.resultGranules.push(lastGranule);
        return acc;
      }

      // to accumulate granules we should collapse
      if (acc.accumulatingGranule.length !== granularity) {
        acc.accumulatingGranule.push(dataUnit);
        return acc;
      } else {
        const granule = collapseGranulesIntoOne(acc.accumulatingGranule);

        acc.resultGranules.push(granule);
        acc.accumulatingGranule = [dataUnit];
      }
      return acc;
    }, { accumulatingGranule: [] as DataUnit[], resultGranules: [] as DataUnit[]  })
    
    return resultGranules;
  }
};
