import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import { switchMap } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { ToastrService } from 'ngx-toastr';
import { createProvider } from '../../interfaces/provider.interface';
@Component({
  selector: 'app-add-providers',
  templateUrl: './add-providers.component.html',
  styles: ``
})
export class AddProvidersComponent implements AfterViewInit{

  private map!: L.Map;
  marker: L.Marker | null = null;
  markerPosition = { lat: 0, lng: 0 };
  ProviderForm:FormGroup = this.fb.group({
    name:[null,Validators.required],
    position:[["",""]],
    address:[null,Validators.required],
    phone:[null,[Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
  });

  onSubmit(){

    this.activatedRoute.params
    .pipe(switchMap(({id}) => this.productsService.addProductProviders(id,this.providersLocalStorage)))
    .subscribe({
      next: (res:any) => {
        this.toastr.success(res.message,"Listo");
        localStorage.removeItem('providers');
        localStorage.removeItem('boolean');
        this.router.navigateByUrl("/caribeWeb/home");
      },
      error: (res:any) => {
        this.toastr.error(res.error.message || "Error al agregar información", "Error");
      }
    });
  }

  providersLocalStorage:createProvider[] = JSON.parse(localStorage.getItem('providers')!)

  saveProvider(){
    if(!this.ProviderForm.valid){
      this.toastr.error("Campos faltantes o con errores", "Error"); 
      this.ProviderForm.markAllAsTouched();
      return;
    }

    if(this.markerPosition.lat===0 && this.markerPosition.lng===0){
      this.toastr.error("No has añadido un punto en el mapa", "Error"); 
      return;
    }

    let providers:createProvider[]= this.providersLocalStorage;

    const form = this.ProviderForm;

    const product:createProvider = {
      name: form.get("name")?.value,
      lat: this.markerPosition.lat.toString(),
      lng: this.markerPosition.lng.toString(),
      address: form.get("address")?.value,
      phoneNumber: form.get("phone")?.value
    }

    if(providers === null) {
      providers = []
    }

    providers.push(product);
    localStorage.setItem('providers',JSON.stringify(providers));

    if(this.providersLocalStorage === null){
      this.providersLocalStorage = providers
    }
    this.ProviderForm.reset();
    this.markerPosition = {lat: 0, lng: 0}
    this.marker!.setLatLng([0,0]);
  }

  validateField(field:string){
    let form = this.ProviderForm.get(field);
    return (form?.touched && !form.valid) ? 'border-red-600' : 'border-black';   
  }

  deleteProvidersLS(){
    localStorage.removeItem('providers');
    this.providersLocalStorage = []
  }

  initMap(){
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

  constructor(private fb:FormBuilder, 
              private activatedRoute:ActivatedRoute, 
              private productsService:ProductsService,
              private toastr:ToastrService,
              private router:Router){}

  ngAfterViewInit(): void {
      this.initMap();
      const isTrue = localStorage.getItem('boolean');
      if(isTrue!=="true"){
        this.toastr.error("Acceso denegado!");
        this.router.navigateByUrl("/caribeWeb/home");
      }
  }
}
