/* Batch operation helpers */

export interface BatchOperation<T> {
  id: string
  data: T
  status: 'pending' | 'success' | 'error'
  result?: any
  error?: Error
}

export async function batchProcess<T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  batchSize = 10
): Promise<BatchOperation<T>[]> {
  const results: BatchOperation<T>[] = items.map((item, i) => ({
    id: `${i}`,
    data: item,
    status: 'pending',
  }))

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const promises = batch.map((item, idx) =>
      processFn(item)
        .then((result) => {
          results[i + idx].status = 'success'
          results[i + idx].result = result
        })
        .catch((error) => {
          results[i + idx].status = 'error'
          results[i + idx].error = error
        })
    )
    await Promise.all(promises)
  }

  return results
}
