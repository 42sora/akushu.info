import { entryList } from './testData'
import * as aggregator from '../aggregator/fortuneAggregator'
// tslint:disable-next-line: no-floating-promises
(async () => {
  console.log(entryList);

  const res = aggregator.aggregateEntry(entryList)
  console.log(JSON.stringify(res, undefined, 1))


})()


