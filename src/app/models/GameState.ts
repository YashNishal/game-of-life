import { CellState } from './CellState';

export class GameState {
  constructor(
    public cols: number,
    public rows: number,
    public cells: CellState[][],
    public alive: number,
    public name: string,
    public id = new Date().toLocaleString(),
  ) {}
}
