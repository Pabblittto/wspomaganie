import React from "react";
import { DataContext } from "../../Contexts/dataContext";
import {
  Button,
  Checkbox,
  Col,
  Input,
  Row,
  Space,
  Upload,
  UploadFile,
} from "antd";
import CSVReader, { IFileInfo } from "react-csv-reader";

export const Modul1 = () => {
  const dataContext = React.useContext(DataContext);

  const onFileLoaded = (
    data: any[],
    fileInfo: IFileInfo,
    originalFile?: File
  ) => {
    console.log(data);
    console.log(fileInfo);
  };

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
      <Row></Row>
    </div>
  );
};
