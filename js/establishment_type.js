// Source : https://github.com/alioben/yummly
// Source : https://www.d3-graph-gallery.com/graph/barplot_stacked_hover.html
<script>
	/*
	function toUpper(string) {
	    return string.charAt(0).toUpperCase() + string.slice(1);
	}

	
	function plot_cluster(chart_id, data){
		_.each(data, function(dic){ 
			dic['mode']='markers';
			dic['type']='scatter';
			dic['marker']={size:6};
			dic['name']=toUpper(dic['name']);
		})

		var layout = {
		  title:'Cuisine clustering by ingredients',
		  hovermode: !1
		};

		Plotly.newPlot(chart_id, data, layout);
	}

	function plot_failure(chart_id, data, meat){
		data = data[meat]
		
		data['type'] = 'bar';
		//data['orientation'] = 'h';
		data['orientation'] = 'v';
		data['marker'] = {
			color: '#e16120'
		}
		var layout = {
		  xaxis:{
		  	title: 'Facilty Type'
		  },
		  
		  //title:toUpper(meat)+'-Meter',
		  title:'Inspection Results per Facility Type',
		  annotations: [
		    {
		      x: 0.5,
		      y:0,
		      showarrow: false,
      		  text: '     ',
		    }
		  ]
		};
		Plotly.newPlot(chart_id, [data], layout);
	}

	/*
	function show_recipe_selector(data){
		var html = '<select id="recipe-select">'
		_.each(Object.keys(data), function(key){
			html += '<option value="'+key+'">'+toUpper(key)+'</option>';
		})
		html += '</select>';
		d3.select('.recipe-selector').html(html);
		document.getElementById('recipe-select').onchange = function() {
		  var index = this.selectedIndex;
		  var inputText = this.children[index].innerHTML.trim();
		  show_recipe(data, inputText);
		}
		show_recipe(data, Object.keys(data)[0]);
	}
	function show_recipe(data, title){
		recipe = data[title];
		html = '<img src="'+recipe['img']+'">';
		html += '<div class="title-recipe">'+title+'</div>';
		d3.select(".current-recipe").html(html);
		
		i=0;
		html = '<table><tr>';
		_.each(data[title]['similars'], function(r){
			html += '<td>';
			html += '<img src="'+r['image']+'">';
			html += '<div class="title-recipe">'+r['title']+' <span class="similarity">('+Math.round(r['similarity']*100,0)+'%)</span></div>';
			html += '</td>'
			i += 1;
			if(i%3 == 0)
				html += '</tr><tr>';
		});
		html += '</tr></table>';
		d3.select(".similar-recipes").html(html);
	}
	
	function plot_meat_selector(chart_id, data){
		var html = '<select id="meat-select">'
		_.each(Object.keys(data), function(key){
			html += '<option value="'+key+'">'+toUpper(key)+'</option>';
		})
		html += '</select>';
		d3.select('.'+chart_id).html(html);
		document.getElementById('meat-select').onchange = function() {
		  var index = this.selectedIndex;
		  var inputText = this.children[index].innerHTML.trim();
		  plot_meatometer('meat-o-meter', data, inputText)
		}
	}
	*/

	/*
	function append_legend_network(){
		countries = ['french', 'italian', 'japanese', 'chinese', 'english', 'mexican', 'indian', 'irish'];
		colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'];
		html = '<table>';
		i = 0;
		_.each(countries, function(c){
			html += '<tr><td style="background-color:'+colors[i]+';">&nbsp;</td>';
			html += '<td>'+toUpper(c)+'</td></tr>';
			i++;
		});
		html += '</table>'

		d3.select('#network-graph').append('div')
								   .html(html)
								   .style('font-size', '9pt')
								   .style('position', 'absolute')
								   .style('bottom', '0px');
	}*/


	//window.onload = function(){


		/*d3.json("{{site.baseurl}}/assets/recipes_tsne.json", function(error, data) {
		    plot_cluster('chart', data)
		});*/


		/*d3.json("{{site.baseurl}}/assets/meat-o-meter.json", function(error, data){
			_.each(data, function(v,k){
				v['x'] = v['x'].reverse()
				v['y'] = v['y'].reverse()
			})
			plot_meatometer('meat-o-meter', data, 'Salmon');
			plot_meat_selector('meat-selector', data);
		});*/

		// append the svg object to the body of the page
		var svg = d3.select("facility_type_div")
		  .append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform",
		          "translate(" + margin.left + "," + margin.top + ")");

		d3.csv("datasets/result_facility_type.csv", function(data){
		// List of subgroups = header of the csv files = inspection outcome here
		var subgroups = data.columns.slice(1)

		// List of groups = facility types here = value of the first column called Facility Type -> on the X axis
		var groups = d3.map(data, function(d){return(d.group)}).keys()
		 
		 // Add X axis
		  var x = d3.scaleBand()
		      .domain(groups)
		      .range([0, width])
		      .padding([0.2])
		  svg.append("g")
		    .attr("transform", "translate(0," + height + ")")
		    .call(d3.axisBottom(x).tickSizeOuter(0));

		  // Add Y axis
		  var y = d3.scaleLinear()
		    .domain([0, 60])
		    .range([ height, 0 ]);
		  svg.append("g")
		    .call(d3.axisLeft(y));

		  // color palette = one color per subgroup
		  var color = d3.scaleOrdinal()
		    .domain(subgroups)
		    .range(['red','orange','green'])

		  //stack the data? --> stack per subgroup
		  var stackedData = d3.stack()
		    .keys(subgroups)
		    (data)

		  // ----------------
		  // Create a tooltip
		  // ----------------
		  var tooltip = d3.select("#my_dataviz")
		    .append("div")
		    .style("opacity", 0)
		    .attr("class", "tooltip")
		    .style("background-color", "white")
		    .style("border", "solid")
		    .style("border-width", "1px")
		    .style("border-radius", "5px")
		    .style("padding", "10px")

		  // Three function that change the tooltip when user hover / move / leave a cell
		  var mouseover = function(d) {
		    var subgroupName = d3.select(this.parentNode).datum().key;
		    var subgroupValue = d.data[subgroupName];
		    tooltip
		        .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
		        .style("opacity", 1)
		  }
		  var mousemove = function(d) {
		    tooltip
		      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
		      .style("top", (d3.mouse(this)[1]) + "px")
		  }
		  var mouseleave = function(d) {
		    tooltip
		      .style("opacity", 0)
		  }




		  // Show the bars
		  svg.append("g")
		    .selectAll("g")
		    // Enter in the stack data = loop key per key = group per group
		    .data(stackedData)
		    .enter().append("g")
		      .attr("fill", function(d) { return color(d.key); })
		      .selectAll("rect")
		      // enter a second time = loop subgroup per subgroup to add all rectangles
		      .data(function(d) { return d; })
		      .enter().append("rect")
		        .attr("x", function(d) { return x(d.data.group); })
		        .attr("y", function(d) { return y(d[1]); })
		        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
		        .attr("width",x.bandwidth())
		        .attr("stroke", "grey")
		      .on("mouseover", mouseover)
		      .on("mousemove", mousemove)
		      .on("mouseleave", mouseleave)

		})

		/*
		d3.json("{{site.baseurl}}/assets/similar-recipes.json", function(error, data){
			show_recipe_selector(data);
			// show_recipe('meat-selector', data);
		});


		sigma.parsers.json( "{{site.baseurl}}/assets/network_ing.json",

		  {container: 'network-graph'});
		append_legend_network();
		*/
	//}
</script>