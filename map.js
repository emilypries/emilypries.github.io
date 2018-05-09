mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbHlwcmllcyIsImEiOiJjaXVrZ2hmd2YwMDBiMm90NDJwZ255Zm9zIn0.px_tl2_Rr6Sm30K0IQOSCw';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/emilypries/ciuo9o5n6003h2io4fdem2xnp',
    center: [-99.420679, 37.772537],
    zoom: 4
});

var stop_vals = [
				[{ "zoom": 15, "value": 0 }, 3],
	            [{ "zoom": 17, "value": 0 }, 8],
	            [{ "zoom": 22, "value": 0 }, 10],
	            [{ "zoom": 15, "value": 10 }, 5],
	            [{ "zoom": 17, "value": 10 }, 11],
	            [{ "zoom": 22, "value": 10 }, 15],
	            [{ "zoom": 15, "value": 100 }, 10],
	            [{ "zoom": 17, "value": 100 }, 12],
	            [{ "zoom": 22, "value": 100 }, 28],
	            [{ "zoom": 15, "value": 1000 }, 22],
	            [{ "zoom": 17, "value": 1000 }, 27],
	            [{ "zoom": 22, "value": 1000 }, 47]]

function popup_html(properties){
	var inner = '';
	// General Info
	inner += 'Company: ' + properties.NAME + '<br>';
	inner += 'Date: ' + properties.LOCAL_DATETIME.split(" ")[0] + '<br>';
	var barrels = properties.BBLS_RELEASED.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Format barrels to remove .0 and add comma http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
	if (barrels.substring(barrels.length - 2, barrels.length) === ".0"){
		barrels = barrels.substring(0, barrels.length-2);
	}
	inner += 'Barrels Released: ' + barrels + '<br>';

	// Safety
	if (properties.INJURE != '0'){
		inner += 'Injuries: ' + properties.INJURE + '<br>';
	}
	if (properties.FATAL != '0'){
		inner += 'Fatalities: ' + properties.FATAL + '<br>';
	}

	// HCA
	if (properties.COMMODITY_REACHED_HCA === 'YES'){
		inner += 'HCA Reached:';
		if (properties.COMMERICALLY_NAV_IND === 'YES'){
			inner += ' commercially navigable water,';
		}
		if (properties.HIGH_POP_IND === 'YES'){
			inner += ' highly populated area,';
		}
		if (properties.OTHER_POP_IND === 'YES'){
			inner += ' other populated area,';
		}
		if (properties.USA_DRINKING_IND === 'YES'){
			inner += ' sensitive area - drinking water,';
		}
		if (properties.USA_ECOLOGICAL_IND === 'YES'){
			inner += ' ecologically sensitive land,';
		}
		inner = inner.substring(0, inner.length - 1) + '<br>';
	}

	// Cost (from http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript)
	inner += 'Total Cost: $' + parseFloat(properties.PRPTY).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + '<br>';
	return inner;
}

function draw_by_spec(map, spec, yes_color){
	map.addLayer({
		'id': 'oil_10_present',
		'type': 'circle',
		'source': 'liquids_10_present',
		'source-layer': 'hazards_jan10_present',
		'paint' : {
			'circle-radius':
			{
				property: 'BBLS_RELEASED',
				type: 'interval',
				stops: stop_vals
			},
			'circle-color': {
				property: spec,
				type: 'categorical',
				stops: [
					['YES', yes_color],
					['NO', '#646464'],
					['0', '#646464']
				]
			},
			'circle-opacity': .4
		}
	});
}

var type_colors = {
	property: 'COMMODITY_RELEASED_TYPE',
	type: 'categorical',
	stops: [
		['CRUDE OIL', '#ce3535'], // red
		['HVL OR OTHER FLAMMABLE OR TOXIC FLUID WHICH IS A GAS AT AMBIENT CONDITIONS', '#ffb942'], // orange
		['REFINED AND/OR PETROLEUM PRODUCT (NON-HVL) WHICH IS A LIQUID AT AMBIENT CONDITIONS', '#fff842'], // yellow
		['BIOFUEL / ALTERNATIVE FUEL(INCLUDING ETHANOL BLENDS)', '#f442a4'], // pink
		['CO2 (CARBON DIOXIDE)', '#ff0000']
	]
}

var fatal_colors = {
	property: 'FATAL',
	type: 'interval',
	stops: [
		[0, '#646464'], //grey
		[1, '#ff0000'] // red
	]
}

var injure_colors = {
	property: 'INJURE',
	type: 'interval',
	stops: [
		[0, '#646464'], // grey
		[1, '#ffb942'] // orange
	]
}

var cost_colors = {
	property: 'PRPTY',
	type: 'interval',
	stops: [
		[0, '#8700ff'], // purple
		[1000, '#5400ff'],
		[10000, '#2a00ff'],
		[100000, '#0033ff'],
		[1000000, '#007fff'],
		[10000000, '#00cbff'],
		[100000000, '#00ff00'] // green
	]
}

function draw_color_set(map, color_set){
	map.addLayer({
		'id': 'oil_10_present',
		'type': 'circle',
		'source': 'liquids_10_present',
		'source-layer': 'hazards_jan10_present',
		//'filter': ["==", "COMMODITY_REACHED_HCA", "YES"],
		'paint' : {
			'circle-radius':
			{
				property: 'BBLS_RELEASED',
				type: 'interval',
				// type: 'interval',
				// stops: [
				// 	[0, 3],
				// 	[20, 5],
				// 	[50, 8],
				// 	[100, 10],
				// 	[1000, 20]
				// ]
				stops: stop_vals
			},
			'circle-color': color_set,
			'circle-opacity': .4
		}
	});
}

function draw_pipelines(){
	map.addLayer({
		'id': 'crudeoil_pipelines',
		'source': 'crudeoil_pipelines',
		'type': 'line',
		'source-layer': 'CrudeOil_Pipelines_US_201606',
		'paint' : {
			'line-color': '#7c3729',
			'line-width': 1
		}
	});
	map.addLayer({
		'id': 'petroleum_pipelines',
		'source': 'petroleum_pipelines',
		'type': 'line',
		'source-layer': 'PetroleumProduct_Pipelines_US_20',
		'paint' : {
			'line-color': '#ad9f01',
			'line-width': 1
		}
	});
}

var popup;

map.on('load', function() {
	map.addSource('oil_10_present', {
		type: 'vector',
		url: 'mapbox://emilypries.ciuokf61h013m2tpkjzip0d9t-2ziuy'
	});
	map.addSource('liquids_10_present', {
		type: 'vector',
		url: 'mapbox://emilypries.ciuov1z3s01p62upewjg1ay19-8e2ob'
	});
	map.addSource('crudeoil_pipelines', {
		type: 'vector',
		url: 'mapbox://emilypries.ciutb25q400wl2nlg965p3vmp-1tou2'
	});
	map.addSource('petroleum_pipelines', {
		type: 'vector',
		url: 'mapbox://emilypries.ciutbh61o013x2zl1pw7y8m1f-37rnr'
	});
	draw_types();
	draw_pipelines();
	map.addControl(new mapboxgl.NavigationControl());
	map.on('mousemove', function (e) {
	    var features = map.queryRenderedFeatures(e.point, { layers: ['oil_10_present'] });
	    try { popup.remove(); } catch(e) { }
	    if (!features.length) {
	        return;
	    }
	    var feature = features[0];

	    popup = new mapboxgl.Popup({'closeButton': false})
	        .setLngLat(map.unproject(e.point))
	        .setHTML(popup_html(feature.properties))
	        .addTo(map);
	});
});

var legend_handler;

function show_options(option_choice){
	document.getElementById('legend').innerHTML = option_choice
}

function select_option(option_id){
	var options_list = document.getElementsByClassName('sections');
	for (var i = 0; i < options_list.length; i++){
		if (options_list[i].id != option_id){
			options_list[i].className = "sections";
		} else {
			options_list[i].className = "sections selected";
		}
	}
}

function draw_types(){
	try { map.removeLayer('oil_10_present'); } catch(e) { }
	draw_color_set(map, type_colors);
	try { document.getElementById('legend').removeEventListener("click", legend_handler); } catch(e) { }
	show_options(TYPES_LEGEND);
	select_option("types");
}

function safety_handler(e){
	if (e.target !== e.currentTarget) {
        var property = e.target.value;
        map.removeLayer('oil_10_present');
        if (property === 'INJURE'){
        	draw_color_set(map, injure_colors);
        } else {
        	draw_color_set(map, fatal_colors);
        }
	}
	e.stopPropagation();
}

function draw_safety(){
	try { map.removeLayer('oil_10_present'); } catch(e) { }
	draw_color_set(map, injure_colors);
	show_options(SAFETY_OPTIONS);
	try { document.getElementById('legend').removeEventListener("click", legend_handler); } catch(e) { }
	legend_handler = safety_handler;
	document.getElementById('legend').addEventListener("click", legend_handler);
	select_option("safety");
}

function ecology_handler(e){
	if (e.target !== e.currentTarget) {
        var property = e.target.value;
        map.removeLayer('oil_10_present');
        draw_by_spec(map, property, '#4294f7');
	}
	e.stopPropagation();
}

function draw_ecology(){
	try { map.removeLayer('oil_10_present'); } catch(e) { }
	draw_by_spec(map, "WSW_IND", '#4294f7');
	show_options(ECOLOGY_OPTIONS);
	try { document.getElementById('legend').removeEventListener("click", legend_handler); } catch(e) { }
	legend_handler = ecology_handler;
	document.getElementById('legend').addEventListener("click", legend_handler);
	select_option("ecology");
}

function hca_handler(e) {
	if (e.target !== e.currentTarget) {
        var property = e.target.value;
        map.removeLayer('oil_10_present');
        draw_by_spec(map, property, '#42f4df');
	}
	e.stopPropagation();
}

function draw_hcas(){
	try { map.removeLayer('oil_10_present'); } catch(e) { }
	draw_by_spec(map, "COMMODITY_REACHED_HCA", '#42f4df');
	show_options(HCA_OPTIONS);
	try { document.getElementById('legend').removeEventListener("click", legend_handler); } catch(e) { }
	legend_handler = hca_handler;
	document.getElementById('legend').addEventListener("click", legend_handler);
	select_option("hcas");
}

function draw_cost(){
	try { map.removeLayer('oil_10_present'); } catch(e) { }
	draw_color_set(map, cost_colors);
	try { document.getElementById('legend').removeEventListener("click", legend_handler); } catch(e) { }
	show_options(COST_LEGEND);
	select_option("cost");
}

var section_names = ["types", "safety", "ecology", "hcas", "cost"];
var section_functions = [draw_types, draw_safety, draw_ecology, draw_hcas, draw_cost];

for (var i = 0; i < section_names.length; i++){
	document.getElementById(section_names[i]).addEventListener("click", section_functions[i]);
}

function fly_me(target){
	var target_loc = target.splice(0,2);
	var target_zoom = target;
	map.flyTo({
		center: target_loc,
		zoom: target_zoom,
		bearing: 0,
		speed: 3,
		curve: 1,
		easing: function (t) { // lol what is this
            return t;
        }
	});
}
function fly_back(){
	map.flyTo({
		center: [-99.420679, 37.772537],
    	zoom: 4,
    	bearing: 0,
		speed: 3,
		curve: 1,
		easing: function (t) { // lol what is this
            return t;
        }
	});
}

var tour_stop = 0;

function takeTour(){
	draw_types();
	tour_stop = 0;
	document.getElementById('tour_nav').style.visibility = 'visible';
	document.getElementById('tour_info').style.visibility = 'visible';
	document.getElementById('section').style.visibility = 'hidden';
	style_legends_for_tour();
	loadTour();
}

function loadTour(){
	if (tour_stop < 0){
		explore();
		document.getElementById('tour_info').style.visibility = 'hidden';
		return;
	}
	if (tour_stop >= tourContent.length){
		explore();
		document.getElementById('tour_info').style.visibility = 'hidden';
		return;
	}
	target = tourLocation[tour_stop];
	if (target != 0){
		fly_me(tourLocation[tour_stop]);
	} else {
		fly_back();
	}
	var tc = document.getElementById('tour_content');
	tc.innerHTML = tourContent[tour_stop];
	tc.scrollTop = 0;
	tour_stop++;

	progressTour(); // update after for zero indexing
}

function progressTour(){
	var progress_text = tour_stop.toString() + " / " + (tourContent.length).toString();
	document.getElementById('tour_progress').innerHTML = progress_text;
}

function explore(){
	fly_back();
	document.getElementById('tour_info').style.visibility = 'hidden';
	document.getElementById('section').style.visibility = 'visible';
	style_legends_for_explore();
}

function style_legends_for_explore(){
	document.getElementById('pipeline_options').style.left = 10;
	document.getElementById('pipeline_options').style.width = '296px';
	document.getElementById('legend').style.left = 10;
	document.getElementById('legend').style.top = 271;
	document.getElementById('legend').style.width = '296px';
	document.getElementById('tour_nav').style.visibility = 'hidden';

}

function style_legends_for_tour(){
	document.getElementById('pipeline_options').style.right = 0;
	document.getElementById('pipeline_options').style.left = "";
	document.getElementById('pipeline_options').style.width = '276px';
	document.getElementById('legend').style.left = "";
	document.getElementById('legend').style.right = 0;
	document.getElementById('legend').style.top = 10;
	document.getElementById('legend').style.width = '380px';
}

var tour_buttons = document.getElementsByClassName("tour");
for (var i=0; i<tour_buttons.length; i++){
	tour_buttons[i].addEventListener('click', takeTour);
}
document.getElementById("explore").addEventListener('click', explore);
document.getElementById('tour_next').addEventListener('click', loadTour);
document.getElementById('tour_back').addEventListener('click', function(){
	if (tour_stop == 1){
		tour_stop = 0;
	}
	tour_stop-=2;
	loadTour();
});
document.getElementById('end_tour').addEventListener('click', explore);
