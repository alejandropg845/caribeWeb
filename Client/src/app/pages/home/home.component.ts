import { AfterViewInit, Component } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements AfterViewInit{

  products:Product[] = [];
  rating:number = 4;
  productsLocalStorage:Product[] = JSON.parse(localStorage.getItem('savedProducts')!) || [];

  loadProductsFromService(){
    this.productsService.loadProducts()
    .subscribe(products => this.products = products)
  }

  calculateStarAverage(product:Product){
    let average = 0;
    if(product.votes>0){
      average = product.rating / product.votes;
    } else average = 0;
    
    return average;
  }

  addToSaved(productId:number){
    const productInLS = this.productsLocalStorage.some(product => product.id === productId);
    if(productInLS) {
      this.toastr.info("Este producto ya se encuentra en tus guardados", "Producto existente");
      return;
    }

    this.productsService.loadProductById(productId)
    .subscribe({
      next: product => {
        this.productsLocalStorage.push(product);
        localStorage.setItem('savedProducts', JSON.stringify(this.productsLocalStorage));
        this.toastr.success("Producto agregado a guardados", "Agregado");
      },
      error: _ => {
        this.toastr.error("Ocurrió un error al agregar el producto", "Error");
      }
    });
  }

  constructor(private productsService:ProductsService, private toastr:ToastrService){}

  ngAfterViewInit(){
    this.loadProductsFromService();
  }

}
