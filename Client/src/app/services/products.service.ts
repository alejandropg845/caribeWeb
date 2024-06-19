import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ProductsService{

    uploadToCloudinary(data:FormData){
        this.http.post("https://api.cloudinary.com/v1_1/dyihpj2hw/image/upload",data);
    }

    constructor(private http:HttpClient){}

}