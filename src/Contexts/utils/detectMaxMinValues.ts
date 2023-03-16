import { DataRow, MinMaxRecord } from "../dataContext";
import { CellTypes } from "./detectColumnTypes";

export const detectMaxMinValues = (
  data: DataRow[],
  cellTypes: CellTypes[]
): MinMaxRecord[] => {
  const result: MinMaxRecord[] = [];
  const firstRow = data[1];
  for (const [index, cell] of cellTypes.entries()) {
    if (cell === "float32" || cell === "int32") {
      result.push({
        index,
        max: Number(firstRow[index]),
        min: Number(firstRow[index]),
      });
    }
  }
  console.log("Init");
  console.log(result);
  console.log("First row");
  console.log(firstRow);

  for (const row of data) {
    for (const record of result) {
      if (record.max < Number(row[record.index])) {
        record.max = Number(row[record.index]);
      }
      if (record.min > Number(row[record.index])) {
        record.min = Number(row[record.index]);
      }
    }
  }

  console.log(result);
  return result;
};
