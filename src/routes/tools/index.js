import { h } from 'preact';
import style from './style.css';
import axios from 'axios';
import {useState} from 'preact/hooks';

const Tools = () => {
    const [inputValue, setInputValue] = useState('');
    const [selectFormat, setSelectFormat] = useState('');

	const getSelectFormat = () => {
        // Coord format: lat,long (no space between)
        setInputValue('');
		setSelectFormat('');
		axios({
			method: 'GET',
			url: `https://cdt-weather-backend.herokuapp.com/api/getSelectFormat?coord=${inputValue}`,
		}).then(response => {
			setSelectFormat(response.data.result || response.data.error);
		}, error => console.log(error));
	}

    // useEffect(() => {

    // }, [selectFormat]);
	
	return (<div class={style.container}>
        {selectFormat && <div>{selectFormat}</div>}
        <input type='text' id='inputValue' value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder='lat,long' /><button onClick={getSelectFormat}>Submit</button>
	</div>);
};

export default Tools;
