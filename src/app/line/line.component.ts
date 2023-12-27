import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import * as d3 from 'd3';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit {

  private data = [
    {"group": "Insulin", "Low": "6", "Normal": "2.75", "High": "5.25"},
    {"group": "Vit B12", "Low": "1", "Normal": "3", "High": "1"},
    {"group": "Vit D3", "Low": "1", "Normal": "3", "High": "1"},
    {"group": "Zinc", "Low": "1", "Normal": "3", "High": "1"}
  ];

  private svg: any;

  margin = 50;
  width = 750 - (this.margin * 2);
  height = 400 - (this.margin * 2);

  ngOnInit(): void {
    this.createSvg();
    this.drawBars(this.data);
  }

  createSvg(): void {
    this.svg = d3.select("figure#stacked-bar-tooltip")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }

  drawBars(data:any[]): void {
    
    // List of subgroups; i.e. the header of the csv data:
    // Prepare the array with the keys for stacking.
    const dataColumns = Object.keys(data[0]);
    const subgroups = dataColumns.slice(1)

    // List of groups; i.e. value of the first
    // column - group - shown on the X axis.
    const groups = data.map(d => d.group);

    // Create the X-axis band scale.
    const x = d3.scaleBand()
    .domain(groups)
    .range([0, this.width])
    .padding(0.2);

    // Draw the X-axis on the DOM.
    this.svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));
    
    // Create the Y-axis band scale.
    const y = d3.scaleLinear()
    .domain([0, 14])
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM.
    this.svg.append("g")
    .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#ffffcc','#4daf4a', '#e41a1c']);

    // Stack the data per subgroup.
    const stackedData = d3.stack()
    .keys(subgroups)
    (data);

    // Create a tooltip.
    const tooltip = d3.select("#stacked-bar-tooltip")
    .append("figure")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

    // Mouse function that change the tooltip when the user hovers/moves/leaves a cell.
    const mouseover = function(this: any, event:any, d:any) {
      /********** Hack! Otherwise, the following line would not work:
      const subgroupName = d3.select(this.parentNode).datum().key; */
      const subgroupNameObj: any = d3.select(this.parentNode).datum();
      const subgroupName = subgroupNameObj.key;
      /************ End of Hack! ************/
      const subgroupValue = d.data[subgroupName];
      tooltip.html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
            .style("opacity", 1)        
    }
    const mousemove = function(event:any, d:any) {
      tooltip.style("transform", "translateY(-55%)")  
            // .style("left", (event.x-50)+"px")
            // .style("top", (event.y-50)/2-30+"px")
    .style("left", (d3.pointer(event)[0] +90) + "px")
    .style("top", (d3.pointer(event)[1] )+ "px")


    
                
  }
    const mouseleave = function(event:any, d:any) {
      tooltip.style("opacity", 0)
    }

    // Create and fill the stacked bars.
    this.svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .join("g")
    .attr("fill", (d:any) => color(d.key))
    .selectAll("rect")    
    .data((d:any) => d)
    .join("rect")
    .attr("x", (d:any) => x(d.data.group))
    .attr("y", (d:any) => y(d[1]))
    .attr("height", (d:any) => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth())
    .attr("stroke", "grey")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
  }
}


