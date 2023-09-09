export class CellState {
  constructor(
    public x: number,
    public y: number,
    public isAlive: boolean = false,
    public hasBeenOnceAlive: boolean = false
  ) {}
}