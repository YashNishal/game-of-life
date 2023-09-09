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
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.resizeSubscription$ = fromEvent(window, 'resize')
      .pipe(debounceTime(250))
      .subscribe((evt) => {
        this.resize();
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
