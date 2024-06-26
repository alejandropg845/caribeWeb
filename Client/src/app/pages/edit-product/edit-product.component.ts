import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, switchMap, tap } from 'rxjs';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styles: ``
})
export class EditProductComponent implements OnInit{

  files: File[] = [];
  productId!:number;
  form:FormGroup = this.fb.group({
    title:[null,[Validators.required, Validators.maxLength(100)]],
    imageUrl:[""],
    description:[null,[Validators.required,Validators.maxLength(3000)]],
    price:[null,[Validators.required, Validators.min(1), Validators.max(1000000)]],
    categoryId:["",Validators.required]
  });

  loadProductInfo(){

    this.activatedRoute.params
    .pipe(
      
      switchMap(({id}) => this.productsService.loadProductById(id)), 
      tap(productId => {
        this.productId = productId.id;
      }))
    .subscribe({
        next: product => {
        this.addFormValues(product);
    }, 
      error: err => {
      this.toastr.error(err.message || "Error de conexión", "Error");
    }
    });
  }

  addFormValues(product:Product){
    this.form.get('title')?.setValue(product.title);
    this.convertUrlToFile(product.imageUrl);
    this.form.get('description')?.setValue(product.description);
    this.form.get('price')?.setValue(product.price);
    this.addCategoryValue(product.category);
  }

  convertUrlToFile(productImage:string){
    const imageUrlToFile = this.urlToFile(productImage);
    imageUrlToFile.then(file => this.files.push(file));
  }

  async urlToFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const filename = url.split('/').pop() || 'file.jpg'; // Obtén un nombre para el archivo
    return new File([blob], filename, { type: blob.type });
  }

  addCategoryValue(category:string){

    const categoryId = this.form.get('categoryId');

    switch (category){
      case 'Sopas'                : categoryId?.setValue(1); break;
      case 'Bebidas artesanales'  : categoryId?.setValue(2); break;
      case 'Productos artesanales': categoryId?.setValue(3); break;
      case 'Ropa o vestimenta'    : categoryId?.setValue(4); break;
    }
  }

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
        this.activatedRoute.params.pipe(
          switchMap(({id}) => this.productsService.editProduct(id,this.form))
        ).subscribe({
          next: (res:any) => {
          this.toastr.success("Ahora edita los proveedores", res.message);
          this.router.navigateByUrl("/caribeWeb/edit_providers/"+res.product.id);
          localStorage.setItem('boolean', "true");
          this.form.get("categoryId")?.setValue("");
        }
      });

    }});

  }

  showInfo(field:string){
    const formField = this.form.get(field);
    let asdas;
    if(field==="description" || field==="title"){
      asdas = (formField?.hasError('maxlength') && formField!.touched) ? true : false;
    }else if(field==="price"){
      asdas = (formField?.hasError('max') && formField!.touched) ? true : false;
    }
    return asdas;
  }

  goToProvidersInstead(){
    localStorage.setItem('boolean', "true");
    this.router.navigateByUrl("/caribeWeb/edit_providers/"+this.productId);
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
              private router:Router,
              private activatedRoute:ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProductInfo();
  }

}




