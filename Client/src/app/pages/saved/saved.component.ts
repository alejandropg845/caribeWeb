import { Component } from '@angular/core';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-wish-list',
  templateUrl: './saved.component.html',
  styles: ``
})
export class SavedComponent {

  savedProducts:Product[] = JSON.parse(localStorage.getItem('savedProducts')!) || [];

  deleteFromSaved(productId:number){
    const product = this.savedProducts.findIndex(product => product.id === productId);
    if(product !== null){
      this.savedProducts.splice(product,1)
      localStorage.setItem('savedProducts', JSON.stringify(this.savedProducts));
    }
    
  }

  calculateStarAverage(product:Product){
    let average = 0
    if(product.votes > 0) 
      average = product.rating / product.votes;
    else average = 0;
    return average;
  }

}
