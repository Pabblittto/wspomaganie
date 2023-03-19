import React, { useState } from "react";
import {
  DataContext,
  DataRow,
  MinMaxRecord,
} from "../../../Contexts/dataContext";
import { Button, InputNumber, Tabs, message } from "antd";

const TabChildren: React.FC<{ minMax: MinMaxRecord; index: number }> = (
  props
) => {
  const contextData = React.useContext(DataContext);
  const [newMin, setNewMin] = useState(0);
  const [newMax, setNewMax] = useState(0);

  const onChangeRange = () => {
    if (newMin >= newMax) {
      message.error("Nowy MIN jest większy lub równy nowemu MAX!");
      return;
    }

    if (!contextData.data) return;

    const { min, max } = props.minMax;

    const curDist = max - min;
    const newDist = newMax - newMin;

    const newData: DataRow[] = [];

    for (const row of contextData.data) {
      const newRow = [...row];

      const currVal = Number(row[props.index]);
      const newValue = (((currVal - min) / curDist) * newDist + newMin).toFixed(
        3
      );

      newRow[props.index] = newValue;

      newData.push(newRow);
    }

    contextData.setUpNewData(newData);

    message.success("Sukces! Przedział zmieniony!");
  };

  return (
    <div style={{ alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{ padding: "4px" }}
        >{`Aktualny min: ${props.minMax.min}`}</div>
        <div
          style={{ padding: "4px" }}
        >{`Aktualny max: ${props.minMax.max}`}</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <InputNumber
          value={newMin}
          placeholder="Nowe MIN"
          onChange={(e) => {
            if (e != null) setNewMin(e);
          }}
        />
        <InputNumber
          value={newMax}
          placeholder="Nowe MAX"
          onChange={(e) => {
            if (e != null) setNewMax(e);
          }}
        />
      </div>
      <Button onClick={onChangeRange} type="primary">
        Aplikuj zmianę
      </Button>
    </div>
  );
};

export const RangeChanger = () => {
  const contextData = React.useContext(DataContext);

  const tabsContent = contextData.columnTitles.map((title, index) => {
    const minMax = contextData.maxMinValues.find((v) => v.index === index);

    return {
      key: index.toString(),
      label: title,
      children:
        contextData.cellTypes[index] === "string" ? (
          <div>
            <h4>Dane tekstowe!</h4>
          </div>
        ) : minMax ? (
          <TabChildren index={index} minMax={minMax} />
        ) : (
          <div>
            Obiekt posiadaojacy informacje o min max nie istenieje (Błąd)
          </div>
        ),
    };
  });

  return (
    <div>
      <h3>Zmiana przedziału wartości</h3>
      <Tabs items={tabsContent} />
    </div>
  );
};
