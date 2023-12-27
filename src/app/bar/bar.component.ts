import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})

export class BarComponent implements OnInit {
  private data!: any[];
 
  ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.data);
}
  // private data = [
  //   {"Food": "AlooPuri", "Sales": "10", "Released": "2014"},
  //   {"Food": "Roti", "Sales": "15", "Released": "2013"},
  //   {"Food": "Kulcha", "Sales": "40", "Released": "2016"},
  //   {"Food": "Pani Puri", "Sales": "20", "Released": "2010"},
  //   {"Food": "Vada Pav", "Sales": "30", "Released": "2011"},
  // ];
  private svg: any;
  private colors: any;
  // private margin = 50;
  // private width = 750 - (this.margin * 2);
  // private height = 400 - (this.margin * 2);
  private margin = { top: 50, right: 50, bottom: 70, left: 70 };
  private width = 750 - (this.margin.left + this.margin.right);
  private height = 400 - (this.margin.top + this.margin.bottom);
 

  private createSvg(): void {
    // this.svg = d3.select("figure#bar")
    // .append("svg")
    // .attr("width", this.width + (this.margin * 2))
    // .attr("height", this.height + (this.margin * 2))
    // .append("g")
    // .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // Add X-axis label
    this.svg.append("text")
      .attr("transform", "translate(" + (this.width / 2) + " ," + (this.height + this.margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style("font-size","16px")
      // .text("Food");

    // Add Y-axis label
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "5em")
      .style("text-anchor", "middle")
      .style("font-size","16px")
      // .text("Sales");
}
private drawBars(data: any[]): void {

      // bar colors
      this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);
  // Create the X-axis band scale
  const x = d3.scaleBand()
  .range([0, this.width])
  .domain(data.map(d => d.Food))
  .padding(0.2);

  // Draw the X-axis on the DOM
  this.svg.append("g")
  .attr("transform", "translate(0," + this.height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end")
  .style("font-size","14px");

  // Create the Y-axis band scale
  const y = d3.scaleLinear()
  .domain([0, 50])
  .range([this.height, 0]);
  

  // Draw the Y-axis on the DOM
  this.svg.append("g")
  .call(d3.axisLeft(y))
  .style("font-size","14px");

  // Create and fill the bars
  this.svg.selectAll("bars")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d: any) => x(d.Food))
  .attr("y", (d: any) => y(d.Sales))
  .attr("width", x.bandwidth())
  .attr("fill", (d:any, i:any) => this.colors(i))
  .attr("height", 0)
  .on("mouseover", function (event: any, d: any) {
    // Show tooltip on mouseover
    const tooltip = d3.select("#tooltip");
    tooltip.transition().duration(200).style("opacity", .9);
    tooltip.html(`Food: ${d.Food}<br/>Sales: ${d.Sales}`)
      .style("left", (event.pageX+10) + "px")
      .style("top", (event.pageY+10) + "px");
  })
  .on("mouseout", function (d: any) {
    // Hide tooltip on mouseout
    d3.select("#tooltip").transition().duration(500).style("opacity", 0);
  })
  // Adding methods which will do the animated transition of a bar
	// from 0 value, to its current value
	// Also durattion of transition is set to 800 ms
  .transition()
  .duration(800)
  .attr("height", (d: any) => this.height - y(d.Sales))
  .delay((d:any,i:any) => {return i*100});

  d3.select("body")  // Selecting 'body' instead of 'figure#bar'
  .append("div")
  .attr("id", "tooltip")
  .style("position", "absolute")
  .style("background", "lightsteelblue")
  .style("padding", "8px")
  .style("border-radius", "5px")
  .style("opacity", 0);

  


  this.svg.append("text")
      .attr("transform", "translate(" + (this.width / 2) + " ," + (this.height + this.margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Food Items")
      .style("font-size","18px");

    // Add Y-axis label
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - (this.margin.left)-10)
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .text("Total Sales of each food Item")
      .style("font-size","18px");

  
  localStorage.setItem('excelData', JSON.stringify(this.data));
}


onFileChange(event: any): void {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      // Parse the Excel file using the xlsx library
      const workbook = XLSX.read(e.target.result, { type: 'binary' });

      // Assuming the first sheet contains the data
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      
      // Define the required columns
      const requiredColumns = ['Food', 'Sales'];

      // Check if all required columns are present in the sheet
      const sheetColumns = Object.keys(sheet);
      const hasRequiredColumns = requiredColumns.every(column => sheetColumns.includes(column));

      if (!hasRequiredColumns) {
        alert('The Excel file must contain the required columns: Food and Sales');
        return;
      }


      // Convert the sheet data to JSON
      this.data = XLSX.utils.sheet_to_json(sheet);
      

      // Redraw the bars with the new data
      this.drawBars(this.data);
    };

    reader.readAsBinaryString(file);
  }
}


}