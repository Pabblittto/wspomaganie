import React, { useEffect, useState } from "react";
import { Chart } from "react-charts";
import { DataContext } from "../../../Contexts/dataContext";
import { Tabs } from "antd";

export type SingleDataElement<PrimaryType, SecondaryType> = {
  /**
   * X
   */
  primary: PrimaryType;
  /**
   * Y
   */
  secondary: SecondaryType;
};

/** Base type for  */
export type BaseChartDataStructure<
  PrimaryType = string,
  SecondaryType = number
> = {
  /**Name of the series */
  label: string;
  data: SingleDataElement<PrimaryType, SecondaryType>[];
};

// Sort function from: https://stackoverflow.com/questions/4340227/sort-mixed-alpha-numeric-array
var reA = /[^a-zA-Z]/g;
var reN = /[^0-9]/g;

function sortAlphaNum(a: any, b: any) {
  var aA = a.replace(reA, "");
  var bA = b.replace(reA, "");
  if (aA === bA) {
    var aN = parseInt(a.replace(reN, ""), 10);
    var bN = parseInt(b.replace(reN, ""), 10);
    return aN === bN ? 0 : aN > bN ? 1 : -1;
  } else {
    return aA > bA ? 1 : -1;
  }
}

export const Histograms = () => {
  const contextData = React.useContext(DataContext);

  const [chartData, setChartData] = useState<
    BaseChartDataStructure<string | number, number>[]
  >([]);

  useEffect(() => {
    if (!contextData.data) return;

    const newChartData: BaseChartDataStructure<string | number, number>[] = [];

    for (const title of contextData.columnTitles) {
      newChartData.push({
        label: title,
        data: [],
      });
    }

    for (const row of contextData.data) {
      let lastIndex = 0;
      for (const [index, cell] of row.entries()) {
        lastIndex = index;
        const currentElement = newChartData[index].data.find(
          (e) => e.primary === cell
        );
        if (currentElement) {
          currentElement.secondary += 1;
        } else {
          newChartData[index].data.push({
            primary: cell,
            secondary: 1,
          });
        }
      }
      newChartData[lastIndex].data.sort((A, B) =>
        sortAlphaNum(A.primary, B.primary)
      );
    }

    setChartData(newChartData);
  }, [contextData.data, contextData.columnTitles, contextData.cellTypes]);

  const tabs = chartData.map((dataElement) => ({
    key: dataElement.label,
    label: dataElement.label,
    children: (
      <div style={{ width: "100%", height: "500px" }}>
        <Chart
          options={{
            data: [dataElement],
            primaryAxis: {
              getValue: (datum) => datum.primary,
            },
            secondaryAxes: [
              {
                getValue: (datum) => datum.secondary,
              },
            ],
          }}
        />
      </div>
    ),
  }));

  console.log(chartData);

  return (
    <div>
      <h3>Histogramy</h3>
      <Tabs items={tabs} />
    </div>
  );
};
