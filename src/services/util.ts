export const filterIndex = <T>(
  arr: T[],
  callback: (v: T, index: number, orgArr: T[]) => boolean
): number[] => {
  return arr
    .map((v, i, o) => (callback(v, i, o) ? i : null))
    .filter(i => i !== null);
};
