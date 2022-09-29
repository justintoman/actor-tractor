import type {QueryResult} from 'neo4j-driver';

export function getRecords(records: QueryResult['records']): Record<string, Record<string, any>>[] {
  return records.map(record =>
    Array.from(record.entries()).reduce(
      (accumulator, [key, {properties}]) => ({
        ...accumulator,
        [key]: properties
      }),
      {}
    )
  );
}
