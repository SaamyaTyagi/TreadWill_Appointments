import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as CountryCodes from '../../../../assets/doc-portal/CountryCodes.json';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import {
  ISDOCUSER
} from '@/app.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit{
  selectedCountry: string = '';
  selectedCountryCode: string = '';
  countries: {code:string, name:string}[] = (CountryCodes as any).default;
  professions = ['Psychiatrist', 'Psychologist', 'Social worker', 'Other'];
  user = {
    address: '',
    city: '',
    mobile: '',
    degree: '',
    profession: '',
    otherProfession: '',
  };
  showLoginPage = true;
  emailid = 'l.goyal18@gmail.com';

   constructor(private router: Router, private auth: AuthService) {
    console.log(CountryCodes); 
  }

  ngOnInit() {
            // if (!window.localStorage.getItem(ISDOCUSER)){
            //   this.showLoginPage = true;

            // } else {
            //   this.router.navigate(['/main/doc/my-user']);
            // }

  this.auth.checkDocEmail(this.emailid).subscribe({
      next: (response) => {
        console.log('Success:', response);
        if(response){
          if(response.data.doc_found) {
            this.router.navigate(['/main/doc/my-user']);
            window.localStorage.setItem(ISDOCUSER, 'true'); 
          } else {
              // this.router.navigate(['/main/doc/my-user']);
              // make the user login
          }
        }
      }
    });

  }

  onCountryChange() {
    const country = this.countries.find(c => c.code === this.selectedCountry);
    this.selectedCountryCode = country ? country.code : '';
  }

  onProfessionChange() {
    if (this.user.profession !== 'Other') {
      this.user.otherProfession = '';
    }
  }

  submitForm() {
    const formData = {
      emailid: 'sneh',
      address: this.user.address,
      country: this.selectedCountry,
      city: this.user.city,
      mobile_number_country_code: '+91',
      mobile_number: this.user.mobile,
      highest_degree: this.user.degree,
      profession: this.user.profession,
    };

    console.log('Submitting form data:', formData);

    this.auth.postProfileData(formData).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.router.navigate(['/main/doc/my-user']);
        window.localStorage.setItem(ISDOCUSER, 'true');      },
      error: (error) => {
        console.error('Error:', error);
        this.router.navigate(['/main/doc/my-user']);
      }
    });
  }
}