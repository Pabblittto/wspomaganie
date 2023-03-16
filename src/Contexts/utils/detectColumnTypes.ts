import { DataRow } from "../dataContext";
import * as tf from "@tensorflow/tfjs";

export type CellTypes =
  | Exclude<tf.NumericDataType, "complex64" | "bool">
  | "string";

export const detectColumnTypes = (data: DataRow[]): CellTypes[] => {
  const result = new Array<CellTypes>(data[0].length).fill("string");

  for (const [index, cell] of data[1].entries()) {
    if (!isNaN(Number(cell))) {
      // Cell is either intiger or float
      let tmpValue = cell;
      if (Number(tmpValue) === 0) {
        // If probably number is 0, find first non zero value
        for (const val of data) {
          if (Number(val[index]) !== 0) {
            tmpValue = val[index];
            break;
          }
        }
      }
      if (Number(tmpValue) % 1 === 0) {
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
