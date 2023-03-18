import React from "react";
import { DataContext, DataRow } from "../../../Contexts/dataContext";
import { Button, Popconfirm } from "antd";
import stats from "stats-lite";

export const Standarization = () => {
  const contextData = React.useContext(DataContext);

  const doStandarization = (columnIndex: number) => {
    if (!contextData.data) return;

    const newData: DataRow[] = [];

    const values: number[] = [];

    for (const row of contextData.data) {
      values.push(Number(row[columnIndex]));
    }

    const mean = stats.mean(values);
    const stDev = stats.stdev(values);

    for (const row of contextData.data) {
      const newRow = [...row];
      newRow[columnIndex] = (
        (Number(row[columnIndex]) - mean) /
        stDev
      ).toPrecision(2);

      newData.push(newRow);
    }

    contextData.setUpNewData(newData);
  };

  return (
    <div>
      <h3>Standaryzacja zmiennych rzeczywistych</h3>
      {contextData.columnTitles.map((title, index) => {
        return (
          <div
            key={title}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <div>{`${title}: `}</div>

            {contextData.cellTypes[index] !== "float32" ? (
              <div>Wartość nie jest rzeczywista</div>
            ) : (
              <Popconfirm
                title={"Czy na pewno?"}
                onConfirm={() => doStandarization(index)}
              >
                <Button size="small">Standaryzuj</Button>
              </Popconfirm>
            )}
          </div>
        );
      })}
    </div>
  );
};
