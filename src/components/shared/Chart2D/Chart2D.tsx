import React, { useEffect, useState } from "react";
import { DataContext } from "../../../Contexts/dataContext";
import { Radio, RadioChangeEvent, Space } from "antd";
import { Scatter } from "react-chartjs-2";
import { ChartData, ChartDataset, Chart, LinearScale } from "chart.js";
import { Point } from "chart.js/dist/core/core.controller";
import randomColor from "randomcolor";
import "chart.js/auto";

export const Chart2D = () => {
  const contextData = React.useContext(DataContext);
  /** Indexes of values */
  const [valueX, setValueX] = useState(0);
  const [valueY, setValueY] = useState(1);
  const [valueClass, setValueClass] = useState(2);

  const [dataset, setDataset] = useState<
    ChartData<"scatter", Point[], unknown>
  >({
    datasets: [],
  });

  const onChangeX = (e: RadioChangeEvent) => {
    setValueX(e.target.value);
  };

  const onChangeY = (e: RadioChangeEvent) => {
    setValueY(e.target.value);
  };

  const onChangeClass = (e: RadioChangeEvent) => {
    setValueClass(e.target.value);
  };

  useEffect(() => {
    const tmpDatasets: ChartDataset<"scatter", Point[]>[] = [];

    if (contextData.data) {
      contextData.data?.forEach((row) => {
        const classValue = row[valueClass];
        const xValue = Number(row[valueX]);
        const yValue = Number(row[valueY]);

        const existingDS = tmpDatasets.find(
          (ds: ChartDataset<"scatter", Point[]>) => ds.label === classValue
        );

        if (existingDS) {
          // Add new element to existing dataset

          existingDS.data.push({
            x: xValue,
            y: yValue,
          });
        } else {
          const color = randomColor({ format: "rgb" });
          // Create new dataset and add new element
          const newDataset: ChartDataset<"scatter", Point[]> = {
            label: classValue,
            data: [],
            backgroundColor: color,
          };
          newDataset.data.push({
            x: xValue,
            y: yValue,
          });
          tmpDatasets.push(newDataset);
        }
      });

      setDataset({
        datasets: tmpDatasets,
      });
    }
  }, [valueX, valueY, valueClass, contextData]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        paddingTop: "10px",
        paddingBottom: "100px",
      }}
    >
      <div style={{ width: "100px" }}>
        <a>X</a>
        <div style={{ alignContent: "left" }}>
          <Radio.Group onChange={onChangeX} value={valueX}>
            <Space direction="vertical">
              {contextData.columnTitles.map((val, index) => (
                <Radio
                  value={index}
                  disabled={contextData.cellTypes[index] === "string"}
                >
                  {val}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
      </div>
      <div style={{ width: "100px" }}>
        <a>Y</a>
        <div style={{ alignContent: "left" }}>
          <Radio.Group onChange={onChangeY} value={valueY}>
            <Space direction="vertical">
              {contextData.columnTitles.map((val, index) => (
                <Radio
                  value={index}
                  disabled={contextData.cellTypes[index] === "string"}
                >
                  {val}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
      </div>
      <div
        style={{
          width: "100px",
          borderRightWidth: "3px",
          borderRightColor: "black",
        }}
      >
        <a>Klasa</a>
        <div
          style={{
            alignContent: "left",
          }}
        >
          <Radio.Group onChange={onChangeClass} value={valueClass}>
            <Space direction="vertical">
              {contextData.columnTitles.map((val, index) => (
                <Radio value={index}>{val}</Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
      </div>
      <div style={{ width: "100%", height: "100%" }}>
        <Scatter
          data={dataset}
          options={{ scales: { x: { type: "linear", position: "bottom" } } }}
        />
      </div>
    </div>
  );
};
