import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../shared/user/user.service';
import { CommonModule } from '@angular/common';
import { AddBandMemberComponent } from '../add-band-member/add-band-member.component';
import { state } from '@angular/animations';

@Component({
  selector: 'app-register-band',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    AddBandMemberComponent
  ],
  templateUrl: './register-band.component.html',
  styleUrls: ['./register-band.component.css']
})
export class RegisterBandComponent {
  registerBandForm: FormGroup;
  submitted = false;
  error_message = '';
  band_id = '';
  private latitude = '';
  private longitude = '';
  private user_id : number = 0;
  private user :any;
  private finished = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {

    //Se obtiene el id del usuario
    this.user = this.userService.getUser(); 


    if(this.user && this.user.type !== 'band'){
      this.latitude = this.user.latitude;
      this.longitude = this.user.longitude;
      this.user_id = this.user.user_id;
      console.log(this.user);
    }else{
      // this.router.navigateByUrl("/");
      console.log("no se ha podido obtener el usuario");
    }
    //se reciben las cordenadas del usuario para ponerlas en el formulario
    const state = window.history.state;
    
    
    
    this.registerBandForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(120)]],
      latitude: [this.latitude, [Validators.required]],
      longitude: [this.longitude, [Validators.required]],
      user_id: [this.user_id, [Validators.required]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerBandForm.valid) {
      this.userService.registerBand(this.registerBandForm.value).subscribe({
        next: (data: any) => {
          this.finished = true;
        },
          
        error: (data: any) => {
          console.log('error');
          if (data.status === 422) {
            this.error_message = 'Validation failed';
          } else {
            this.error_message = 'Server error';
          }
        }
      });
    }
  }


  getUserId(): number {
    return this.user_id;
  }

  getLatitude(): string {
    return this.latitude;
  }
  getLongitude(): string {
    return this.longitude;
  }

  getFinished(): boolean {
    return this.finished;
  }
}
