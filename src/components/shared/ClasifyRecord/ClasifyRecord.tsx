import React, { useState } from "react";
import { DataContext } from "../../../Contexts/dataContext";
import { ClasifierResult } from "../clasifier";

const ColumnForm = ({
  columns,
  onSubmit,
}: {
  columns: string[];
  onSubmit: (arg: string[]) => void;
}) => {
  const [values, setValues] = React.useState(Array(columns.length).fill(""));

  const handleChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {columns.map((column, index) => (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <>{column}</>
            <input
              key={index}
              type="number"
              value={values[index]}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export const ClasifyRecord = (props: { clasifierRes: ClasifierResult }) => {
  const { clasifierRes } = props;
  const dataContext = React.useContext(DataContext);
  const [klasOfrecord, setClasOfRecord] = useState<string | undefined>();

  if (clasifierRes === null) {
    return <></>;
  }

  const onSubmit = (arg: string[]) => {
    const numberValues = arg.map((v) => Number(v));

    for (const cut of clasifierRes.cuts) {
      const indexOfColumn = dataContext.columnTitles.indexOf(cut.columnName);
      const recordPointVal = numberValues[indexOfColumn];

      if (cut.direction === "asc") {
        if (recordPointVal >= cut.value) {
          setClasOfRecord(cut.className);
          break;
        }
      } else {
        if (recordPointVal <= cut.value) {
          setClasOfRecord(cut.className);
          break;
        }
      }
    }
  };
  const clasifyColumns = [...dataContext.columnTitles];

  clasifyColumns.pop();
  return (
    <div>
      <ColumnForm onSubmit={onSubmit} columns={clasifyColumns} />
      <div>Result:</div>
      <div>{klasOfrecord}</div>
    </div>
  );
};
