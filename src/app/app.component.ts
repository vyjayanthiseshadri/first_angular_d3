import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from './common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-d3';
  showBar: boolean =false ;
  showPie: boolean =false ;
  showScatter: boolean =false ;
  showDonut: boolean =false ;

  constructor(private commonService: CommonService){
  }

  ngOnInit(): void {
    this.commonService.showBar.subscribe(res=>
    {      
       console.log(res);
        this.showBar = res;
    });

    this.commonService.showPie.subscribe(res =>{
      console.log(res);
      this.showPie=res;
    });

    this.commonService.showScatter.subscribe(res =>{
      console.log(res);
      this.showScatter=res;
    });

    this.commonService.showDonut.subscribe(res =>{
      console.log(res);
      this.showDonut=res;
    });
  }
}
