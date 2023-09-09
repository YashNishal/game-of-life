import { Injectable } from '@angular/core';
import {  LOCAL_STORAGE_KEY } from '../constants/game-config';
import { GameState } from '../models/GameState';

@Injectable({
  providedIn: 'root'
})

export class LocalstorageService {

  constructor() { }

  public saveData(key: LOCAL_STORAGE_KEY, gameState:GameState ) {
    const data = localStorage.getItem(key);
    const saves = data ? JSON.parse(data) : [];
    saves.push(gameState);

    localStorage.setItem(key, JSON.stringify(saves));
  }

  public getData(key: LOCAL_STORAGE_KEY): GameState[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  public removeData(key: LOCAL_STORAGE_KEY,) {
    const data = localStorage.getItem(key);
    const saves = data ? JSON.parse(data) : [];

  }

  public clearData() {
    localStorage.clear();
  }

}
