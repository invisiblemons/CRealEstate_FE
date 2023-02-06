import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SavedSearchComponent } from './saved-search.component';

const routes: Routes = [{
  path: '',
  component: SavedSearchComponent
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SavedSearchRoutingModule { }
