import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  mensaje!: string;
  private isEmail = /\S+@\S+\.\S+/;
  navigationExtras: NavigationExtras ={
    state:{
      value: null
    }
  }
  private subscription: Subscription | undefined;
  hide = true;

  constructor(private _ele : ElementRef,private router: Router,
    private fb: FormBuilder, private authService: AuthService ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
   }
  

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
   
  async userLogin(){
    try{
      if(this.loginForm.invalid){
        return;
      }
      var {email, password} =  this.loginForm.value;
      this.subscription = this.authService.login(email,password).subscribe(data =>{
        const login: any = data;
        if (login.auth) {
          this.navigationExtras.state = login.user;
          this.router.navigate(['sgri'], this.navigationExtras);
          this.mensaje = '';
          
        } else {
          this.mensaje = 'Email o clave incorrecta';
        }
        
      });
      

    }catch(error){
      this.mensaje = 'Ha ocurrido un error , intentelo de nuevo';
      console.log(error);

    }
    
  }

  getErrorMessage(field: string): string{
    let message = '';
    if(this.loginForm.get(field)?.errors?.required){
      message = 'Debe entrar un valor.';
    }else if(this.loginForm.get(field)?.hasError('pattern')){
      message= 'Email no válido.'
    }else if(this.loginForm.get(field)?.hasError('minlength')){
      const minLength = this.loginForm.get(field)?.errors?.minlength.requiredLength;
      message = `La contraseña debe tener ${minLength} caracteres o más.`
    }
      return message;
  }

  isValidField(field: string): boolean{
   let value = false;
   if((this.loginForm.get(field)?.touched || this.loginForm.get(field)?.dirty) && !this.loginForm.get(field)?.valid){
     value = true;
   }
   return value;
  }

  

  

}
