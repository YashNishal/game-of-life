export class cellState {
  constructor(
    public x: number,
    public y: number,
    public isAlive: boolean = false,
    public hasBeenOnceAlive: boolean = false
  ) {}
}