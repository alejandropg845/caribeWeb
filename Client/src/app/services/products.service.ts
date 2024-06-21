import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { environment } from "../../environments/environment.development";
import { createProvider } from "../interfaces/provider.interface";
import { forkJoin } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductsService{

    private urlProducts = environment.api+"products";
    private urlProviders = environment.api+"provider/"
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

    constructor(private http:HttpClient){}

}