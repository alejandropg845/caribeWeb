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


    productsSubject = new BehaviorSubject<Product[]>([]);
    productsObservable = this.productsSubject.asObservable();
    loadProducts(){
        this.http.get<Product[]>(this.urlProducts)
        .subscribe(products => {
            this.productsSubject.next(products);
        });
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


    
    rateProduct(productId:number,rating:number){
        return this.http.post<RateResponse>(this.urlProducts+"/rateProduct/"+productId,rating);
    }



    constructor(private http:HttpClient, private toastr:ToastrService){}

}