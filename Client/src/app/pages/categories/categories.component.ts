import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styles: ``
})
export class CategoriesComponent implements OnInit{

  products:Product[] = [];
  term!:string;

  sortBy(value?:string, sort?:number){
    this.term = value ?? "Seleccionar categoría";
    this.productsService.sortProducts(sort!);
    this.productsService.sortedProductsObservable
    .subscribe(products => {
      this.products = products;
    });
  }

  calculateStarAverage(product:Product){
    let average = 0
    if(product.votes > 0) 
      average = product.rating / product.votes;
    else average = 0;
    return average;
  }

  constructor(private productsService:ProductsService){}

  ngOnInit(): void {
    this.sortBy();
  }

}
