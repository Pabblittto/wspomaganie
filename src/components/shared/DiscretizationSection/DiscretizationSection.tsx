import React from "react";
import { DataContext } from "../../../Contexts/dataContext";
import { Button, Col, Input, InputNumber, Row, Tabs } from "antd";

type TabcontentProps = {
  columIndex: number;
  columnName: string;
  maxVal: number;
  minVal: number;
};

const TabContent: React.FC<TabcontentProps> = (props) => {
  const [cells, setCells] = React.useState<
    {
      futureValue: number;
      point: number;
    }[]
  >([{ futureValue: 0, point: (props.maxVal + props.minVal) / 2 }]);

  const onAddCellClick = () => {
    setCells((prev) => {
      const last = prev[prev.length - 1];
      return [
        ...prev,
        {
          futureValue: last.futureValue + 1,
          point: (last.point + props.maxVal) / 2,
        },
      ];
    });
  };

  const onRemoveCellClick = () => {
    setCells((prev) => {
      if (prev.length !== 1) {
        prev.pop();
        return [...prev];
      } else {
        return prev;
      }
    });
  };

  const onCelValueChange = (val: number, futureVal: number) => {
    setCells((prev) => {
      const cell = prev.find((c) => c.futureValue === futureVal);
      if (cell) cell.point = val;
      return [...prev];
    });
  };

  return (
    <>
      <h5>{props.columnName}</h5>
      <Button onClick={onAddCellClick}>Dodaj element</Button>
      <Button onClick={onRemoveCellClick}>Usuń element</Button>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>{`OD ${props.minVal}`}</div>
        {cells.map((cell) => (
          <div key={cell.futureValue}>
            <div style={{ alignContent: "center", marginRight: "20px" }}>
              {cell.futureValue}
            </div>
            <div
              style={{ display: "flex", flexDirection: "row", padding: "2px" }}
            >
              <div>DO</div>
              <InputNumber
                onChange={(e) => {
                  if (e != null) onCelValueChange(e, cell.futureValue);
                }}
                value={cell.point}
              />
            </div>
          </div>
        ))}
        <div>{`DO ${props.maxVal}`}</div>
      </div>
    </>
  );
};

export const DiscretizationSection: React.FC = (props) => {
  const dataContext = React.useContext(DataContext);

  const tabs = dataContext.cellTypes.map((type, index) => ({
    key: index.toString(),
    label: dataContext.columnTitles[index],
    children:
      type === "float32" ? (
        <TabContent
          columIndex={index}
          columnName={dataContext.columnTitles[index]}
          key={index}
          minVal={dataContext.maxMinValues.find((d) => d.index === index)?.min!}
          maxVal={dataContext.maxMinValues.find((d) => d.index === index)?.max!}
        />
      ) : (
        <>To nie Kolumna zmiennych ciągłych</>
      ),
  }));

  return (
    <div style={{ padding: "20px", alignItems: "center" }}>
      <div>
        <h3>Dyskretyzacja kolumn z danymi ciągłymi</h3>
      </div>
      <Row>
        <Col span={24}>
          <Tabs items={tabs} />
        </Col>
      </Row>
    </div>
  );
};
