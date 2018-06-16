import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {ParseService} from '../parse.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  lists:any[] = [];

  shoppingItems:any[]=[];

  totalPaid:number=0;

  constructor(private router:Router,private parseService : ParseService) { }

  ngOnInit() {
    let user = this.parseService.currentUser();
    if(!user){
      this.router.navigateByUrl('login');
    }
    this.fetchShoppingLists();
    this.fetchAllShoppings();
  }

  fetchShoppingLists(){
    console.log('fetching shopping lists');
    this.parseService.fetchShoppingLists().then((lists:any)=>{
      this.lists = lists.map(list=>{
        return {name:list.get('name'),id:list.id}
      })
    })
  }

  fetchAllShoppings(){
    this.parseService.fetchAllShoppings().then((results:any)=>{
      let items =results.map(r=>{
        return {
          title:r.get('title'),
          tag:r.get('tag'),
          description:r.get('description'),
          price:r.get('price')
        }
      });
      this.shoppingItems = items;
      this.totalPaid = this.shoppingItems.reduce((t,i)=>{
        return t+i.price;
      },0)
      console.log(items);
    })
  }

  deleteList(listId){
    this.parseService.deleteShoppingList(listId).then(()=>{
      this.fetchShoppingLists();
    })
  }

}
