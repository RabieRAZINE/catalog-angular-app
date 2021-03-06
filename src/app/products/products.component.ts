import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Product } from '../model/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products! : Array<Product>;
  currentPage : number=0;
  pageSize : number=5;
  totalPages : number=0;
  errorMessage! : string;
  searchFormGroup! : FormGroup;

  constructor(private productService : ProductService, private fb : FormBuilder ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword : this.fb.control(null)
    });
    this.handleGetPageProducts();
  
  }
  handleGetPageProducts(){
    this.productService.getPageProducts(this.currentPage, this.pageSize).subscribe({
      next : (data) =>{
        this.products = data.products;
        this.totalPages = data.totalPages;
        console.log(this.totalPages);
      },
      error : (err) => {
        this.errorMessage = err;

      }
    });
  }

  handleGetAllProducts(){
    this.productService.getAllProducts().subscribe({
      next : (data) =>{
        this.products = data;
      },
      error : (err) => {
        this.errorMessage = err;

      }
    });
  }

  handleDeleteProduct(p: Product) {
    let conf = confirm("Are you sure?");
    if(conf == false) return;
    this.productService.deleteProduct(p.id).subscribe(
      {
        next : (data) =>{
          //this.handleGetAllProducts();
          let index = this.products.indexOf(p);
          this.products.splice(index,1);
        }
      })
    
  }

  handleSetPromotion(p:Product){
    let promo = p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next : (data) => {
        p.promotion =! promo;
      },
      error : err => {
        this.errorMessage = err;
      }
    })

  }

  handleSearchProducts() {
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProducts(keyword).subscribe({
      next : (data) =>{
        this.products = data;
      }
    })
  }


  gotoPage(i : number){
    this.currentPage=i;
    this.handleGetPageProducts();
  }
}
