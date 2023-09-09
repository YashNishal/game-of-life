import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { MessageService } from 'primeng/api';
import { CellState } from 'src/app/models/CellState';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, AfterViewInit {
  @ViewChild('grid') grid: ElementRef;
  
  public rows = 0;
  public cols = 0;
  public border$ = this.gameService.border$;
  public cells: CellState[][];

  private allowClick = false;
  private tapAudio = new Audio('assets/tap.mp3');

  constructor(
    private gameService: GameService,
    private messageService: MessageService
  ) {
    this.tapAudio.volume = 0.1;
  }

  ngOnInit() {
    this.gameService.cells$.subscribe((cells) => {
      this.cells = cells;
      this.rows = cells.length;
      this.cols = cells[0] ? cells[0].length : 0;
    });
    this.gameService.draw$.subscribe((draw) => (this.allowClick = draw));
  }

  ngAfterViewInit() {
    this.mouseTrack(this.grid.nativeElement);
  }

  public onClickHandler(row: number, col: number) {
    if (!this.allowClick) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Please click draw button to start changing cells',
      });
      return;
    }
    if (this.cells[row][col].isAlive) {
      this.cells[row][col].hasBeenOnceAlive = false;
    }
    this.cells[row][col].isAlive = !this.cells[row][col].isAlive;
    this.tapAudio.play();
  }

  public setAlive(row: number, col: number) {
    this.cells[row][col].isAlive = true;
    this.cells[row][col].hasBeenOnceAlive = true;
  }

  private mouseTrack(grid: HTMLDivElement) {
    let isDown = false;

    grid.addEventListener('mousedown', (e) => {
      if (this.allowClick) {
        isDown = true;
        this.tapAudio.play();
      }
    });

    grid.addEventListener('mousemove', (e) => {
      if (isDown === true && this.allowClick && e.target) {
        const [row, cell] = (e.target as any).id.split(' ');
        this.setAlive(+row, +cell);
      }
    });

    grid.addEventListener('mouseup', (e) => {
      if (isDown === true) {
        isDown = false;
        this.tapAudio.play();
      }
    });
  }
}
