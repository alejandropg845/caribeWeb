import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { ToastrService } from 'ngx-toastr';
import { Provider } from '../../interfaces/provider.interface';
import { DomSanitizer } from '@angular/platform-browser';

interface Rate{
  id:number,
  rating:number
}

export interface RateResponse{
  message: string,
  product: Product
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styles: ``
})
export class ProductComponent implements OnInit{

  
  product!:Product;
  providers!:Provider[];
  rating:number=0;
  votes = 0;
  rated:boolean = false;
  alreadyRated:Rate[] = JSON.parse(localStorage.getItem('ratedProductsId')!) || [];

  setRating(value:number){
    this.rating = value;
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.productsService.rateProduct(id,value)))  //Obtener ID del URL
    .subscribe({
      next: (response:RateResponse) => {
        this.rating = response.product.rating;                          //Establecer valor a  rating
        this.votes = response.product.votes;                            //Establecer valor a  votes
        const object:Rate = {id: response.product.id, rating: value }   //Establecer el productID y el rating en objecto
        this.alreadyRated.push(object);
        this.rated = true;
        localStorage.setItem('ratedProductsId', JSON.stringify(this.alreadyRated));
        this.toastr.success(response.message, "Listo");
      },
      error: (err:any) => {
        this.toastr.error(err.message || "Error al hacer rating", "Error");
      }
    });

  }

  hoverRating(rating:number){
    if(!this.rated){
      this.rating = rating;
    }
    
  }

  hoverOut(rating:number){
    this.rating = rating;
  }

  loadProductInfo(){

    this.activatedRoute.params
    .pipe(
      tap(({id})=> {
        this.ratedProducts(id);
        this.productsService.loadProductProviders(id)
        .subscribe({
          next: providers => {
            this.providers = this.locationToFloat(providers);
          },
          error: err => {
            this.toastr.error(err.message || "Error de conexión", "Error");
          }
        });
    }),
      switchMap(({id}) => this.productsService.loadProductById(id)))
    .subscribe({
        next: product => {
        this.product = product;
    }, 
      error: err => {
      this.toastr.error(err.message || "Error de conexión", "Error");
    }
    });
  }

  ratedProducts(productId:string){
    const productID = parseInt(productId);
    const localStorag:Rate[] = JSON.parse(localStorage.getItem('ratedProductsId')!) || [];
    let exists = localStorag.find(object => productID === object.id );
    if(exists) {
      this.rating = exists.rating;
      this.rated = true;

    }
  }

  productsLocalStorage:Product[] = JSON.parse(localStorage.getItem('savedProducts')!) || [];


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

  deleteProductFromDB(productId:number){
    this.productsService.deleteProduct(productId)
    .subscribe({
      next: (res:any) => {
        this.toastr.success(res.message,"Eliminado");
        this.router.navigateByUrl("/caribeWeb/home");
      },
      error: (err:any) => {
        this.toastr.error(err.error.message, "Error");
      }
    })
  }

  locationToFloat(providers:Provider[]){

    const provs:Provider[] = [];

    for (let i = 0; i < providers.length; i++) {

      let provider:Provider = {
        productId: providers[i].productId,
        id       : providers[i].id,
        name     : providers[i].name,
        address  : providers[i].address,
        lat      : parseFloat(providers[i].lat),
        lng      : parseFloat(providers[i].lng),
        phone    : providers[i].phone
      }

      provs.push(provider);
      
    }
    return provs;
  }

  constructor(private productsService:ProductsService, 
              private activatedRoute:ActivatedRoute,
              private toastr:ToastrService,
              public sanitizer:DomSanitizer,
              private router:Router){}
  
  ngOnInit(): void {
      this.loadProductInfo();
  }

  

}
