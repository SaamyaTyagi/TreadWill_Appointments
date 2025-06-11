import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { catchError, filter, map, Observable, throwError } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient,
     ) { }



  checkDocEmail(email: string): Observable<any> {
     const url = 'https://api3.treadwill.org:8004/api/v1/docs_portal/doc_email/' ;
    return this.http.get(url + email);
  }
  postProfileData(formData: any): Observable<any> {
    const url = 'https://api3.treadwill.org:8004/api/v1/docs_portal/doc_profile_obj/';
    return this.http.post(url, formData);
  }
  getInterventions(): Observable<any[]> {
    const url = 'https://api3.treadwill.org:8004/api/v1/docs_portal/interventions/';
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching interventions:', error);
        // Optionally, transform or log error before rethrowing
        return throwError(() => new Error('Failed to fetch interventions.'));
      })
    );
  }
  getInterventionSequenceData(intervention_name: string): Observable<any> {
    const url = 'https://api3.treadwill.org:8004/api/v1/docs_portal/intervention_sequence/';
    return this.http.get<any>(url+ intervention_name).pipe(
      catchError((error) => {
        console.error('Error fetching intervention sequence data:', error);
        // Optionally, transform or log error before rethrowing
        return throwError(() => new Error('Failed to fetch intervention sequence data.'));
      })
    );
  }

  postUserData(userData: any): Observable<any> {
    const url = 'https://api3.treadwill.org:8004/api/v1/docs_portal/docsuser/';
    return this.http.post(url, userData);
  }

   getDocUsersList(email: string): Observable<any[]> {
    const url = 'https://api3.treadwill.org:8004/api/v1/docs_portal/docsuserlist/'+ email;
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching Users list:', error);
        // Optionally, transform or log error before rethrowing
        return throwError(() => new Error('Failed to fetch Users list.'));
      })
    );
  }

// To get sequence for an intervention for a docsuser
   getDocUsersIntervention(useremail: string): Observable<any[]> {
    const url = 'https://api3.treadwill.org:8004/api/v1/docs_portal/userintervention/'+ useremail;
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching Users list:', error);
        // Optionally, transform or log error before rethrowing
        return throwError(() => new Error('Failed to fetch Users list.'));
      })
    );
  }

 // To create an intervention for a docsuser 
   postUserIntervention(userData: any): Observable<any> {
    const url = 'https://api3.treadwill.org:8004/api/v1/docs_portal/userintervention/';
    return this.http.post(url, userData);
  }

  // To get sequence in an intervention for a docsuser
// /<str:useremail>-<str:intervention_name>

   getDocUsersInterventionSequence(useremail: string, intervention: string): Observable<any[]> {
    const url = 'https://api3.treadwill.org:8004/api/v1/docs_portal/userinterventionsequence/'+ useremail + '-' + intervention;
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching Users list:', error);
        // Optionally, transform or log error before rethrowing
        return throwError(() => new Error('Failed to fetch Users list.'));
      })
    );
  }


}
