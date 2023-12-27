import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  
  showBar=new BehaviorSubject<boolean>(false);
  showPie=new BehaviorSubject<boolean>(false);
  showScatter=new BehaviorSubject<boolean>(false);
  showDonut=new BehaviorSubject<boolean>(false);
}
