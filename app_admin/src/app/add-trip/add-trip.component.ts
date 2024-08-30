import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from "@angular/forms";
import { Router } from "@angular/router";
import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
    })

export class AddTripComponent implements OnInit {
  addForm!: FormGroup;
submitted = false;

constructor(
private formBuilder: FormBuilder,
private router: Router,
private tripService: TripDataService,
private authService: AuthenticationService
) { }

ngOnInit() {
this.addForm = this.formBuilder.group({
_id: [],
code: ['', Validators.required],
name: ['', Validators.required],
length: ['', Validators.required],
start: ['', Validators.required],
resort: ['', Validators.required],
perPerson: ['', Validators.required],
image: ['', Validators.required],
description: ['', Validators.required],
})
}

public onSubmit() {
  this.submitted = true;
    if(this.addForm.valid){
      const token = this.authService.getToken(); // Get the token
      console.log('Token:', token); // Log the token to verify

      this.tripService.addTrip(this.addForm.value, token) // Pass the token to the service method

        //this.tripService.addTrip(this.addForm.value)
        .subscribe( {
        next: (data: any) => {
console.log(data);
this.router.navigate(['']);
},
error: (error: any) => {
  console.log('Error: ' + error);
}});
}
}
// get the form short name to access the form fields
get f() { return this.addForm.controls; }


}
