import React, { useState } from "react";
import "@tensorflow/tfjs-backend-webgl";
import { CellTypes, detectColumnTypes } from "./utils/detectColumnTypes";
import { createFakeTitles } from "./utils/utils";
import {
  MapLegend,
  stringColumnToNumeric,
} from "./utils/stringColumnToNumeric";
import { detectMaxMinValues } from "./utils/detectMaxMinValues";
import { discretizeColumn } from "./utils/discretizateColumn";

export type MinMaxRecord = {
  index: number;
  min: number;
  max: number;
};

export type DataRow = string[];

export type CreatedLegend = { columnIndex: number; legend: MapLegend };

export type DataContextType = {
  loadData: (data: DataRow[]) => void;
  setFirstRowTitlesOnChange: (state: boolean) => void;
  stringDataToNumeric: (dataIndex: number) => void;
  data: DataRow[] | null;
  cellTypes: CellTypes[];
  columnTitles: string[];
  legend: CreatedLegend[];
  maxMinValues: MinMaxRecord[];
  discretizateColumn: (columnIndex: number, pointsArray: number[]) => void;
};

export const DataContext = React.createContext<DataContextType>({
  loadData(data: DataRow[]) {
    throw "Not implemented";
  },
  data: null,
  setFirstRowTitlesOnChange: (state: boolean) => {
    throw "Not implemented";
  },
  stringDataToNumeric: (index: number) => {
    throw "Not implemented";
  },
  cellTypes: [],
  columnTitles: [],
  legend: [],
  maxMinValues: [],
  discretizateColumn: (columnIndex: number, pointsArray: number[]) => {
    throw "Not implemented";
  },
});

export const DataContextProvider: React.FC<any> = (props) => {
  const [data, setData] = useState<DataRow[] | null>(null);
  const [cellTypes, setCellTypes] = useState<CellTypes[]>([]);
  const [columnTitles, setColumnTitles] = useState<string[]>([]);
  const [firstColumnTitles, setFirstColumnTitles] = useState<boolean>(true);
  const [createdLegends, setCreatedLegends] = useState<CreatedLegend[]>([]);
  const [maxMinValues, setMaxMinValues] = useState<MinMaxRecord[]>([]);

  const loadData = (data: DataRow[]) => {
    if (firstColumnTitles) {
      const [firstRow, ...rest] = data;
      setColumnTitles(firstRow);
      setData(rest);
    } else {
      setColumnTitles(createFakeTitles(data[0].length));
      setData(data);
    }
    const columnTypes = detectColumnTypes(data);
    setCellTypes(columnTypes);
    setMaxMinValues(detectMaxMinValues(data, columnTypes));
  };

  const setFirstRowTitlesOnChange = (state: boolean) => {
    setFirstColumnTitles(state);
  };

  const stringDataToNumeric = (dataIndex: number) => {
    if (data != null) {
      const result = stringColumnToNumeric(dataIndex, data);
      setData(result.newData);
      const columnTypes = detectColumnTypes(result.newData);
      setCellTypes(columnTypes);
      setMaxMinValues(detectMaxMinValues(result.newData, columnTypes));
      setCreatedLegends((prev) => {
        return [
          ...prev,
          { columnIndex: dataIndex, legend: result.mappingLegend },
        ];
      });
    }
  };

  const discretizateColumn = (columnIndex: number, pointsArray: number[]) => {
    if (!data) return;

    const newData = discretizeColumn(columnIndex, pointsArray, data);
    setData(newData);
    const columnTypes = detectColumnTypes(newData);
    setCellTypes(columnTypes);
    setMaxMinValues(detectMaxMinValues(newData, columnTypes));
  };

  return (
    <DataContext.Provider
      value={{
        columnTitles,
        cellTypes,
        loadData,
        data,
        setFirstRowTitlesOnChange,
        stringDataToNumeric,
        legend: createdLegends,
        maxMinValues,
        discretizateColumn,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
