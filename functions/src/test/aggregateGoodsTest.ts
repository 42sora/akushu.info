import { goodsList } from './TestData'

for (const detail of goodsList.details) {
  const status = detail.status
  const part = status[0].slice(1)
  const body = status.slice(1)

  const result: any = {}
  for (const row of body) {
    result[row[0]] = {}
    for (const [i, v] of row.slice(1).entries()) {
      result[row[0]][part[i]] = v
    }
  }
  console.log(result);
  console.log(JSON.stringify(result, undefined, 1));

}

