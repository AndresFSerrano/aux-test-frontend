import { Component, OnInit } from '@angular/core';
import { Page } from '../../interfaces/Pagination';
import { User } from '../../interfaces/User';
import { UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  page: number = 0;
  size: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  isLoading: boolean = false;
  hasError: boolean = false;

  newUser: User = { userId: null, username: '', email: '', password: '' };
  isEditing: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.hasError = false;

    this.userService.getUsers(this.page, this.size).subscribe(
      (data: Page<User>) => {
        this.users = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching users', error);
        this.hasError = true;
        this.isLoading = false;
      }
    );
  }

  createUser(): void {
    this.userService.createUser(this.newUser).subscribe(
      () => {
        this.loadUsers();
        this.newUser = { userId: null, username: '', email: '', password: '' };
      },
      (error) => console.error('Error creating user', error)
    );
  }

  editUser(user: User): void {
    this.newUser = { ...user };
    this.isEditing = true;
  }

  updateUser(): void {
    if (this.newUser.userId != null) { // Verifica que userId no sea null o undefined
      this.userService.updateUser(this.newUser.userId, this.newUser).subscribe(
        () => {
          this.loadUsers();
          this.isEditing = false;
          this.newUser = { userId: null, username: '', email: '', password: '' };
        },
        (error) => console.error('Error updating user', error)
      );
    } else {
      console.error('Error: userId is undefined');
    }
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => this.loadUsers(),
      (error) => console.error('Error deleting user', error)
    );
  }
  
  cancelEdit(): void {
    this.isEditing = false;
    this.newUser = { userId: null, username: '', email: '', password: '' };
  }
  

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadUsers();
    }
  }
}
