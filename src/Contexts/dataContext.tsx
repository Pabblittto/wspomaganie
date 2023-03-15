import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import { CellTypes, detectColumnTypes } from "./utils/detectColumnTypes";
import { createFakeTitles } from "./utils/utils";

export type DataRow = string[];

export type DataContextType = {
  loadData: (data: DataRow[]) => void;
  setFirstRowTitlesOnChange: (state: boolean) => void;
  data: DataRow[] | null;
};

export const DataContext = React.createContext<DataContextType>({
  loadData(data: DataRow[]) {
    throw "Not implemented";
  },
  data: null,
  setFirstRowTitlesOnChange: (state: boolean) => {
    throw "Not implemented";
  },
});

export const DataContextProvider: React.FC<any> = (props) => {
  const [data, setData] = useState<DataRow[] | null>(null);
  const [cellTypes, setCellTypes] = useState<CellTypes[]>([]);
  const [columnTitles, setColumnTitles] = useState<string[]>([]);
  const [firstColumnTitles, setFirstColumnTitles] = useState<boolean>(true);

  const loadData = (data: DataRow[]) => {
    if (firstColumnTitles) {
      const [firstRow, ...rest] = data;
      setColumnTitles(firstRow);
      setData(rest);
    } else {
      setColumnTitles(createFakeTitles(data[0].length));
      setData(data);
    }
    detectColumnTypes(data[2]);
    setCellTypes(detectColumnTypes(data[2]));
  };

  const setFirstColumnTitlesOnChange = (state: boolean) => {
    setFirstColumnTitles(state);
  };

  return (
    <DataContext.Provider
      value={{
        loadData,
        data,
        setFirstRowTitlesOnChange: setFirstColumnTitlesOnChange,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};
