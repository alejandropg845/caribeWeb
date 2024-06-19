import { AfterViewInit, Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import { ProductsService } from '../../services/products.service';
import { combineLatest, forkJoin } from 'rxjs';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styles: ``
})
export class AddProductComponent{

  private map!: L.Map;
  marker: L.Marker | null = null;
  markerPosition = { lat: 0, lng: 0 };
  files: File[] = [];
  nextPage:boolean = false;
  form:FormGroup = this.fb.group({
    //Product info
    title:[null,Validators.required],
    imageUrl:[null,Validators.required],
    price:[null,Validators.required],
    category:["",Validators.required],

    //Provider info
    name:[null,Validators.required],
    position:[[null],Validators.required],
    address:[null,Validators.required],
    phone:[null,Validators.required]
  });

  onSubmit(){
    const urlObservable = this.files.map(file => {
      let images = new FormData();
      images.append('file', file);
      images.append('upload_preset','cloudinary_products');
      return this.productsService.uploadToCloudinary(images);
    });
    forkJoin([urlObservable]).subscribe({
      next: url => {
        const imageUrl = url;
        this.form.get('imageUrl')?.setValue(imageUrl);
        this.form.get('position')?.setValue(this.markerPosition);
        console.log(this.form.value);
      },
      error: error => {

      }
    })
    this.form.value;
  }

  addProviderInfo(){
    let form = this.form;
    const providerInfo = {
      title: form.get("name")?.value,
      position: this.markerPosition,
      address: form.get('address')?.value,
      phone: form.get("phone")?.value
    }
    localStorage.setItem('provider'+Math.random(), JSON.stringify(providerInfo));
    
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


  providerForm() {
    this.nextPage = true;
    setTimeout(() => {
      this.initMap();
    }, 0);
  }

  back() {
    this.nextPage = false;
  }

  initMap(){
    if (this.map) {
      this.map.remove();
    }
    this.map = L.map('map', {
      center: [8.76701011626534, -75.86746215820314],
      zoom: 11
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const geocoder = (L.Control as any).geocoder({
      defaultMarkGeocode: false
    }).addTo(this.map);

    geocoder.on('markgeocode', (e: any) => {
      const bbox = e.geocode.bbox;
      const poly = L.polygon([
        bbox.getSouthEast(),
        bbox.getNorthEast(),
        bbox.getNorthWest(),
        bbox.getSouthWest()
      ]).addTo(this.map);
      this.map.fitBounds(poly.getBounds());
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.addOrMoveMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  addOrMoveMarker(lat: number, lng: number): void {
    this.markerPosition = { lat, lng };
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], {
        icon: L.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: 'assets/marker-icon.png',
          shadowUrl: 'assets/marker-shadow.png'
        }),
        draggable: true
      }).addTo(this.map);
      this.marker.on('moveend', (event: any) => {
        const position = event.target.getLatLng();
        this.markerPosition = { lat: position.lat, lng: position.lng };
      });
    }
  }

  constructor(private fb: FormBuilder,
              private productsService:ProductsService
  ) {}

}



