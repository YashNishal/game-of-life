import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GameService } from './services/game.service';
import { Subscription, debounce, debounceTime, fromEvent, of } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('main') main: ElementRef;
  public rows = 0;
  public cols = 0;
  private blockSize$ = this.gameService.blockSize$;
  public blockSize: number;
  resizeSubscription$: Subscription;
  constructor(
    private gameService: GameService,
    private cdRef: ChangeDetectorRef,
    private dialogService: DialogService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.dialogService.open(InfoDialogComponent, {
      header: 'What is game of life?',
      width: '60%',
      baseZIndex: 10000,
    });
    this.resizeSubscription$ = fromEvent(window, 'resize')
      .pipe(debounceTime(250))
      .subscribe((evt) => {
        this.resize();
        this.messageService.add({
          severity: 'info',
          summary: 'Resized the grid based on window size',
        });
      });
  }
  ngAfterViewInit(): void {
    this.blockSize$.subscribe((blockSize) => {
      this.blockSize = blockSize;
      this.resize();
      this.cdRef.detectChanges();
    });
  }

  resize() {
    const width = this.main.nativeElement.offsetWidth;
    const height = this.main.nativeElement.offsetHeight;

    this.rows = Math.floor(height / this.blockSize);
    this.cols = Math.floor(width / this.blockSize);

    this.gameService.rows$.next(this.rows);
    this.gameService.cols$.next(this.cols);
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
  }
}
