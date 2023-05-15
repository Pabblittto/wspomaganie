import { DataContextType, DataRow } from "../../Contexts/dataContext";
import {
  createVectorCutData,
  shouldEndIterating,
  sortTMPContainerAscending,
} from "./utils";

export type ClassPointContainer = {
  /**Class Name */
  name: string;
  points: NewRowType[];
};

export type CastedPointsContainer = {
  /** Lista klas które nalezea do danej wartości */
  classes: ClassPointContainer[];
  value: number;
};

export type Dimention = {
  columnName: string;
  values: CastedPointsContainer[];
};

export type CurrentBestCut = {
  cut: VectorCutData;
  points: NewRowType[];
};

export type Directions = "asc" | "desc";

/**
 * Punkt cięcia
 */
export type VectorCutData = {
  columnName: string;
  value: number;
  /** asc - w stronę rosnącą, desc - w stronę malejącą */
  direction: Directions;
};

export type NewRowType = {
  class: string;
  originalRow: DataRow;
  isCutted: boolean;
  vector: (1 | 0)[];
  containerList: ClassPointContainer[];
};

export const runClasifier = (data: DataContextType) => {
  if (!data.data) {
    return [];
  }

  // Init new table:
  const newTable: NewRowType[] = data.data.map((d) => ({
    isCutted: false,
    vector: [],
    originalRow: d,
    class: d[d.length - 1],
    containerList: [],
  }));

  const cuts: VectorCutData[] = [];
  const wronglyClasifiedPoints: NewRowType[] = [];

  // Zrzutowane obiekty
  const dimentions: Array<Dimention> = [];
  const numOfColumns = data.columnTitles.length;
  data.columnTitles.forEach((title, index) => {
    if (index === numOfColumns - 1) {
      // If it is a class column, return
      return;
    }
    const newArrayForColumn: CastedPointsContainer[] = [];

    newTable.forEach((row) => {
      const rowClass = row.class;
      //Value of current column
      const val = Number(row.originalRow[index]);
      const valContainer = newArrayForColumn.find((c) => c.value === val);
      if (valContainer) {
        const clas = valContainer.classes.find((c) => c.name === rowClass);

        if (clas) {
          row.containerList.push(clas);
          clas.points.push(row);
        } else {
          const newClas: ClassPointContainer = {
            name: rowClass,
            points: [],
          };
          row.containerList.push(newClas);
          newClas.points.push(row);
          valContainer.classes.push(newClas);
        }
      } else {
        const newValContainer: CastedPointsContainer = {
          classes: [],
          value: val,
        };

        const newClas: ClassPointContainer = {
          name: rowClass,
          points: [],
        };
        row.containerList.push(newClas);
        newClas.points.push(row);
        newValContainer.classes.push(newClas);
        newArrayForColumn.push(newValContainer);
      }
    });
    newArrayForColumn.sort(sortTMPContainerAscending);

    dimentions.push({
      columnName: title,
      values: newArrayForColumn,
    });
  });

  while (!shouldEndIterating(newTable)) {
    let bestCut: CurrentBestCut | undefined;

    //Iteracja po kazdej kolumnie bez klasy
    for (const dimension of dimentions) {
      let bestDescendingCut: CurrentBestCut | undefined;
      let bestAscendingCut: CurrentBestCut | undefined;
      let descendingClassCut: string | undefined = undefined;
      const descendingPoints: NewRowType[] = [];
      let lastVal = 0;
      // Descending cut
      for (let i = 0; i < dimension.values.length; i++) {
        const val = dimension.values[i];
        //Analize only if there is one class
        if (val.classes.length === 1) {
          if (
            descendingClassCut === undefined ||
            descendingClassCut === val.classes[0].name
          ) {
            descendingClassCut = val.classes[0].name; //Set first found class name
            descendingPoints.push(...val.classes[0].points); // Save all points for a cut
            lastVal = val.value;
          } else {
            // Met different class, so cutting is finished
            bestDescendingCut = createVectorCutData(
              descendingClassCut,
              descendingPoints,
              dimension.columnName,
              "desc",
              lastVal
            );
            break;
          }
        } else if (val.classes.length === 0) {
          continue;
        } else if (val.classes.length > 0) {
          // Met many classes for point, so cutting is finished
          bestDescendingCut = createVectorCutData(
            descendingClassCut,
            descendingPoints,
            dimension.columnName,
            "desc",
            lastVal
          );
          break;
        }
        // For loop is finished, so cutting is finished if any
        bestDescendingCut = createVectorCutData(
          descendingClassCut,
          descendingPoints,
          dimension.columnName,
          "desc",
          lastVal
        );
      }

      let ascendingClassCut: string | undefined = undefined;
      const ascendingPoints: NewRowType[] = [];
      lastVal = 0;
      // Ascending
      for (let j = dimension.values.length - 1; j >= 0; j--) {
        const val = dimension.values[j];
        //Analize only if there is one class
        if (val.classes.length === 1) {
          if (
            ascendingClassCut === undefined ||
            ascendingClassCut === val.classes[0].name
          ) {
            ascendingClassCut = val.classes[0].name; //Set first found class name
            ascendingPoints.push(...val.classes[0].points); // Save all points for a cut
            lastVal = val.value;
          } else {
            // Met different class, so cutting is finished
            bestAscendingCut = createVectorCutData(
              ascendingClassCut,
              ascendingPoints,
              dimension.columnName,
              "asc",
              lastVal
            );
            break;
          }
        } else if (val.classes.length === 0) {
          continue;
        } else if (val.classes.length > 0) {
          // Met many classes for point, so cutting is finished
          bestAscendingCut = createVectorCutData(
            ascendingClassCut,
            ascendingPoints,
            dimension.columnName,
            "asc",
            lastVal
          );
          break;
        }
        // For loop is finished, so cutting is finished
        bestAscendingCut = createVectorCutData(
          ascendingClassCut,
          ascendingPoints,
          dimension.columnName,
          "asc",
          lastVal
        );
      }

      // Choose best cut and save it to best cut value
      if (bestDescendingCut) {
        if (
          bestCut === undefined ||
          bestCut.points.length < bestDescendingCut.points.length
        ) {
          bestCut = bestDescendingCut;
        }
      }
      if (bestAscendingCut) {
        if (
          bestCut === undefined ||
          bestCut.points.length < bestAscendingCut.points.length
        ) {
          bestCut = bestAscendingCut;
        }
      }
    }
    // Best cut musi być ogarnięty wewnątrz fora i być pprzypisany do zmiennej, w innym wypadku jest chuj

    /* ################################################## starting cutting when there is no cut */
    if (bestCut === undefined) {
      // When there is no best cut, take first best that will cut the most number  of points of one class
      let pointToBeWronglyClasifiedBestCut: NewRowType[] = [];
      //Iteracja po kazdej kolumnie bez klasy
      for (const dimension of dimentions) {
        let bestDescendingCut: CurrentBestCut | undefined;
        let bestAscendingCut: CurrentBestCut | undefined;
        let descendingClassCut: string | undefined = undefined;
        /**
         * Array of points that will be wrongly clasified because of the cut
         */
        let descendingCutWrongPointsCount: NewRowType[] = [];
        const descendingPoints: NewRowType[] = [];
        let lastVal = 0;
        // Descending cut
        for (let i = 0; i < dimension.values.length; i++) {
          const val = dimension.values[i];
          //Analize only if there is one class
          if (val.classes.length === 1) {
            if (
              descendingClassCut === undefined ||
              descendingClassCut === val.classes[0].name
            ) {
              descendingClassCut = val.classes[0].name; //Set first found class name
              descendingPoints.push(...val.classes[0].points); // Save all points for a cut
              lastVal = val.value;
            } else {
              // Met different class, so cutting is finished
              bestDescendingCut = createVectorCutData(
                descendingClassCut,
                descendingPoints,
                dimension.columnName,
                "desc",
                lastVal
              );
              break;
            }
          }
          if (val.classes.length === 0) {
            continue;
          } else if (val.classes.length > 0) {
            // This is first IF that
            if (descendingClassCut === undefined) {
              // If it is undefined, set class to most countable items
              let classNameOfHighestCount = "";
              let theMostCountedPoints: NewRowType[] = [];
              for (const currClass of val.classes) {
                if (currClass.points.length > theMostCountedPoints.length) {
                  theMostCountedPoints = [...currClass.points];
                  classNameOfHighestCount = currClass.name;
                }
              }
              descendingClassCut = classNameOfHighestCount;
              descendingPoints.push(...theMostCountedPoints);

              //Count wrongly klasified points
              for (const currClass of val.classes) {
                if (currClass.name !== descendingClassCut)
                  descendingCutWrongPointsCount.push(...currClass.points);
              }
              lastVal = val.value;
            } else {
              // If it is more than 2 and class is already set, cutting is finished
              // Met many classes for point, so cutting is finished
              bestDescendingCut = createVectorCutData(
                descendingClassCut,
                descendingPoints,
                dimension.columnName,
                "desc",
                lastVal
              );
              break;
            }
          }
          // For loop is finished, so cutting is finished if any
          bestDescendingCut = createVectorCutData(
            descendingClassCut,
            descendingPoints,
            dimension.columnName,
            "desc",
            lastVal
          );
        }

        let ascendingClassCut: string | undefined = undefined;
        const ascendingPoints: NewRowType[] = [];
        /**
         * Array of points that will be wrongly clasified because of the cut
         */
        let ascendingCutWrongPointsCount: NewRowType[] = [];
        lastVal = 0;
        // Ascending
        for (let j = dimension.values.length - 1; j >= 0; j--) {
          const val = dimension.values[j];
          //Analize only if there is one class
          if (val.classes.length === 1) {
            if (
              ascendingClassCut === undefined ||
              ascendingClassCut === val.classes[0].name
            ) {
              ascendingClassCut = val.classes[0].name; //Set first found class name
              ascendingPoints.push(...val.classes[0].points); // Save all points for a cut
              lastVal = val.value;
            } else {
              // Met different class, so cutting is finished
              bestAscendingCut = createVectorCutData(
                ascendingClassCut,
                ascendingPoints,
                dimension.columnName,
                "asc",
                lastVal
              );
              break;
            }
          } else if (val.classes.length === 0) {
            continue;
          } else if (val.classes.length > 0) {
            // This is first IF that
            if (ascendingClassCut === undefined) {
              // If it is undefined, set class to most countable items
              let classNameOfHighestCount = "";
              let theMostCountedPoints: NewRowType[] = [];
              for (const currClass of val.classes) {
                if (currClass.points.length > theMostCountedPoints.length) {
                  theMostCountedPoints = [...currClass.points];
                  classNameOfHighestCount = currClass.name;
                }
              }
              ascendingClassCut = classNameOfHighestCount;
              ascendingPoints.push(...theMostCountedPoints);

              //Count wrongly klasified points
              for (const currClass of val.classes) {
                if (currClass.name !== ascendingClassCut)
                  ascendingCutWrongPointsCount.push(...currClass.points);
              }
              lastVal = val.value;
            } else {
              // If it is more than 2 and class is already set, cutting is finished
              // Met many classes for point, so cutting is finished
              bestAscendingCut = createVectorCutData(
                ascendingClassCut,
                ascendingPoints,
                dimension.columnName,
                "asc",
                lastVal
              );
              break;
            }
          }
          // For loop is finished, so cutting is finished
          bestAscendingCut = createVectorCutData(
            ascendingClassCut,
            ascendingPoints,
            dimension.columnName,
            "asc",
            lastVal
          );
        }

        // Choose best cut and save it to best cut value
        if (bestDescendingCut) {
          if (
            bestCut === undefined ||
            pointToBeWronglyClasifiedBestCut.length >
              descendingCutWrongPointsCount.length
          ) {
            bestCut = bestDescendingCut;
            pointToBeWronglyClasifiedBestCut = descendingCutWrongPointsCount;
          }
        }
        if (bestAscendingCut) {
          if (
            bestCut === undefined ||
            pointToBeWronglyClasifiedBestCut.length >
              ascendingCutWrongPointsCount.length
          ) {
            bestCut = bestAscendingCut;
            pointToBeWronglyClasifiedBestCut = ascendingCutWrongPointsCount;
          }
        }
      }
      if (bestCut) {
        bestCut.points.push(...pointToBeWronglyClasifiedBestCut);
        wronglyClasifiedPoints.push(...pointToBeWronglyClasifiedBestCut);
      }
    }
    /* ####################################### END  of cutting when there is no eazy cut */

    if (bestCut !== undefined) {
      cuts.push(bestCut.cut);
      const points = bestCut.points;
      // Fill vectors in all points and mark point as cut
      for (let i = 0; i < newTable.length; i++) {
        const row = newTable[i];
        // Add vector sign
        if (points.includes(row)) {
          row.isCutted = true;
          row.vector.push(1);
        } else {
          row.vector.push(0);
        }
      }

      // Remove point from casted arrays
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        for (let j = 0; j < point.containerList.length; j++) {
          const containerRef = point.containerList[j];
          containerRef.points = containerRef.points.filter((p) => p !== point);
        }
      }

      // Remove classes from values when there is no points in it
      dimentions.forEach((dimention) => {
        for (let i = 0; i < dimention.values.length; i++) {
          const value = dimention.values[i];
          value.classes = value.classes.filter((c) => c.points.length > 0);
        }
      });
    } else {
      throw "blad, ciecie powinno ju dawno istniec";
    }
  }

  console.log(
    newTable.map((row) => ({
      vec: row.vector.join(","),
      kl: row.class,
    }))
  );
  console.log(cuts);
  return { newTable, cuts, wronglyClasifiedPoints };
};
