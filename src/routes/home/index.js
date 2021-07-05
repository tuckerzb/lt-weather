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
			setError('You have selected one of the category dividers, please select a landmark instead.');
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
		<h1>Welcome to Long Trail Weather</h1>
		<p>The <a href='https://www.greenmountainclub.org/the-long-trail/'>Long Trail</a> is a 272 mile path along the main ridge of Vermont's Green Mountains between the Massachusetts and Canadian borders. </p>
		<p>To get the 7-day National Weather Service forecast, click "Get My Location" or select the closest shelter to you from the dropdown. Sometimes we are unable to communicate with the NWS servers for a forecast region, if you receive an error message, please try again later.</p>
		{/* <p><em>Have a location on the trail that you'd like to see added to the landmarks dropdown?</em> Please suggest it using this form: <Link href="/suggest">Suggest a Landmark</Link></p> */}
		<p><strong>Disclaimer:</strong> Please note that the information is provided "as-is" from the National Weather Service and no warranty is made as to its accuracy.</p>
		</div>
		<button class={style.locationButton} onClick={getLocationHandler}>Get My Location</button> <strong>OR</strong>{' '}
		<select value={selectValue} name='landmark' id='landmark' onChange={getForecastFromLandmark}>
			<option value="">-- Select a Shelter --</option>
			<option value='ALY,78,67,42.772041,-73.136932'>Seth Warner Shelter</option>
			<option value='ALY,78,70,42.848034,-73.110031'>Congdon Shelter</option>
			<option value='ALY,78,72,42.887779,-73.095505'>Melville Nauheim Shelter</option>
			<option value='ALY,78,76,42.974171,-73.072189'>Goddard Shelter</option>
			<option value='ALY,79,78,43.014141,-73.042946'>Kid Gore Shelter</option>
			<option value='ALY,80,80,43.05043,-73.012474'>Story Spring Shelter</option>
			<option value='ALY,81,83,43.10059,-72.96405'>Stratton Pond Shelter</option>
			<option value='ALY,80,85,43.144623,-72.990845'>William Douglas Shelter</option>
			<option value='ALY,79,86,43.178589,-72.99527'>Spruce Peak Shelter</option>
			<option value='ALY,81,88,43.222477,-72.950485'>Bromley Shelter</option>
			<option value='ALY,80,92,43.30117,-72.952415'>Peru Peak Shelter</option>
			<option value='BTV,105,5,43.347469,-72.952927'>Lost Pond Shelter</option>
			<option value='BTV,105,6,43.353344,-72.929535'>Old Job Shelter</option>
			<option value='BTV,105,6,43.364159,-72.94648'>Big Branch Shelter</option>
			<option value='BTV,104,8,43.398788,-72.954872'>Little Rock Pond Shelter</option>
			<option value='BTV,105,10,43.440624,-72.929466'>Greenwall Shelter</option>
			<option value='BTV,104,12,43.487877,-72.924507'>Minerva Hinchey Shelter</option>
			<option value='BTV,105,14,43.523651,-72.912727'>Clarendon Shelter</option>
			<option value='BTV,106,16,43.564693,-72.848251'>Governor Clement Shelter</option>
			<option value='BTV,108,17,43.576756,-72.802254'>Shrewsbury Peak Shelter</option>
			<option value='BTV,107,18,43.606052,-72.822464'>Cooper Lodge</option>
			<option value='BTV,106,19,43.63913,-72.830353'>Pico Camp</option>
			<option value='BTV,106,19,43.645096,-72.853546'>Churchill Scott Shelter</option>
			<option value='BTV,106,21,43.67923,-72.843048'>Tucker Johnson Shelter</option>
			<option value='BTV,105,22,43.712841,-72.861526'>Rolston Rest Shelter</option>
			<option value='BTV,102,25,43.767773,-72.922554'>David Logan Shelter</option>
			<option value='BTV,101,27,43.832127,-72.960228'>Sunrise Shelter</option>
			<option value='BTV,100,30,43.893589,-72.971771'>Sucker Brook Shelter</option>
			<option value='BTV,100,34,43.966869,-72.947868'>Boyce Shelter</option>
			<option value='BTV,100,35,43.987038,-72.936447'>Skylight Lodge</option>
			<option value='BTV,100,35,44.001614,-72.932137'>Emily Proctor Shelter</option>
			<option value='BTV,101,38,44.04974,-72.914024'>Cooley Glen Shelter</option>
			<option value='BTV,99,40,44.111721,-72.93676'>Battell Shelter</option>
			<option value='BTV,99,43,44.177876,-72.92733'>Glen Ellen Lodge</option>
			<option value='BTV,99,44,44.198502,-72.935486'>Theron Dean Shelter</option>
			<option value='BTV,99,46,44.236755,-72.930283'>Birch Glen Lodge</option>
			<option value='BTV,99,47,44.254559,-72.906197'>Cowle's Cove Shelter</option>
			<option value='BTV,100,49,44.301094,-72.88298'>Montclair Glen Lodge</option>
			<option value='BTV,100,52,44.350013,-72.862124'>Bamforth Ridge Shelter</option>
			<option value='BTV,98,53,44.391125,-72.917877'>Duck Brook Shelter</option>
			<option value='BTV,99,55,44.427425,-72.876534'>Buchanan Lodge</option>
			<option value='BTV,100,57,44.454002,-72.838745'>Puffer Shelter</option>
			<option value='BTV,100,58,44.484959,-72.826797'>Taylor Lodge</option>
			<option value='BTV,100,60,44.51545,-72.82029'>Butler Lodge</option>
			<option value='BTV,100,61,44.542625,-72.809692'>Taft Lodge</option>
			<option value='BTV,101,62,44.557045,-72.77282'>Sterling Pond Shelter</option>
			<option value='BTV,102,63,44.578789,-72.740974'>Whiteface Shelter</option>
			<option value='BTV,103,64,44.603512,-72.717262'>Bear Hollow Shelter</option>
			<option value='BTV,102,67,44.672508,-72.726746'>Roundtop Shelter</option>
			<option value='BTV,103,69,44.70602,-72.684174'>Corliss Camp</option>
			<option value='BTV,105,71,44.744595,-72.609276'>Spruce Ledge Camp</option>
			<option value='BTV,107,74,44.799198,-72.550972'>Tillotson Camp</option>
			<option value='BTV,108,77,44.849865,-72.516541'>Hazen's Notch Camp</option>
			<option value='BTV,107,80,44.913849,-72.510147'>Jay Camp</option>
			<option value='BTV,106,80,44.937191,-72.534691'>Laura Woodward Shelter</option>
			<option value='BTV,107,82,44.96957,-72.511749'>Shooting Star Shelter</option>
			<option value='BTV,115,38,44.006962,-72.479095'>Journey's End Camp</option>


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
