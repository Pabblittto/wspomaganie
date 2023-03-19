import React, { useMemo } from "react";
import { DataContext } from "../../Contexts/dataContext";
import {
  Button,
  Checkbox,
  Col,
  Popconfirm,
  Row,
  Space,
  Table,
  Tabs,
} from "antd";
import CSVReader, { IFileInfo } from "react-csv-reader";
import { dataRowToDataSource } from "../../utils/dataRowToDataSource";
import { DiscretizationSection } from "../shared/DiscretizationSection/DiscretizationSection";
import { Standarization } from "../shared/Standarization/Standarization";
import { RangeChanger } from "../shared/RangeChanger/RangeChanger";

export const Modul1 = () => {
  const dataContext = React.useContext(DataContext);

  const onFileLoaded = (
    data: any[],
    fileInfo: IFileInfo,
    originalFile?: File
  ) => {
    dataContext.loadData(data);
  };

  const mappedData = useMemo(
    () =>
      dataContext.data
        ? [
            {
              key: "types",
              ...dataRowToDataSource(dataContext.cellTypes),
            },
            ...dataContext.data.map((row, index) => ({
              key: index,
              ...dataRowToDataSource(row),
            })),
          ]
        : [],
    [dataContext.data, dataContext.cellTypes]
  );

  const columns = useMemo(
    () =>
      dataContext.columnTitles.map((title, index) => ({
        title: title,
        dataIndex: index.toString(),
        key: index,
      })),
    [dataContext.columnTitles]
  );

  const createdLegends = dataContext.legend.map((val, idx) => ({
    key: idx.toString(),
    label: `Column ${val.columnIndex}`,
    children: JSON.stringify(val.legend),
  }));

  return (
    <div>
      <h1>Moduł 1</h1>
      <Space />
      <Row>
        <Col span={6}>
          <CSVReader onFileLoaded={onFileLoaded} />
        </Col>
        <Col>
          <Checkbox
            defaultChecked
            onChange={(e) =>
              dataContext.setFirstRowTitlesOnChange(e.target.checked)
            }
          >
            Pierwszy rząd zawiera nazwy
          </Checkbox>
        </Col>
      </Row>
      <div
        style={{ marginTop: "20px", backgroundColor: "gray", height: "5px" }}
      />
      <Row
        style={{
          maxHeight: "400px",
          overflow: "scroll",
          paddingBottom: "30px",
        }}
      >
        <Table columns={columns} dataSource={mappedData} sticky />
      </Row>
      <div
        style={{ marginTop: "20px", backgroundColor: "gray", height: "5px" }}
      />
      <Row>
        <Col style={{ padding: "10px" }} span={5}>
          <h3>Tekstowe na numeryczne</h3>
          {dataContext.cellTypes.filter((t) => t === "string").length === 0 && (
            <div>Brak kolumn tekstowych</div>
          )}
          {dataContext.cellTypes.map((type, index) => {
            if (type === "string") {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: "10px",
                  }}
                >
                  <div>{"Kolumna: " + dataContext.columnTitles[index]}</div>
                  <Popconfirm
                    title={"Czy na pewno?"}
                    onConfirm={() => dataContext.stringDataToNumeric(index)}
                  >
                    <Button>Zamień</Button>
                  </Popconfirm>
                </div>
              );
            } else {
              return <></>;
            }
          })}
        </Col>
        <Col span={19}>
          <Tabs items={createdLegends} />
        </Col>
      </Row>
      <div
        style={{ marginTop: "20px", backgroundColor: "gray", height: "5px" }}
      />
      <DiscretizationSection />
      <div
        style={{ marginTop: "20px", backgroundColor: "gray", height: "5px" }}
      />
      <Standarization />
      <div
        style={{ marginTop: "20px", backgroundColor: "gray", height: "5px" }}
      />
      <RangeChanger />
    </div>
  );
};
