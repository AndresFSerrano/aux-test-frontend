import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/Product';
import { Page } from '../../interfaces/Pagination';
import { ProductService } from '../../services/Products/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = { productId: null, productName: '', productPrice: 0, productImage: '' };
  isEditing: boolean = false;
  isLoading: boolean = false;
  hasError: boolean = false;
  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.hasError = false;
    this.productService.getProducts(this.page, this.size).subscribe(
      (data: Page<Product>) => {
        this.products = data.content;
        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
      (      error: any) => {
        this.hasError = true;
        this.isLoading = false;
        console.error('Error loading products', error);
      }
    );
  }

  createProduct(): void {
    this.productService.createProduct(this.newProduct).subscribe(
      () => {
        this.loadProducts();
        this.resetForm();
      },
      (      error: any) => console.error('Error creating product', error)
    );
  }

  editProduct(product: Product): void {
    this.isEditing = true;
    this.newProduct = { ...product };
  }

  updateProduct(): void {
    if (this.newProduct.productId !== null) {
      this.productService.updateProduct(this.newProduct.productId!, this.newProduct).subscribe(
        () => {
          this.loadProducts();
          this.resetForm();
        },
        (error: any) => console.error('Error updating product', error)
      );
    }
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(
      () => this.loadProducts(),
      (error: any) => console.error('Error deleting product', error)
    );
  }

  resetForm(): void {
    this.isEditing = false;
    this.newProduct = { productId: null, productName: '', productPrice: 0, productImage: '' };
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadProducts();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadProducts();
    }
  }
}
