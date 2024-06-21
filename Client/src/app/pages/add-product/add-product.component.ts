import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProductsService } from '../../services/products.service';
import { forkJoin, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styles: ``
})
export class AddProductComponent{

  
  files: File[] = [];
  form:FormGroup = this.fb.group({
    title:[null,Validators.required],
    imageUrl:[""],
    description:[null,Validators.required],
    price:[null,[Validators.required, Validators.min(1)]],
    categoryId:["",Validators.required]
  });

  onSubmit(){

    if(!this.form.valid){ 
      this.toastr.error("No has llenado todos los campos", "Campos vacíos"); 
      this.form.markAllAsTouched();
      return;
    }

    if(!this.files[0]){
      this.toastr.error("Has olvidado agregar una imagen", "Campos faltantes"); 
      return;
    }

    if(this.files.length!==1){
      this.toastr.error("Has agregado más de una imagen. Debes agregar sólo una.", "Error"); 
      return;
    }

    //Create an observables of Cloudinary Images Urls
    const urlObservable = this.files.map(file => {
      let images = new FormData();
      images.append('file', file);
      images.append('upload_preset','caribeWeb_products');
      return this.productsService.uploadToCloudinary(images);
    });
    forkJoin(urlObservable)
    .pipe(

      tap(cloudinaryInfo => {

      const imageUrl = cloudinaryInfo.map((url:any) => url.secure_url);
      this.form.get("imageUrl")?.setValue(imageUrl[0]);

    })).subscribe({
      next: _ => {
        
        // Send info to DB
        this.productsService.uploadProductToDB(this.form.value)
        .subscribe({
          next: (res:any) => {
          this.toastr.success(res.message, "Listo");
          this.router.navigateByUrl("/caribeWeb/add_provider/"+res.id);
          localStorage.setItem('boolean', "true");
          this.form.get("categoryId")?.setValue("");
        }
      });

    }});

  }

  validateField(field:string){
    let form = this.form.get(field);
    return (form?.touched && !form.valid) ? 'border-red-600' : 'border-black';   
  }

  onSelect(event:any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event:any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  constructor(private fb: FormBuilder,
              private productsService:ProductsService,
              private toastr:ToastrService,
              private router:Router
  ) {}

}



