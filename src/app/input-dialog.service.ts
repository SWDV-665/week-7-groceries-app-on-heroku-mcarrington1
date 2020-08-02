import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GroceriesService } from './groceries.service';

@Injectable({
  providedIn: 'root'
})
export class InputDialogService {

  async showAlert(item?, index?) {
    const alert = await this.alertCtrl.create({
      header: item? 'Edit Item' : 'Add Item',
      message: item? 'Please edit item...' : "Please enter item...",
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name',
          value: item? item.name : null
        },
        {
          name: 'quantity',
          type: 'number',
          value: item? item.quantity: null,
          placeholder: 'Quantity'
        }
      ],
      
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }, 
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked :: ', data);
            if (index !== undefined){

              item.name = data.name;
              item.quantity = data.quantity;
            
              this.dataService.editItem(item, index);
            }
            else{
              this.dataService.addItem(data);
            }
          }
        }
      ]
    });

    await alert.present();
  }
  constructor(public dataService: GroceriesService, public alertCtrl: AlertController) { }
}