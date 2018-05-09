var dragger = document.getElementById('legend');
dragger.addEventListener('dragstart', dragStartHandler);
document.body.addEventListener('dragover', dragOverHandler);
document.body.addEventListener('drop', dropHandler);

function dragStartHandler(event){
	var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.effectAllowed = 'move'; // only allow moves
    event.dataTransfer.setData("text/plain", (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY) + ',' + (parseInt(style.getPropertyValue("width"),10)));
}

function dragOverHandler(event){
	event.preventDefault();
}

function dropHandler(event){
	var offset = event.dataTransfer.getData("text/plain").split(',');
    dragger.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    dragger.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    dragger.style.width = (parseInt(offset[2],10) + 1) + 'px';
    event.preventDefault();
}


var HCA_OPTIONS = "Highlight the following:<br> \
	<input type='radio' name='hca_type' value='COMMODITY_REACHED_HCA' \
checked>All HCAs</input><br> \
	<input type='radio' name='hca_type' value='HIGH_POP_IND'>High \
Population</input><br> \
	<input type='radio' name='hca_type' value='OTHER_POP_IND'>Other \
Population</input><br> \
	<input type='radio' name='hca_type' value='USA_DRINKING_IND'>Drinking \
Water Area</input><br> \
	<input type='radio' name='hca_type' value='COMMERICALLY_NAV_IND'>\
Commercially Navigable Waterway</input><br> \
	<input type='radio' name='hca_type' value='USA_ECOLOGICAL_IND'>\
Ecologically Sensitive</input>"

var ECOLOGY_OPTIONS = 'Highlight the following:<br> \
	<input type="radio" name="ecology_type" value="WSW_IND" checked>All</ \
input><br> \
	<input type="radio" name="ecology_type" value="WILDLIFE_IMPACT_IND">\
Wildlife Impact</input><br> \
	<input type="radio" name="ecology_type" value="SOIL_CONTAMINATION">\
Soil Contamination</input><br> \
	<input type="radio" name="ecology_type" value="WATER_CONTAM_IND">Water \
Contamination</input><br>'

var SAFETY_OPTIONS ='Highlight the following:<br> \
	<input type="radio" name="safety_type" value="INJURE" checked>Injury</ \
input><br> \
	<input type="radio" name="safety_type" value="FATAL">Fatality</input><br>'

var TYPES_LEGEND ='<ul id="legend_items"> \
		<li class="legend_item"><div class="swatch" style="background-color: \
 #ce3535"></div>Crude Oil</li> \
 		<li class="legend_item"><div class="swatch" style="background-color: \
 #fff842;"></div>Refined and/or Petroleum Product (Non-HVL)</li> \
		<li class="legend_item"><div class="swatch" style="background-color: \
 #ffb942;"></div>HVL and Other Flammable/Toxic Fluid as Gas</li> \
		<li class="legend_item"><div class="swatch" style="background-color: \
 #f442a4;"></div>CO2/Biofuel/Alternative Fuel</li> </ul>'

var COST_LEGEND = '<ul> \
		<li class="legend_item"><div class="swatch" style="background-color: \
 #8700ff;"></div>$0 &lt; $ &lt; $999 </li> \
		<li class="legend_item"><div class="swatch" style="background-color: \
 #5400ff;"></div>$1,000 &lt; $ &lt; $9,999 </li> \
		<li class="legend_item"><div class="swatch" style="background-color: \
 #2a00ff;"></div>$10,000 &lt; $ &lt; $99,999 </li> \
		<li class="legend_item"><div class="swatch" style="background-color: \
 #0033ff;"></div>$100,000 &lt; $ &lt; $999,999 </li> \
		<li class="legend_item"><div class="swatch" style="background-color: \
 #007fff;"></div>$1,000,000 &lt; $ &lt; $9,999,999 </li> \
		<li class="legend_item"><div class="swatch" style="background-color: \
 #00cbff;"></div>$10,000,000 &lt; $ &lt; $99,999,999 </li> \
		<li class="legend_item"><div class="swatch" style="background-color: \
 #00ff00;"></div>$100,000,000 &lt; $ </li> \
	</ul>'

document.getElementById('about').addEventListener('click', function(){
	var about_div = document.getElementById('about_div');
	about_div.style.visibility = about_div.style.visibility == "visible" ? "hidden" : "visible";
});

document.getElementById('close_about').addEventListener('click', function(){
	document.getElementById('about_div').style.visibility = 'hidden';
});

var tourNav = "<button id='tour_back'>Back</button> \
				<button id='tour_next'>Next</button>\
				<button id='end_tour'>End</button>\
				<div id='tour_progress'></div>"
