import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'tkl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public credentials = {
    name: '',
    password: ''
  };

  public error: string;

  constructor(private router: Router, private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  login(): void {
    this.error = null;
    from(this.afAuth.signInWithEmailAndPassword(this.credentials.name, this.credentials.password))
      .subscribe(
        () => this.router.navigate(['/todos']),
        () => this.error = 'Uw gebruikersnaam of paswoord is bij ons niet bekend.'
      );
  }

}
