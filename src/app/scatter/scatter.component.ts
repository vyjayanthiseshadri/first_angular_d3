import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-scatter',
  templateUrl: './scatter.component.html',
  styleUrls: ['./scatter.component.css']
})
  export class ScatterComponent implements OnInit {
    private data_excel!: any[];

    ngOnInit(): void {
      this.createSvg();
    if (this.data_excel) {
      this.drawPlot(this.data_excel);
    }
  }
    // private data = [
    //   {"Location": "Bengaluru", "SalesAll": "166443", "Opened": "2014"},
    //   {"Location": "Hyderabad", "SalesAll": "150793", "Opened": "2013"},
    //   {"Location": "Mumbai", "SalesAll": "62342", "Opened": "2016"},
    //   {"Location": "Delhi", "SalesAll": "27647", "Opened": "2010"},
    //   {"Location": "Lucknow", "SalesAll": "21471", "Opened": "2011"},
    // ];
    private svg:any;
    private tooltip:any;
    // private margin = 50;
    // private width = 750 - (this.margin * 2);
    // private height = 400 - (this.margin * 2);
    private margin = { top: 50, right: 50, bottom: 70, left: 70 };
    private width = 750 - (this.margin.left + this.margin.right);
    private height = 400 - (this.margin.top + this.margin.bottom);

  private createSvg(): void {
    this.svg = d3.select("figure#scatter")
    .append("svg")
//     .attr("width", this.width + (this.margin * 2))
//     .attr("height", this.height + (this.margin * 2))
//     .append("g")
//     .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
.attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

       // Create a tooltip div
  this.tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
}
 

private drawPlot(data_excel: any[]): void {
    // Add X axis
    const x = d3.scaleLinear()
    .domain([2009, 2017])
    .range([ 0, this.width ]);
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")))
    .transition()
        .duration(1000)
        .ease(d3.easeSinInOut)
        .attr("opacity", 1);

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, 200000])
    .range([ this.height, 0]);
    this.svg.append("g")
    .call(d3.axisLeft(y))
    .transition()
        .duration(1000)
        .ease(d3.easeSinInOut)
        .attr("opacity", 1);
    

    // Add dots
    const dots = this.svg.append('g');
    dots.selectAll("dot")
    .data(data_excel)
    .enter()
    .append("circle")
    .attr("cx", (d: any) => x(d.Opened))
    .attr("cy",  (d: any) => y(d.SalesAll))
    .attr("r", 8)
    .style("opacity", .5)
    .style("fill", "turquoise")
    .on("mouseover", (event: any, d: any) => {
      // Show tooltip on mouseover
      const tooltip = this.tooltip;
      tooltip.transition()
        .duration(200)
        .style("opacity", .9)
        .style("position","absolute")
        .style("background-color","white")
        .style("padding","10px")
         .style("border"," 1px solid black ")
      tooltip.html(`Year: ${d.Opened}<br/>Sales: ${d.SalesAll}`)
        .style("left", (event.pageX + 10) + "px")  // Adjust the positioning
        .style("top",  (event.pageY - tooltip.node().offsetHeight - 20) + "px");  // Adjust the positioning
    })
    .on("mousemove", (event: any) => {
      // Update tooltip position on mousemove
      this.tooltip.style("left", (event.pageX + 15) + "px")  // Adjust the positioning
        .style("top", (event.pageY - this.tooltip.node().offsetHeight - 20) + "px");  // Adjust the positioning
    })
    .on("mouseout", (d: any) => {
      // Hide tooltip on mouseout
      this.tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .transition()  // Add transition
    .duration(10000)  // Transition duration in milliseconds
    .attr("r", 8);

    // Add labels
    dots.selectAll("text")
    .data(data_excel)
    .enter()
    .append("text")
    .text( (d: any) => d.Location)
    .attr("x", (d: any) => x(d.Opened))
    .attr("y", (d: any)  => y(d.SalesAll))
    .transition()  // Add transition
    .duration(10000)  // Transition duration in milliseconds
    .style("opacity", 1);

    this.svg.append("text")
      .attr("transform", "translate(" + (this.width / 2) + " ," + (this.height + this.margin.top + 10) + ")")
      .style("text-anchor", "middle")
      .text("Year of Restaurant establishment");

    // Add Y-axis label
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Total Sales in 1st year");



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

      // Convert the sheet data to JSON
      this.data_excel = XLSX.utils.sheet_to_json(sheet);
      console.log('Loaded Data:', this.data_excel);

      // Redraw the bars with the new data
      this.drawPlot(this.data_excel);
    };
   

    reader.readAsBinaryString(file);
  }
}


}

