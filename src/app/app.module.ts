import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { SplitButtonModule } from 'primeng/splitbutton';
import { GridComponent } from './components/grid/grid.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { SaveGenConfirmDialogComponent } from './components/save-gen-confirm-dialog/save-gen-confirm-dialog.component';
import { LoadGenerationDialogComponent } from './components/load-generation-dialog/load-generation-dialog.component';
import { ListboxModule } from 'primeng/listbox';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ToolbarComponent,
    SaveGenConfirmDialogComponent,
    LoadGenerationDialogComponent,
    InfoDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    ToggleButtonModule,
    ButtonModule,
    ToolbarModule,
    MenubarModule,
    DropdownModule,
    ToastModule,
    TooltipModule,
    SplitButtonModule,
    DynamicDialogModule,
    ListboxModule,
    MenuModule,
    SkeletonModule,
  ],
  providers: [MessageService, DialogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
