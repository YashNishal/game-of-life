import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @ViewChild('startBtn') startBtn: any;
  private rows$ = this.gameService.rows$;
  private cols$ = this.gameService.cols$;

  public rows = 0;
  public cols = 0;

  public frameCounter$ = this.gameService.frameCounter$;
  public alive$ = this.gameService.alive$;

  public customMenuItems: any[];

  gameConfigMap = {
    delay: undefined,
    randomize: false,
    start: false,
    border: true,
    blockSize: undefined,
    draw: false,
  };

  constructor(
    private gameService: GameService,
    private messageService: MessageService
  ) {}

  drawHandler() {
    if (this.gameConfigMap.start) {
      this.startBtn.toggle();
    }
    this.gameService.draw$.next(this.gameConfigMap.draw);
  }

  showMessage(severity: string, summary: string) {
    this.messageService.add({ severity: severity, summary: summary });
  }

  blockSizeHandler() {
    if (
      !this.gameConfigMap.blockSize ||
      this.gameConfigMap.blockSize < 15 ||
      this.gameConfigMap.blockSize > 500
    ) {
      return;
    }
    of(true)
      .pipe(debounceTime(500))
      .subscribe(() =>
        this.gameService.blockSize$.next(this.gameConfigMap.blockSize!)
      );
  }

  ngOnInit() {
    this.rows$.subscribe((row) => {
      this.rows = row;
    });
    this.cols$.subscribe((cols) => {
      this.cols = cols;
    });

    let localItems = [];

    this.customMenuItems = [
      {
        label: 'Load',
        items: [],
      },
      {
        label: 'Save',
        command: () => {
          this.saveGenerationHandler();
        },
      },
      {
        label: 'Randomize',
        command: () => {
          this.randomizeHandler();
        },
      },
      {
        label: 'Toggle Border',
        command: () => {
          this.borderHandler();
        },
      },
    ];
  }

  public randomizeHandler() {
    this.gameConfigMap.randomize = true;
    this.gameService.randomize();
  }

  public startHandler() {
    if (this.gameConfigMap.start) {
      this.gameService.startGame(this.gameConfigMap.delay);
    } else {
      this.gameService.stopGame();
    }
  }

  public borderHandler() {
    this.gameService.toggleBorder();
  }

  public saveGenerationHandler() {
    if (this.gameConfigMap.start) {
      this.showMessage(
        'warn',
        'Please pause the game before saving the generation'
      );
      return;
    }
    this.gameService.saveGenerationFrame();
  }

  public resetHandler() {
    this.gameService.reset();
    this.gameConfigMap.start = false;
  }
}
