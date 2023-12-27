import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { BaseType } from 'd3';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {
  private data_excel!: any[];

ngOnInit(): void {
    this.createSvg();
    if (this.data_excel) {
      this.createColors(this.data_excel);
      this.drawChart(this.data_excel);
    }
}

  // private data = [
  //   {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
  //   {"Framework": "React", "Stars": "150793", "Released": "2013"},
  //   {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
  //   {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
  //   {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
  // ];
  private svg: any;
  private margin = 50;
  private width = 750;
  private height = 600;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors:any;
  

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height)
    .append("g")
    .attr(
      "transform",
      "translate(" + this.width / 2 + "," + this.height / 2 + ")"
    )
    this.createZoom();
}
//Adding private behavior to the chart
private createZoom() {
  const zoom = d3.zoom()
    .scaleExtent([1, 10]) // Adjust the scale extent as needed
    .on("zoom", (event) => this.handleZoom(event));

  this.svg.call(zoom);
}

private handleZoom(event: any) {
  this.svg.attr("transform", event.transform);
}
// Setting the colors
private createColors(data_excel: any[]): void {
  this.colors = d3.scaleLinear().domain([0, this.data_excel.length]).range(<any[]>['red', 'blue']);

}

private drawChart(data_excel: any[]): void {
  // Compute the position of each group on the pie:
  const pie = d3.pie<any>().value((d: any) => Number(d.Sales));


  // Building archs
  const arcGenerator: d3.Arc<any, any> = d3.arc()
  .innerRadius(0)
  .outerRadius(this.radius);

 
  // Build the pie chart
  this.svg
  .selectAll('pieces')
  .data(pie(data_excel))
  .enter()
  .append('path')
  .attr('d', arcGenerator)
  .attr('fill', (d: any, i: any) => (this.colors(i)))
  .attr("stroke", "#fff")
  .style("stroke-width", "1px")
  .on("mouseover", function (this: BaseType, event: MouseEvent, d: any) { // Bind 'this' to BaseType
    d3.select(this)
      .transition()
      .duration(500)
      .attr("transform", "scale(1.1)"); // Adjust the scale factor as needed
  })
  .on("mouseout", function (this: BaseType, event: MouseEvent, d: any) { // Bind 'this' to BaseType
    d3.select(this)
      .transition()
      .duration(500)
      .attr("transform", "scale(1)");
  })
  .transition() // Add transition
    .duration(1000) // Transition duration in milliseconds
    .attrTween("d", function(d: any) {
      const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return function(t: any) {
        return arcGenerator(interpolate(t));
      };
    });


  // Adding pieces to the pie
  this.svg
  .selectAll('pieces')
  .data(pie(data_excel))
  .enter()
  .append('text')
//.text((d: any)=> d.data.Food)
   .text((d: any) => `${d.data.Food} (${(d.data.Sales / d3.sum(data_excel, d => Number(d.Sales)) * 100).toFixed(2)}%)`)
  .attr("transform", (d: any) => "translate(" + arcGenerator.centroid(d) + ")")
  .style("text-anchor", "middle")
  .style("font-size", 12)
  .style("font-weight", "bold")
  .attr('fill',"#fff" )
  .style("opacity", 0) // Set initial opacity to 0
    .transition() // Add transition
    .duration(1000) // Transition duration in milliseconds
    .style("opacity", 1); // Final opacity
  


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
      this.createColors(this.data_excel);
      this.drawChart(this.data_excel);
    };
   

    reader.readAsBinaryString(file);
  }
}



}
function on(arg0: string, arg1: (event: any, d: any) => void) {
  throw new Error('Function not implemented.');
}

