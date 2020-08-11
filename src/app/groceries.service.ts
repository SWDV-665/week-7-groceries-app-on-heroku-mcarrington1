import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Injectable({
	providedIn: 'root'
})

export class GroceriesService {
  items: any = [];
  
  dataChanged$ : Observable<boolean>;

  private dataChangeSubject: Subject<boolean>;

  baseURL = 'https://groceries-server-mcarrington.herokuapp.com';

  constructor(private http: HttpClient) {
    console.log('Hello Groceries');
    
    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }

  getItems(): Observable<object[]> {
    return this.http.get(this.baseURL + '/api/groceries').pipe( map(this.extractData), catchError(this.handleError)
    );
  }

  private extractData(res: Response){
    let body = res;
    return (body || {}) as object[];
  }

  private handleError(error: Response | any){
    let errMsg : string;
    if(error instanceof Response){
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }else{
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
 
  removeItem(item){
    console.log("Removing Item :: ", item)
    this.http.delete(this.baseURL + '/api/groceries/' + item._id).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }
 
  addItem(item){
    console.log("Adding Item :: ", item)
    this.http.post(this.baseURL+'/api/groceries/', item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }
  
  editItem(item, index){
    console.log("Editing Item to :: ", item)
    this.http.put(this.baseURL+'/api/groceries/'+ item._id, item).subscribe(res => {
      this.items[index] = res;
      this.dataChangeSubject.next(true);
    });
  }
}