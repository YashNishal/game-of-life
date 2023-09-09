import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { GameState } from 'src/app/models/GameState';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-load-generation-dialog',
  templateUrl: './load-generation-dialog.component.html',
  styleUrls: ['./load-generation-dialog.component.css'],
})
export class LoadGenerationDialogComponent implements OnInit, OnDestroy {
  public saveList: GameState[] = [];
  public loading = false;
  public selectedSave: GameState;

  private subscription: Subscription;

  constructor(public gameService: GameService,public ref: DynamicDialogRef) {}

  ngOnInit() {
    this.loading = true;
    this.subscription = this.gameService.saves$.subscribe((saves) => {
      this.saveList = saves;
      setTimeout(() => (this.loading = false), 1000);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public clickHandler(save: GameState) {
    this.ref.close(save);
  }

  public removeHandler(save: GameState) {
    this.gameService.removeSave(save);
  }
}
