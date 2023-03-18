import { DataRow } from "../dataContext";
import * as tf from "@tensorflow/tfjs";

const tensorToString = (tensor: tf.Tensor) => {
  return tensor.arraySync().toString();
};

export const discretizeColumn = (
  columnIndex: number,
  pointsArray: number[],
  data: DataRow[]
) => {
  const newData: DataRow[] = [];

  for (const row of data) {
    const newRow = [...row];
    const currVal = tf.tensor1d([Number(row[columnIndex])]);
    const newVal = tensorToString(
      tf.upperBound(tf.tensor1d(pointsArray), currVal)
    );
    newRow[columnIndex] = newVal;
    newData.push(newRow);
  }

  return newData;
};
