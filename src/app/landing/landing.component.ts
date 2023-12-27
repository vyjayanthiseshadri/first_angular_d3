import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as d3 from 'd3';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  constructor(private commonService:CommonService,private router: Router) {}

  ngOnInit(): void {
    
    this.commonService.showPie.next(false);
    this.commonService.showBar.next(false);
    this.commonService.showScatter.next(false);
    this.commonService.showDonut.next(false);

  }

  

  showDialog = false;
  selectedChartType = '';
  chartData: any; // Store D3 chart data here


  
generateChart(): void {
  d3.select('#chart').selectAll('*').remove();
  this.commonService.showPie.next(false);
    this.commonService.showBar.next(false);
    this.commonService.showScatter.next(false);
    this.commonService.showDonut.next(false);

  switch (this.selectedChartType) {
    case 'bar':
      this.commonService.showBar.next(true);
      this.showDialog = false;
      break;

      case 'pie':
      this.commonService.showPie.next(true);
      this.showDialog = false;
      break;


      case 'scatter':
        this.commonService.showScatter.next(true);
          this.showDialog = false;
        break;

        case 'donut':
          this.commonService.showDonut.next(true);
            this.showDialog = false;
          break;

    default:
      console.error('Invalid chart type');
  }
  
}

 
  
  dialog(): void {
      this.showDialog = true;
  }
  
  

  closeDialog(): void {
    this.showDialog = false;
  }

  logout() {
    this.router.navigate(['/login']);
  }
}




