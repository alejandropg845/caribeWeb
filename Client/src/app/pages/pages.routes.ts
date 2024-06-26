import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddProductComponent } from "./add-product/add-product.component";
import { HomeComponent } from "./home/home.component";
import { ProductComponent } from "./product/product.component";
import { SavedComponent } from "./saved/saved.component";
import { MainComponent } from "./main/main.component";
import { CategoriesComponent } from "./categories/categories.component";
import { AddProvidersComponent } from "./add-providers/add-providers.component";
import { EditProductComponent } from "./edit-product/edit-product.component";
import { EditProvidersComponent } from "./edit-providers/edit-providers.component";

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
                path:'add_provider/:id',
                component: AddProvidersComponent
            },
            {
                path: 'edit_product/:id',
                component: EditProductComponent
            },
            {
                path: 'edit_providers/:id',
                component: EditProvidersComponent
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