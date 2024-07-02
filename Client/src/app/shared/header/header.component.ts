import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {

  mode = localStorage.getItem('mode');
  isAdmin!:boolean;
  setUserView(){
    localStorage.setItem('mode', 'user');
    this.mode = localStorage.getItem('mode');
    this.productsService.setBoolean(false);
  }

  setAdminView(){
    localStorage.setItem('mode', 'admin')
    this.mode = localStorage.getItem('mode');
    this.productsService.setBoolean(true);
  }

  constructor(private router:Router, private productsService:ProductsService){}

}
