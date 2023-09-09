import { cellState } from './CellState';

export class GameState {
  constructor(
    public cols: number,
    public rows: number,
    public cells: cellState[][],
    public alive: number,
    public name: string,
    public id: string
  ) {}
}
