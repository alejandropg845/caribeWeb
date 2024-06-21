import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { AddProductComponent } from './add-product/add-product.component';
import { HomeComponent } from './home/home.component';
import { SavedComponent } from './saved/saved.component';
import { ProductComponent } from './product/product.component';
import { PagesRoutingModule } from './pages.routes';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CategoriesComponent } from './categories/categories.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ReactiveFormsModule } from '@angular/forms';
import { AddProvidersComponent } from './add-providers/add-providers.component';



@NgModule({
  declarations: [MainComponent, 
                AddProductComponent,
                HomeComponent, 
                SavedComponent, 
                ProductComponent,
                HeaderComponent,
                FooterComponent,
                CategoriesComponent,
                AddProvidersComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    RouterOutlet,
    RouterLink,
    NgxDropzoneModule,
    LeafletModule,
    ReactiveFormsModule,
  ]
})
export class PagesModule { }
