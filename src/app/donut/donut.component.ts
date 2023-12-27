import { Component } from '@angular/core';
import * as d3 from 'd3';
import { Arc, DefaultArcObject } from 'd3';
import { read } from 'xlsx';

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.css']
})
export class DonutComponent {
  
  ngOnInit() {
    this.bindChart();
 
   }

  bindChart(datatest: any[]=[]) {
    // var datatest = [
    
    //   { name: 'Work Hours', value: 49.15, color: '#8CC63E' },

    //   { name: 'Non-Work Hours', value: 7.45, color: '#29AAE3' },

    //   { name: 'Over Time', value: 11, color: '#23B574' },

    //   { name: 'Project Count', value: 13, color: '#296972' },
    // ];
    var width = 300,
      height = 300;

    var outerRadius = width / 2;
    var innerRadius = 100;
    var pie1 = d3
      .pie()
      .value((d: any) => {
        return d.value;
      })
      .sort(null);

    let arc: Arc<any, DefaultArcObject> = d3
      .arc()
      .outerRadius(outerRadius)
      .innerRadius(innerRadius)
      .cornerRadius(3)
      .padAngle(0.015);

    var outerArc = d3.arc().outerRadius(outerRadius).innerRadius(innerRadius);

    var svg: any = d3
      .select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    svg.append('g').attr('class', 'slices');
    svg.append('g').attr('class', 'labelName');
    svg.append('g').attr('class', 'lines');

    var path = svg
      .selectAll('path')
      .data(pie1(datatest as any))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function (d:any) {
        return d.data.color;
      });

    path
      .transition()
      .duration(1000)
      .attrTween('d', function (d:any) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t:any) {
          return arc(interpolate(t));
        };
      });

    var restOfTheData = function () {
      var text = svg
        .selectAll('text')
        .data(pie1(datatest as any))
        .enter()
        .append('text')
        .transition()
        .duration(200)
        .attr('transform', function (d:any) {
          return 'translate(' + arc.centroid(d) + ')';
        })
        .attr('dy', '.4em')
        .attr('text-anchor', 'middle')
        .text(function (d:any) {
          return d.data.value + '%';
        })
        .style('fill', '#fff')
        .style('font-size', '10px');

      var legendRectSize = 20;
      var legendSpacing = 7;
      var legendHeight = legendRectSize + legendSpacing;

      var legend = svg
        .selectAll('.legend')
        .data(datatest)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (d:any, i:any) {
          //Just a calculation for x & y position
          return 'translate(-50,' + (i * legendHeight - 55) + ')';
        });
      legend
        .append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .attr('rx', 20)
        .attr('ry', 20)
        .style('fill', function (d:any) {
          return d.color;
        })
        .style('stroke', function (d:any) {
          return d.color;
        });

      legend
        .append('text')
        .attr('x', 30)
        .attr('y', 15)
        .text(function (d:any) {
          console.log(d.name);
          return d.name;
        })
        .style('fill', function (d:any) {
          return d.color;
        })
        .style('font-size', '14px');
    };

    setTimeout(restOfTheData, 1000);
  }
  readExcelFile(file: File) {
    const reader: FileReader = new FileReader();
  
    reader.onload = (e: any) => {
      const data: string = e.target.result;
      const workbook = read(data, { type: 'binary' });
      
      // Assuming the data is in the first sheet (change if needed)
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      // Convert worksheet to JSON
      const jsonData = JSON.parse(JSON.stringify(worksheet));
  
      // Extract the relevant data structure from jsonData (depends on your Excel format)
      const extractedData = this.extractDataFromExcel(worksheet);
  
      // Call your existing function with the extracted data
      this.bindChart(extractedData);
    };
  
    reader.readAsBinaryString(file);
  }

  // Assuming your Excel file has columns named 'name', 'value', and 'color'
extractDataFromExcel(worksheet: any): any[] {
  const extractedData: any[] = [];

  // Assuming data starts from row 2 (change if needed)
  const startRow = 2;

  // Loop through each row
  for (let i = startRow; worksheet[`A${i}`]; i++) {
    const rowData: any = {};
    
    // Assuming columns are 'A' for name, 'B' for value, and 'C' for color (change if needed)
    rowData.name = worksheet[`A${i}`]?.v;
    rowData.value = worksheet[`B${i}`]?.v;
    rowData.color = worksheet[`C${i}`]?.v;

    extractedData.push(rowData);
  }

  return extractedData;
}


  
  

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.readExcelFile(file);
    }
  }
  


}
