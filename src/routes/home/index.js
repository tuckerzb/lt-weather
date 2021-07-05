import { h } from 'preact';
import style from './style.css';
import axios from 'axios';
import {Link} from 'preact-router/match';
import {useState, useEffect} from 'preact/hooks';

const Loader = () => (
	<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
     width="60px" height="60px" style="display: block;" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;">
  <path fill="#000" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
    <animateTransform attributeType="xml"
      attributeName="transform"
      type="rotate"
      from="0 25 25"
      to="360 25 25"
      dur="0.6s"
      repeatCount="indefinite"/>
    </path>
  </svg>
);

const Home = () => {
	const [lat, setLat] = useState(0.0);
	const [long, setLong] = useState(0.0);
	const [forecastData, setForecastData] = useState([]);
	const [selectValue, setSelectValue] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const getLocationHandler = () => {
		setSelectValue('');
		setForecastData([]);
		setLoading(true);
		setError('');
		navigator.geolocation.getCurrentPosition(position => {
			setLat(position.coords.latitude);
			setLong(position.coords.longitude);
			console.log(`${position.coords.latitude}`);
			console.log(`${position.coords.longitude}`);
			axios({
				method: 'GET',
				url: `https://cdt-weather-backend.herokuapp.com/api/getForecastFromLocation?lat=${position.coords.latitude}&long=${position.coords.longitude}`,
			}).then(response => {
				if (response.data.message) {
					// Workaround May 2021: Re-submit for one more try if error returned
					console.log(`Error Returned, trying a 2nd time`);
					axios({
						method: 'GET',
						url: `https://cdt-weather-backend.herokuapp.com/api/getForecastFromLocation?lat=${position.coords.latitude}&long=${position.coords.longitude}`,
					}).then(response2 => {
						if (response2.data.message) {
							setError(response2.data.message);
							setLoading(false);
						} else {
							setLoading(false);
							setForecastData(response2.data);
						}
					}, error => console.log(error));
				} else {
					setLoading(false);
					setForecastData(response.data);	
				}
			}, error => console.log(error));
		}, error => {
			setError('We could not determine your location via GPS. Please use the landmark dropdown to select the nearest location to you.');
			setLoading(false);
		});
	}

	const getForecastFromLandmark = (e) => {
		setLoading(true);
		setError('');
		setForecastData([]);
		setSelectValue(e.target.value);
		if (e.target.value.length == 2 || e.target.value.length == 0) {
			setError('You have selected one of the state category dividers, please select a landmark instead.');
			setLoading(false);
			return;
		}
		setLat(Number(e.target.value.split(',')[3]));
		setLong(Number(e.target.value.split(',')[4]));
		axios({
			method: 'GET',
			url: `https://cdt-weather-backend.herokuapp.com/api/getForecastFromLandmark?id=${e.target.value}`,
		}).then(response => {
			if (response.data.message) {
				console.log(`Error Returned, trying a 2nd time`);
				// Workaround May 2021: submit once more if error returned
				axios({
					method: 'GET',
					url: `https://cdt-weather-backend.herokuapp.com/api/getForecastFromLandmark?id=${e.target.value}`,
				}).then(response2 => {
					if (response2.data.message) {
						setError(response2.data.message);
						setLoading(false);
					} else {
						setLoading(false);
						setForecastData(response2.data);
					}
				}, error => console.log(error));
			} else {
				setLoading(false);
				setForecastData(response.data);	
			}
		}, error => console.log(error));
	}

	useEffect(() => {

	}, [forecastData]);
	
	return (<div class={style.container}>
		<div class={style.headerBlock}>
		<h1>Welcome to CDT Weather</h1>
		<p>The <a href='https://continentaldividetrail.org/'>Continental Divide Trail</a> is a ~3,100 mile path through the Rocky Mountains and along the Continental Divide. </p>
		<p>To get the 7-day National Weather Service forecast, click "Get My Location" or select the closest landmark to you from the dropdown. Sometimes we are unable to communicate with the NWS servers for a forecast region, if you receive an error message, please try again later.</p>
		<p><em>Have a location on the trail that you'd like to see added to the landmarks dropdown?</em> Please suggest it using this form: <Link href="/suggest">Suggest a Landmark</Link></p>
		<p><strong>Disclaimer:</strong> Please note that the information is provided "as-is" from the National Weather Service and no warranty is made as to its accuracy.</p>
		</div>
		<button class={style.locationButton} onClick={getLocationHandler}>Get My Location</button> <strong>OR</strong>{' '}
		<select value={selectValue} name='landmark' id='landmark' onChange={getForecastFromLandmark}>
			<option value="">-- Select a Landmark --</option>
			<option value="nm">-- New Mexico --</option>
			<option value="EPZ,33,49,31.4977299,-108.2145227">Crazy Cook Monument (Terminus)</option>
			<option value="EPZ,19,88,32.3480219,-108.7078031">Lordsburg, NM</option>
			<option value="EPZ,37,106,32.778061,-108.274170">Silver City, NM</option>
			<option value="ABQ,25,65,33.742050,-108.477402">N End of Gila Alt</option>
			<option value="ABQ,28,73,33.932659,-108.418900">Highway 12</option>
			<option value="ABQ,40,88,34.298328,-108.134720">Pie Town, NM</option>
			<option value="ABQ,54,125,35.155281,-107.842216">Grants, NM</option>
			<option value="ABQ,63,128,35.238819,-107.608459">Mt Taylor Summit</option>
			<option value="ABQ,90,160,36.014848,-106.963901">Cuba, NM</option>
			<option value="ABQ,99,168,36.203552,-106.719933">Highway 96</option>
			<option value="ABQ,103,173,36.329578,-106.624100">S End of Ghost Ranch Alt</option>
			<option value="ABQ,108,176,36.401878,-106.494713">Highway 84</option>
			<option value="ABQ,119,189,36.709910,-106.230072">Highway 64</option>
			<option value="PUB,25,12,36.993870,-106.457108">NM/CO BORDER</option>
			<option value="co">-- Colorado --</option>
			<option value='PUB,25,13,37.018021,-106.450204'>Cumbres Pass/S End of Great Divide Alt</option>
			<option value='PUB,19,31,37.404713,-106.6446'>Elwood Pass</option>
			<option value='PUB,17,33,37.444672,-106.708572'>Bonito Pass</option>
			{/* <option value='PUB,21,43,37.670368,-106.642975'>South Fork, CO</option> */}
			{/* <option value='PUB,31,43,37.678692,-106.351883'>Del Norte, CO</option> */}
			<option value='PUB,14,35,37.482979,-106.802231'>Wolf Creek Pass/Highway 160</option>
			<option value='PUB,11,39,37.564049,-106.906403'>S End of Creede Cutoff</option>
			<option value='PUB,11,52,37.849442,-106.926109'>Creede, CO</option>
			<option value='GJT,124,40,37.77145,-107.558327'>Silverton Access (MM 927.6 NOBO)</option>
			<option value='GJT,138,46,37.940151,-107.158997'>Spring Creek Pass/Highway 149</option>
			<option value='PUB,23,65,38.161350,-106.620598'>N End of Great Divide Alt</option>
			<option value='GJT,170,68,38.496201,-106.324982'>Monarch Pass/Highway 50</option>
			<option value='PUB,33,88,38.692551,-106.414619'>S End of Mirror Lake Alt</option>
			<option value='PUB,33,94,38.827892,-106.408859'>Cottonwood Pass/Highway 306</option>
			<option value='GJT,168,85,38.873100,-106.426666'>N End of Mirror Lake Alt</option>
			<option value='PUB,36,106,39.093449,-106.364349'>Twin Lakes, CO / Highway 82</option>
			<option value='GJT,174,107,39.363300,-106.311920'>Tennessee Pass / Highway 24</option>
			<option value='BOU,21,53,39.498650,-106.155998'>Copper Mtn / S End of Silverthorne Alt</option>
			<option value='BOU,32,55,39.574902,-105.837273'>S End of Argentine Spine Alt</option>
			<option value='BOU,33,58,39.633781,-105.817551'>Grays Peak Summit</option>
			<option value='BOU,35,65,39.798222,-105.776947'>Berthoud Pass / Highway 40</option>
			<option value='BOU,35,86,40.256279,-105.815880'>Grand Lake, CO / S End of RMNP Bypass</option>
			<option value='BOU,26,91,40.349628,-106.089729'>Willow Creek Pass / Highway 125</option>
			<option value='BOU,9,94,40.380070,-106.579330'>Muddy Pass / Highway 40+14</option>
			<option value='GJT,164,171,40.753529,-106.732483'>North Lake Trailhead</option>
			<option value='CYS,38,12,41.002628,-106.861267'>CO/WY BORDER</option>
			<option value="wy">-- Wyoming --</option>
			<option value='CYS,34,19,41.153728,-106.981300'>Battle Pass / Highway 70</option>
			<option value='CYS,21,39,41.550819,-107.431381'>Bridger Pass</option>
			<option value='CYS,28,49,41.786896,-107.240479'>Rawlings, WY</option>
			<option value='RIW,100,84,42.462212,-108.851097'>Highway 28</option>
			<option value='RIW,91,92,42.621719,-109.131660'>S End of Cirque of the Towers Alt</option>
			<option value='RIW,86,101,42.795158,-109.302277'>N End of Cirque of the Towers Alt</option>
			<option value='RIW,76,115,43.070950,-109.645844'>S End of Knapsack Col Alt</option>
			<option value='RIW,76,119,43.154579,-109.661011'>Knapsack Col</option>
			<option value='RIW,73,120,43.169121,-109.741837'>N End of Knapsack Col Alt</option>
			<option value='RIW,70,130,43.385201,-109.854523'>Gunsight Pass</option>
			<option value='RIW,66,142,43.621899,-110.035011'>Sheridan Pass / S End of Old CDT Alt</option>
			<option value='RIW,67,146,43.718319,-110.012199'>Highway 26 on Old CDT Alt</option>
			<option value='RIW,59,166,44.133129,-110.300362'>S End of Yellowstone NP</option>
			<option value='RIW,50,176,44.317005,-110.598892'>Highway 191 (S Crossing)</option>
			<option value='RIW,44,183,44.460178,-110.830093'>Old Faithful Village</option>
			<option value='RIW,36,182,44.408089,-111.051872'>WY/ID BORDER</option>
			<option value="id">-- Idaho --</option>
			<option value='PIH,151,113,44.437531,-111.105148'>S End of Mack's Inn Alt</option>
			<option value='TFX,82,11,44.674252,-111.273819'>Highway 20</option>
			<option value='TFX,73,7,44.561489,-111.541199'>N End of Mack's Inn Alt</option>
			<option value='PIH,114,122,44.520809,-112.256630'>Interstate 15</option>
			<option value='MSO,118,28,44.759739,-113.137642'>Summit of Elk Mountain</option>
			<option value='TFX,1,70,45.694073,-113.934616'>Gordon Reese Cabin (Final ID/MT Crossing)</option>
			<option value="mt">-- Montana --</option>
			<option value='MSO,122,88,46.048569,-113.280518'>S End of Anaconda Alt</option>
			<option value='MSO,127,82,45.927181,-113.099991'>Highway 569</option>
			<option value='MSO,140,76,45.852829,-112.675621'>Interstate 15 (S of Butte)</option>
			<option value='TFX,52,73,45.919300,-112.411942'>Interstate 90</option>
			<option value='MSO,146,93,46.208359,-112.575958'>N End of Anaconda Alt</option>
			<option value='MSO,156,108,46.561451,-112.308746'>Highway 12</option>
			<option value='TFX,55,119,46.891102,-112.495796'>Stemple Pass / High Divide Outfitters</option>
			<option value='TFX,60,127,47.073891,-112.371582'>Rogers Pass / Highway 200</option>
			<option value='TFX,46,150,47.506519,-112.891151'>S End of Bob Marshall Wilderness</option>
			<option value='TFX,41,162,47.741379,-113.119751'>S End of Spotted Bear Alt</option>
			<option value='MSO,141,179,48.000980,-113.052994'>N End of Spotted Bear Alt</option>
			<option value='TFX,37,191,48.318638,-113.353012'>Marias Pass / Highway 2</option>
			<option value='TFX,41,196,48.437866,-113.258621'>S End of Glacier NP</option>
			<option value='TFX,38,199,48.486401,-113.365898'>Two Medicine</option>
			<option value='TFX,34,203,48.574291,-113.513641'>Triple Divide Pass</option>
			<option value='TFX,30,209,48.677525,-113.652069'>Going to the Sun Road</option>
			<option value='TFX,31,215,48.800129,-113.656952'>Waterton / Chief Mtn Junction</option>
			<option value='TFX,30,218,48.863079,-113.688377'>(CM) Red Gap Pass</option>
			<option value='TFX,32,224,48.997504,-113.660635'>(CM) Canadian Border (Terminus)</option>
			<option value='TFX,24,218,48.852879,-113.860901'>(W) Fifty Mountain Campsite</option>
			<option value='TFX,24,225,48.998512,-113.906087'>(W) Canadian Border (Terminus)</option>



		</select>
		{error && <div class={style.messageBlock}>{error}</div>}
		{loading && (<><br /><Loader /></>)}
		<div class={style.forecastBlock}>
		{forecastData.length !== 0 && (<div class={style.forecastFor}><strong>Forecast For:</strong> {lat.toFixed(4)}{', '}{long.toFixed(4)} | <a target="_blank" rel="noopener" href={`https://www.google.com/maps/@${lat},${long},15z`}>View on Map</a></div>)}
		{forecastData && forecastData.map(item => (
			<div class={style.forecastItem}>
			{item.name}
			  	<p>{item.detailedForecast}</p>
			</div>
		))}
		</div>
	</div>);
};

export default Home;
