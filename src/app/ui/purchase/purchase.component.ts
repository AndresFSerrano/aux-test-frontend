import { Component, OnInit } from '@angular/core';
import { Purchase } from '../../interfaces/Purchase';
import { Page } from '../../interfaces/Pagination';
import { PurchaseService } from '../../services/purchases/purchase.service';
import { UserService } from '../../services/users/user.service';
import { User } from '../../interfaces/User';
import { Product } from '../../interfaces/Product';
import { ProductService } from '../../services/Products/product.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  purchases: Purchase[] = [];
  users: User[] = [];
  products: Product[] = [];
  newPurchase: Purchase = { id: null, userId: 0, productId: 0, totalProducts: 1 };
  isLoading: boolean = false;
  hasError: boolean = false;
  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  constructor(
    private purchaseService: PurchaseService,
    private userService: UserService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadProducts();
  }

  loadPurchases(): void {
    this.isLoading = true;
    this.hasError = false;
    this.purchaseService.getPurchases(this.page, this.size).subscribe(
      (data: Page<Purchase>) => {
        this.purchases = data.content;
        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
      (error: any) => {
        this.hasError = true;
        this.isLoading = false;
        console.error('Error loading purchases', error);
      }
    );
  }

  loadPurchasesByUser(): void {
    this.isLoading = true;
    this.hasError = false;
    this.purchaseService.getPurchasesByUserId(1, this.page, this.size).subscribe(
      (data: Page<Purchase>) => {
        this.purchases = data.content;
        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
      (error: any) => {
        this.hasError = true;
        this.isLoading = false;
        console.error('Error loading purchases by user', error);
      }
    );
  }

  loadPurchasesByProduct(): void {
    this.isLoading = true;
    this.hasError = false;
    this.purchaseService.getPurchasesByProductId(1, this.page, this.size).subscribe(
      (data: Page<Purchase>) => {
        this.purchases = data.content;
        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
      (error: any) => {
        this.hasError = true;
        this.isLoading = false;
        console.error('Error loading purchases by product', error);
      }
    );
  }

  loadUsers(): void {
    this.userService.getUsers(0, 100).subscribe(
      (data) => (this.users = data.content),
      (error) => console.error('Error loading users', error)
    );
  }

  loadProducts(): void {
    this.productService.getProducts(0, 100).subscribe(
      (data) => (this.products = data.content),
      (error) => console.error('Error loading products', error)
    );
  }

  createPurchase(): void {
    this.purchaseService.createPurchase(this.newPurchase).subscribe(
      () => {
        this.loadPurchases();
        this.newPurchase = { id: null, userId: 0, productId: 0, totalProducts: 1 };
      },
      (error: any) => console.error('Error creating purchase', error)
    );
  }

  deletePurchase(id: number): void {
    this.purchaseService.deletePurchase(id).subscribe(
      () => this.loadPurchases(),
      (error: any) => console.error('Error deleting purchase', error)
    );
  }

  getUsernameById(userId: number): string {
    const user = this.users.find((u) => u.userId === userId);
    return user ? user.username : 'Usuario no encontrado';
  }

  getProductNameById(productId: number): string {
    const product = this.products.find((p) => p.productId === productId);
    return product ? product.productName : 'Producto no encontrado';
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadPurchases();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadPurchases();
    }
  }
}
