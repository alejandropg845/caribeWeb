import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddProductComponent } from "./add-product/add-product.component";
import { HomeComponent } from "./home/home.component";
import { ProductComponent } from "./product/product.component";
import { SavedComponent } from "./saved/saved.component";
import { MainComponent } from "./main/main.component";
import { CategoriesComponent } from "./categories/categories.component";

export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [

            {
                path: 'add',
                component: AddProductComponent
            },
            {
                path: 'product/:id',
                component: ProductComponent
            },
            {
                path: 'categories',
                component: CategoriesComponent
            },
            {
                path: 'saved',
                component: SavedComponent
            },
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: '**',
                redirectTo: 'home'
            }

        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class PagesRoutingModule { }