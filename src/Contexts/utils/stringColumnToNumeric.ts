import { DataRow } from "../dataContext";

export type MapLegend = {
  [key: string]: number;
};

export type StringColumnToNumericResult = {
  newData: DataRow[];
  mappingLegend: MapLegend;
};

export const stringColumnToNumeric = (
  columnIndex: number,
  data: DataRow[]
): StringColumnToNumericResult => {
  let nextNumericValue = 0;
  let currentMap: MapLegend = {};

  const newData: DataRow[] = [];

  for (const row of data) {
    const newRow = [...row];

    if (Object.hasOwn(currentMap, newRow[columnIndex])) {
      newRow[columnIndex] = currentMap[newRow[columnIndex]].toString();
    } else {
      let newKeyValuePair: any = {};
      newKeyValuePair[newRow[columnIndex]] = nextNumericValue;
      nextNumericValue += 1;

      Object.assign(currentMap, newKeyValuePair);

      newRow[columnIndex] = currentMap[newRow[columnIndex]].toString();
    }
    newData.push(newRow);
  }

  return { newData, mappingLegend: currentMap };
};
