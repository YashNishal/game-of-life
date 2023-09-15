import { Injectable } from '@angular/core';
import {
  DEFAULT_BLOCK_SIZE,
  LOCAL_STORAGE_KEY,
  NEIGHBOURS,
} from '../constants/game-config';
import { CellState } from '../models/CellState';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { GameState } from '../models/GameState';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public currentInterval: any;
  public rows$ = new BehaviorSubject<number>(0);
  public cols$ = new BehaviorSubject<number>(0);
  public blockSize$ = new BehaviorSubject<number>(DEFAULT_BLOCK_SIZE);
  public savedGenerations$ = new BehaviorSubject<GameState[]>([]);
  public draw$ = new BehaviorSubject(false);
  
  private saves = new BehaviorSubject<GameState[]>([]);
  private cells: BehaviorSubject<CellState[][]>;
  private border = new BehaviorSubject(true);
  private frameCounter = new BehaviorSubject(0);
  private alive = new BehaviorSubject(0);

  get saves$(): Observable<GameState[]> {
    return this.saves.asObservable();
  }

  get cells$(): Observable<CellState[][]> {
    return this.cells.asObservable();
  }

  get border$(): Observable<boolean> {
    return this.border.asObservable();
  }

  get frameCounter$(): Observable<number> {
    return this.frameCounter.asObservable();
  }

  get alive$(): Observable<number> {
    return this.alive.asObservable();
  }

  public toggleBorder() {
    this.border.next(!this.border.value);
  }

  constructor(private localStorageService: LocalstorageService) {
    this.init(true);
    this.loadSaves();
    this.rows$.subscribe(() => {
      this.reset();
    });

    this.cols$.subscribe(() => {
      this.reset();
    });
  }

  public loadSaves() {
    this.saves.next(this.localStorageService.getData(LOCAL_STORAGE_KEY.SAVES));
  }

  public removeSave(save: GameState) {
    this.localStorageService.removeData(LOCAL_STORAGE_KEY.SAVES, save.id);
    this.loadSaves();
  }

  public toggleCell(x: number, y: number) {
    const newCells = this.cells.value;
    newCells[x][y].isAlive = !newCells[x][y].isAlive;
    newCells[x][y].hasBeenOnceAlive =
      newCells[x][y].hasBeenOnceAlive ?? newCells[x][y].isAlive;
    this.cells.next(newCells);
  }

  public setCellState(x: number, y: number, alive: boolean) {
    const newCells = this.cells.value;
    newCells[x][y].isAlive = alive;
    newCells[x][y].hasBeenOnceAlive = newCells[x][y].hasBeenOnceAlive ?? alive;

    this.cells.next(newCells);
  }

  public stopGame() {
    clearInterval(this.currentInterval);
  }

  public reset() {
    this.stopGame();
    this.init();
    this.frameCounter.next(0);
  }

  public startGame(delay = 250) {
    this.currentInterval = setInterval(() => {
      this.cells.next(this.nextGeneration());
      this.frameCounter.next(this.frameCounter.value + 1);
    }, delay);
  }

  public randomize() {
    this.init(false, true);
  }

  public loadGeneration(gen: GameState) {
    this.rows$.next(gen.rows);
    this.cols$.next(gen.cols);
    this.cells.next(gen.cells);
    this.frameCounter.next(0);
    this.alive.next(gen.alive);
  }

  public saveGenerationFrame(name: string) {
    const newGeneration = new GameState(
      this.cols$.value,
      this.rows$.value,
      this.cells.value,
      this.alive.value,
      name
    );
    this.localStorageService.saveData(LOCAL_STORAGE_KEY.SAVES, newGeneration);
    this.loadSaves();
  }

  private nextGeneration(): CellState[][] {
    const rows = this.rows$.value;
    const cols = this.cols$.value;

    const nextGeneration: CellState[][] = structuredClone(this.cells.value);
    let aliveCnt = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let aliveNeighbours = 0;

        NEIGHBOURS.forEach(([x, y]) => {
          const neighbourX = i + x;
          const neighbourY = j + y;

          if (
            neighbourX >= 0 &&
            neighbourX < rows &&
            neighbourY >= 0 &&
            neighbourY < cols
          ) {
            aliveNeighbours += this.cells.value[neighbourX][neighbourY].isAlive
              ? 1
              : 0;
          }
        });

        if (!this.cells.value[i][j].isAlive && aliveNeighbours === 3) {
          nextGeneration[i][j].isAlive = true;
          nextGeneration[i][j].hasBeenOnceAlive = true;
        } else if (
          this.cells.value[i][j].isAlive &&
          aliveNeighbours !== 2 &&
          aliveNeighbours !== 3
        ) {
          nextGeneration[i][j].isAlive = false;
        }

        if (nextGeneration[i][j].isAlive) {
          aliveCnt++;
        }
      }
    }
    this.alive.next(aliveCnt);
    return nextGeneration;
  }

  private init(firstTime = false, randomize = false) {
    const rows = this.rows$.value;
    const cols = this.cols$.value;

    let aliveCnt = 0;

    let cells: CellState[][] = new Array(rows);

    for (let i = 0; i < rows; i++) {
      cells[i] = new Array(cols);
      for (let j = 0; j < cols; j++) {
        const aliveState = randomize ? Math.random() >= 0.75 : false;
        cells[i][j] = new CellState(i, j, aliveState, aliveState);
        aliveCnt += Number(cells[i][j].isAlive);
      }
    }
    if (firstTime) {
      this.cells = new BehaviorSubject(cells);
      return;
    }
    this.cells.next(cells);
    this.alive.next(aliveCnt);
    this.frameCounter.next(0);
  }
}
