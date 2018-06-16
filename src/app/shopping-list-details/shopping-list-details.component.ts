import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import {ParseService} from '../parse.service';


@Component({
  selector: 'app-shopping-list-details',
  templateUrl: './shopping-list-details.component.html',
  styleUrls: ['./shopping-list-details.component.css']
})
export class ShoppingListDetailsComponent implements OnInit {

  shoppingList:any;
  search:string;
  foundUsers:any;
  shoppingListId:string;
  shoppingListMembers:any;
  shoppingItem={
    title:'',
    tag:'',
    description:''
  };
  shoppingItems:any;
  itemDoneState:boolean[]=[false];
  itemPrice:number[] = [0];
  currentUser:any;
  shoppingItemsTotalPrice:number=0;



  constructor(private route: ActivatedRoute,private parseService:ParseService, private router:Router) { }

  ngOnInit() {
    let user = this.parseService.currentUser();
    if(!user){
      this.router.navigateByUrl('login');
    }
    this.currentUser = user.get('username');    
    this.fetchShoppingListDetails();
  }

  fetchShoppingListDetails(){
    this.shoppingListId = this.route.snapshot.paramMap.get('id');
    this.parseService.fetchShoppingListDetails(this.shoppingListId).then((list:any)=>{
      if(list.get('shoppingItems')){
        this.shoppingItemsTotalPrice = list.get('shoppingItems').map((item)=>{
          if(item.get('price')){
            return item.get('price');
          }else{
            return 0
          }
          }).reduce((sum,item)=>{
            return sum+item;
          },0)
        console.log('total price: ', this.shoppingItemsTotalPrice);
        let itemList = list.get('shoppingItems').map((item,i)=>{
          let doneBy = item.get('doneBy');
          if(doneBy){
            return ({
              title:item.get('title'),
              tag:item.get('tag'),
              description:item.get('description'),
              done:item.get('done'),
              doneBy:item.get('doneBy').get('username'),
              price:item.get('price'),
              id:item.id
            })
          }else{
            return ({
              title:item.get('title'),
              tag:item.get('tag'),
              description:item.get('description'),
              done:item.get('done'),
              doneBy:item.get('doneBy'),
              price:item.get('price'),
              id:item.id
            })
          }          
          }).sort((a,b)=>{
            if(a.tag<b.tag){
                return -1
            }else if(a.tag>b.tag){
                return 1;
            }else{
                return 0;
            }
          }).sort((a,b)=>{
            if(a.done){
                if(b.done){
                    return 0
                }else{
                    return 1
                }
            }else if(b.done){
                return -1
            }else{
                return 0
            }
          });
        
        this.shoppingItems = itemList;
        this.shoppingItems.map((item,i)=>{
          console.log(item.done);
          this.itemDoneState[i] = item.done
        })
        console.log(this.shoppingItems,this.itemDoneState);
      }
      this.shoppingListMembers = list.get('members').map(member=>{
        return ({
          username:member.get('username'),
          id:member.id
        })
      });
      this.shoppingList = {
        name:list.get('name'),
        id:list.id,
        owner:list.get('owner').get('username')
      }
    })
  }

  searchUsers(){
    console.log(this.search);
    this.parseService.findUser(this.search).then((users:any)=>{
      this.foundUsers = users.map(user=>{
        console.log(user);
        return {
          email:user.get('username'),
          id:user.id
        }
      })
      console.log(this.foundUsers);
    })
  }

  addMember(memberId){
    this.parseService.addMemberToShoppingList(memberId,this.shoppingListId)
    .then(()=>{
      this.fetchShoppingListDetails();
    })
    .catch(error=>{
      console.log(error.message)
    })
  }

  addShoppingItem(){
    console.log(this.shoppingItem);
    this.parseService.addShoppingItem(this.shoppingItem,this.shoppingListId).then(()=>{
      this.fetchShoppingListDetails();
      this.shoppingItem ={
        title:'',
        tag:'',
        description:''
      };
    })
  }

  updateItem(shoppingItemId,shoppingItemDoneState,shoppingItemPrice){
    //console.log('Item id: ', shoppingItemId,' done : ', shoppingItemDoneState,' Price: ', shoppingItemPrice);
    this.parseService.updateShoppingItemState(shoppingItemId,shoppingItemDoneState,shoppingItemPrice).then(()=>{
      console.log('item updated');
      this.fetchShoppingListDetails();
    })
  }

  deleteItem(shoppingItemId){
    //console.log(shoppingItemId);
    this.parseService.deleteShoppingItem(shoppingItemId).then(()=>{
      console.log('item deleted ');
      this.fetchShoppingListDetails();
    })
  }
}
