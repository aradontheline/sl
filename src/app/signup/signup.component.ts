import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {ParseService} from '../parse.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user:User ={
    email:"",
    pass:"",
    phone:""
  }

  constructor(private parseService : ParseService,private router:Router) { }

  ngOnInit() {
    let currrentUser = this.parseService.currentUser();
    if(currrentUser){
      this.router.navigateByUrl('home');
    }
  }

  signUp(){
    this.parseService.signUp(this.user)
    .then(
      (user:any)=>{
        console.log(`user ${user.get('username')} created`);
        let currentUser = this.parseService.currentUser();
        if(currentUser){
          console.log('logged in');
        }
        this.router.navigateByUrl('home');
      }
    )
    .catch(
      (err)=>{
        console.log(`Error ${err.message}`);
      }
    )
  }
}

interface User {
  email:string;
  pass:string;
  phone:string;
}
