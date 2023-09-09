import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { GameService } from 'src/app/services/game.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SaveGenConfirmDialogComponent } from '../save-gen-confirm-dialog/save-gen-confirm-dialog.component';
import { LoadGenerationDialogComponent } from '../load-generation-dialog/load-generation-dialog.component';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @ViewChild('startBtn') startBtn: any;
  private rows$ = this.gameService.rows$;
  private cols$ = this.gameService.cols$;
  private ref: DynamicDialogRef | undefined;

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
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  showInfoDialog() {
    this.ref = this.dialogService.open(InfoDialogComponent, {
      header: 'What is game of life?',
      width: '60%',
      baseZIndex: 10000,
    });
  }

  showSaveGenDialog() {
    this.ref = this.dialogService.open(SaveGenConfirmDialogComponent, {
      header: 'Name your generation',
      baseZIndex: 10000,
      width: '25%',
    });
    this.ref.onClose.subscribe((name) => {
      if (name) {
        this.gameService.saveGenerationFrame(name);
        this.showMessage('success', 'Generation saved');
      }
    });
  }

  showLoadGenDialog() {
    this.ref = this.dialogService.open(LoadGenerationDialogComponent, {
      header: 'Load a generation',
      width: '35%',
      baseZIndex: 10000,
    });

    this.ref.onClose.subscribe((gen) => {
      if (gen) {
        this.gameService.loadGeneration(gen);
        this.showMessage('success', 'Generation loaded');
      }
    });
  }

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
        icon: 'pi pi-fw pi-external-link',
        command: () => {
          this.showLoadGenDialog();
        },
      },
      {
        label: 'Save',
        icon: 'pi pi-fw pi-plus-circle',
        command: () => {
          this.saveGenerationHandler();
        },
      },
      {
        label: 'Randomize',
        icon: 'pi pi-fw pi-refresh',
        command: () => {
          this.randomizeHandler();
        },
      },
      {
        label: 'Toggle Border',
        icon: 'pi pi-fw pi-table',
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
    this.showSaveGenDialog();
  }

  public resetHandler() {
    this.gameService.reset();
    this.gameConfigMap.start = false;
  }
}
