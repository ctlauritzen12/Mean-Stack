import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { TripDataService } from '../services/trip-data.service';
import { Trip } from '../models/trip';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service'; // Import AuthenticationService
import { jwtDecode } from 'jwt-decode'; // Correct default import

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrls: ['./edit-trip.component.css']
})
export class EditTripComponent implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService,
    private http: HttpClient,
    private authService: AuthenticationService // Inject AuthenticationService
  ) {}

  ngOnInit(): void {
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something went wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }
    console.log('EditTripComponent::ngOnInit');
    console.log('tripcode:' + tripCode);
    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.tripDataService.getTrip(tripCode).subscribe({
      next: (value: any) => {
        this.trip = value;
        value[0].start = new Date(value[0].start).toISOString().split('T')[0]; // Convert date format
        this.editForm.patchValue(value[0]);
        if (!value) {
          this.message = 'No Trip Retrieved!';
        } else {
          this.message = 'Trip: ' + tripCode + ' retrieved';
        }
        console.log(this.message);
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    });
  }

  public onSubmit() {
    this.submitted = true;
    if (this.editForm.valid) {
      const token = this.authService.getToken();
      console.log('Token:', token); // Log the token to verify

      // Decode the token to check the issued date and expiration date
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);

      const issuedAt = new Date(decodedToken.iat * 1000);
      console.log('Issued At:', issuedAt); // Log the issued date

      const expirationDate = new Date(decodedToken.exp * 1000);
      console.log('Token Expiration Date:', expirationDate); // Log the expiration date

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}` // Include the token in the headers
      });

      this.http.put('http://localhost:3000/api/trips/MEGR220119', this.editForm.value, { headers })
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.log('Error:', error);
            if (error.status === 401) {
              console.error('Unauthorized: Check your token and permissions.');
            }
          }
        });
    }
  }

  get f() { return this.editForm.controls; }
}
