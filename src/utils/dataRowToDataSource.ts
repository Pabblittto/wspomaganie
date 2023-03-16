import { DataRow } from "../Contexts/dataContext";

export const dataRowToDataSource = (row: DataRow): Object => {
  const result = {};

  for (const [index, content] of row.entries()) {
    let tmp: any = {};
    tmp[index.toString()] = content;
    Object.assign(result, tmp);
  }
  return result;
};
