import {
  NewRowType,
  CastedPointsContainer,
  CurrentBestCut,
  Directions,
} from "../clasifier";

export const shouldEndIterating = (rows: NewRowType[]) => {
  const tmp = rows.find((r) => r.isCutted === false);

  if (tmp) {
    return false;
  } else {
    return true;
  }
};

export const sortTMPContainerAscending = (
  A: CastedPointsContainer,
  B: CastedPointsContainer
) => {
  return A.value - B.value;
};

export const createVectorCutData = (
  className: string | undefined,
  points: NewRowType[],
  columnName: string,
  direction: Directions,
  value: number
): CurrentBestCut | undefined => {
  if (className === undefined) return undefined;

  return {
    cut: {
      columnName,
      direction,
      value,
      className,
    },
    points,
  };
};
