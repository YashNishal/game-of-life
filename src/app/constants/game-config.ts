export const DEFAULT_BLOCK_SIZE = 25;

export enum LOCAL_STORAGE_KEY {
  SAVES = 'saves',
}
export const NEIGHBOURS = [
  // top row
  [-1, -1],
  [-1, 0],
  [-1, 1],

  // middle row
  [0, 1],
  [0, -1],

  // bottom row
  [1, 1],
  [1, 0],
  [1, -1],
];