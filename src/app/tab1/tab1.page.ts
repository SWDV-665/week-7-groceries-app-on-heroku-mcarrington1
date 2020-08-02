import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { GroceriesService } from '../groceries.service';
import { InputDialogService } from '../input-dialog.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  title = "Grocery"
  
  items = [];
  errorMessage: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController, public dataService: GroceriesService, public inputDialogService: InputDialogService, public socialSharing: SocialSharing) {
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });
  }
  
  ngOnInit() {
    console.log("Page loading...")
    this.loadItems();
  }

  loadItems() {
    this.dataService.getItems()
      .subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error
        );
  }

   // Add Item
  addItem() {
    console.log('Adding Item...');
    this.inputDialogService.showAlert();
  } 

  // Edit Item
  async editItem(item, index) {
    console.log('Edit Item Clicked - ', item, index);
    this.inputDialogService.showAlert(item, index);
  }

  // Remove Item
 async removeItem(item) {
    console.log("Remove Item Button Clicked :: ", item);
    this.dataService.removeItem(item);
 }

 // Share Item
 async shareItem(item, index){
  console.log("Sharing Item -", item, index);
  const toast = await this.toastCtrl.create({
    message: 'Sharing Item - ' + index + " ...",
    duration: 3000
  });
  toast.present();
  
  let message = "Grocery Item - Name : " + item.name + " - Quantity: " + item.quantity;
  let subject = "Shared via Groceries app";

  this.socialSharing.share(message, subject).then(() => {
    // Sharing via email is possible
    console.log("Shared successfully!")
  }).catch((error) => {
    // Sharing via email is not possible
    console.error("Error while sharing ", error)
  });
}
}