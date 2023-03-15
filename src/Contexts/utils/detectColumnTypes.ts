import { DataRow } from "../dataContext";
import * as tf from "@tensorflow/tfjs";

export type CellTypes =
  | Exclude<tf.NumericDataType, "complex64" | "bool">
  | "string";

export const detectColumnTypes = (firstRow: DataRow): CellTypes[] => {
  const result = new Array<CellTypes>(firstRow.length).fill("string");

  for (const [index, cell] of firstRow.entries()) {
    if (!isNaN(Number(cell))) {
      // Cell is either intiger or float
      if (Number(cell) % 1 === 0) {
        // int
        result[index] = "int32";
      } else {
        // float
        result[index] = "float32";
      }
    } else {
      // String
      result[index] = "string";
    }
  }

  return result;
};
