import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { environment } from "../../environments/environment.development";
import { createProvider } from "../interfaces/createProvider.interface";
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { Product } from "../interfaces/product.interface";
import { Provider } from "../interfaces/provider.interface";
import { ToastrService } from "ngx-toastr";
import { RateResponse } from "../pages/product/product.component";

@Injectable({
    providedIn: 'root'
})
export class ProductsService{

    private urlProducts = environment.api+"products";
    private urlProviders = environment.api+"provider/";


    

    loadProducts():Observable<Product[]>{
        return this.http.get<Product[]>(this.urlProducts);
    }

    loadProductById(productId:number):Observable<Product>{
        return this.http.get<Product>(this.urlProducts+"/"+productId);
    }

    loadProductProviders(productId:number):Observable<Provider[]>{
        return this.http.get<Provider[]>("https://localhost:7228/providers/"+productId);
    }

    uploadToCloudinary(data:FormData){
        return this.http.post("https://api.cloudinary.com/v1_1/dyihpj2hw/image/upload",data);
    }

    uploadProductToDB(data:FormGroup){
        return this.http.post(this.urlProducts,data);
    }

    addProductProviders(productId:number,providers:createProvider[]){
        
        const providerRequestsObservables = providers.map(provider => {
            return this.http.post(this.urlProviders+productId,provider);
        });
        return forkJoin(providerRequestsObservables);
    }

    editProduct(productId:number,form:FormGroup):Observable<Product>{
        return this.http.put<Product>(this.urlProducts+'/'+productId,form.value);
    }

    deleteProduct(productId:number){
        return this.http.delete(this.urlProducts+"/"+productId);
    }

    
    rateProduct(productId:number,rating:number){
        return this.http.post<RateResponse>(this.urlProducts+"/rateProduct/"+productId,rating);
    }

    deleteProvider(providerId:number){
        return this.http.delete(this.urlProviders+providerId);
    }


    sortedProductsSubject = new BehaviorSubject<Product[]>([]);
    sortedProductsObservable = this.sortedProductsSubject.asObservable();

    sortProducts(sort:number){

        this.loadProducts().subscribe(products => {
            
            switch (sort) {
                case 1:
                  this.sortedProductsSubject.next(products.filter(prods => prods.category === "Bebidas artesanales"));
                  break;
                case 2:
                  this.sortedProductsSubject.next(products.filter(prods => prods.category === "Productos artesanales"));
                  break;
                case 3:
                  this.sortedProductsSubject.next(products.filter(prods => prods.category === "Sopas"));
                  break;
                case 4:
                  this.sortedProductsSubject.next(products.filter(prods => prods.category === "Ropa o vestimenta"));
                  break;
                default:
                    this.sortedProductsSubject.next(products.filter(prods => prods.category === "Bebidas artesanales"));
                  break;
            }
        });
        
    }

    constructor(private http:HttpClient, private toastr:ToastrService){}

}