export const createFakeTitles = (length: number): string[] => {
  const result = new Array(length).fill("");
  for (let i = 0; i < length; i++) {
    result[i] = "Col " + i;
  }

  return result;
};
