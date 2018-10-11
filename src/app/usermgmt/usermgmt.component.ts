import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import {AlertService, UserService } from '../_services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-usermgmt',
  templateUrl: './usermgmt.component.html',
  styleUrls: ['./usermgmt.component.css']
})
export class UsermgmtComponent implements OnInit {

       registerForm: FormGroup;
    loading = false;
    submitted = false;
    currentUser: User;
    users: User[] = [];
    showNew: Boolean = false; 
    showNewButton: boolean=true;
     // It maintains table row index based on selection.
  selectedRow: number;
  userModel : User;
  userid: number;

      submitType: string = 'Save';
  // It maintains table row index based on selection.
  

    constructor(private userService: UserService, private formBuilder: FormBuilder,
        private router: Router,
       
        private alertService: AlertService) {
        
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
                this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
        // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

        onSubmit() {

            if (this.submitType === 'Save')
                {
                    this.submitted = true;

                    // stop here if form is invalid
                    if (this.registerForm.invalid) {
                        return;
                    }

                    this.loading = true;
                    this.userService.register(this.registerForm.value)
                        .pipe(first())
                        .subscribe(
                            data => {
                                this.alertService.success('User added', true);
                                //this.router.navigate(['../login']);
                                this.showNew =false;
                                this.loading = false;
                                this.showNewButton=true
                                this.loadAllUsers() ;
                                
                            },
                            error => {
                                this.alertService.error(error);
                                this.loading = false;
                            });
                }
           else
                {
                                        this.submitted = true;

                    // stop here if form is invalid
                    if (this.registerForm.invalid) {
                        return;
                    }
                     this.userService.update(this.userid,this.registerForm.value)
                        .pipe(first())
                        .subscribe(
                            data => {
                                this.alertService.success('User Updated', true);
                                //this.router.navigate(['../login']);
                                this.showNew =false;
                                this.loading = false;
                                this.showNewButton=true
                                this.loadAllUsers() ;
                                
                            },
                            error => {
                                this.alertService.error(error);
                                this.loading = false;
                            });

                    this.loading = true;
                    this.showNew = false;
                }

    }

    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => { 
            this.loadAllUsers() 
        });
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => { 
            this.users = users; 
        });
    }
    addNew() {
        //this.userModel= new User();
         this.submitType = 'Save';
        this.showNew = true;
        this.showNewButton= false;
        
            
        this.registerForm.setValue({
            firstName: '',
            lastName: '',
            username: '',
            password: ''
        })
       
    } 

    onEdit(index: number){
           // Assign selected table row index.
    this.selectedRow = index;   
  
        
    // Initiate new registration.
  this.userModel = new User();
    // Retrieve selected registration from list and assign to model.
    this.userModel = Object.assign({}, this.users[this.selectedRow])
        this.registerForm.setValue({
            firstName: this.userModel.firstName,
            lastName: this.userModel.lastName,
            username: this.userModel.username,
            password: this.userModel.password
        })     

    this.userid=this.userModel.id
    // Change submitType to Update.
    this.submitType = 'Update';
    // Display registration entry section.
    this.showNew = true;

    
    }

    onCancel(){

        this.showNew =false;
        this.showNewButton= true;

    }

}
