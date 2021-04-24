import {Component} from '@angular/core';
import {first} from 'rxjs/operators';

import {User} from '@app/models';
import {UserService, AuthenticationService} from '@app/services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({templateUrl: 'home.component.html'})
export class HomeComponent {
  loading = false;
  users: User[];
  error: string;
  eerror: string;
  loginForm: FormGroup;
  eloginForm: FormGroup;
  submitted = false;
  esubmitted = false;
  username: string;
  password: string;
  fn: string;
  sn: string;
  eusername: string;
  epassword: string;
  efn: string;
  esn: string;
  toedit = 0;


  constructor(private userService: UserService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.eloginForm = this.formBuilder.group({
      eusername: ['', Validators.required],
      efirstName: ['', Validators.required],
      elastName: ['', Validators.required],
      epassword: ['', Validators.required]
    });
    this.loading = true;
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.loading = false;
      this.users = users;
    });
  }

  get f() {
    return this.loginForm.controls;
  }
  get ef() {
    return this.eloginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.createUser(this.username, this.password, this.fn, this.sn).pipe(first()).subscribe(users => {
        this.loading = false;
        this.users = users;
        console.log(users);
      },
      error => {
        this.error = error;
        this.loading = false;
      });
  }
  onSubmitChanges() {
    this.esubmitted = true;
    if (this.eloginForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.editUser(this.toedit, this.eusername, this.epassword, this.efn, this.esn).pipe(first()).subscribe(users => {
      console.log(1);
      this.loading = false;
        this.users = users;
      },
      error => {
        this.eerror = error;
        this.loading = false;
      });
  }

  deleteUser(id) {
    this.loading = true;
    this.userService.deleteUser(id).pipe(first()).subscribe(users => {
        this.loading = false;
        this.users = users;
      },
      error => {
        this.loading = false;
      });
  }

}
