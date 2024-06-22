import { AfterViewInit, Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements AfterViewInit{

  products:Product[] = [];

  loadProductsFromService(){
    this.productsService.productsObservable
    .subscribe(products => this.products = products);
  }

  constructor(private productsService:ProductsService){}

  ngAfterViewInit(){
    this.productsService.loadProducts();
    this.loadProductsFromService();
  }

}
