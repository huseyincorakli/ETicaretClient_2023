import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { DeleteDirective } from 'src/app/directives/admin/delete.directive';
import { DeleteDialogComponent } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FileUploadModule } from 'src/app/services/common/file-upload/file-upload.module';
import { DialogModule } from '@angular/cdk/dialog';
import { DeleteModule } from 'src/app/directives/admin/delete.module';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductsComponent,
    CreateComponent,
    ListComponent,
   
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:"",component:ProductsComponent}
    ]),
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    DialogModule,
    FileUploadModule,
    DeleteModule,
    MatSelectModule,
    FormsModule
  ]
})

export class ProductsModule { }
