import express from 'express';
import cors from 'cors';
import axios from 'axios';
import morgan from 'morgan';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

dotenv.config();


    app.get('/api/', (req, res) => {
        res.send('API is running - CDT Weather');
    });

    app.get('/api/getSelectFormat', (req, res) => {
        axios({
            method: 'GET',
            url: `https://api.weather.gov/points/${req.query.coord.split(',')[0]},${req.query.coord.split(',')[1]}`,
            headers: {
                'User-Agent': '(cdtweather.com, admin@cdtweather.com)',
                'Accept': 'application/geo+json'
            }
        }).then(response => {
            const gridID = response.data.properties.gridId;
            const gridX = response.data.properties.gridX;
            const gridY = response.data.properties.gridY;
            res.status(200).json({
                result: `<option value='${gridID},${gridX},${gridY},${req.query.coord.split(',')[0]},${req.query.coord.split(',')[1]}'></option>`
            });
        }, error => res.json(error));
    })

    app.get('/api/getForecastFromLocation', (req, res) => {

    
        axios({
                method: 'GET',
                url: `https://api.weather.gov/points/${req.query.lat},${req.query.long}/forecast`,
                headers: {
                    'User-Agent': '(cdtweather.com, admin@cdtweather.com)',
                    'Accept': 'application/geo+json'
                }
            }).then(response => {
                res.status(200).json(response.data.properties.periods);
            }, error => res.json({message: 'We are currently experiencing an issue communicating with the National Weather Service servers at this location. Please try again later'}).status(500))
    })

    app.get('/api/getForecastFromLandmark', (req, res) => {
        const gridID = req.query.id.split(',')[0];
        const gridX = req.query.id.split(',')[1];
        const gridY = req.query.id.split(',')[2];
        axios({
            method: 'GET',
            url: `https://api.weather.gov/gridpoints/${gridID}/${gridX},${gridY}/forecast`,
            headers: {
                'User-Agent': '(cdtweather.com, admin@cdtweather.com)',
                'Accept': 'application/geo+json'
            }
        }).then(response => {
            res.status(200).json(response.data.properties.periods);
        }, error => res.json({message: 'We are currently experiencing an issue communicating with the National Weather Service servers at this location. Please try again later'}).status(500)
        );
    })

    app.post('/api/sendMessage', (req, res) => {
        const {name, email, message} = req.body;
        //res.send({name, email, message});
        const transporter = nodemailer.createTransport({
            service: 'SendinBlue', // no need to set host or port etc.
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
       });
            const info = transporter.sendMail({
              from: process.env.SMTP_USER,
              to: 'zbtucker@gmail.com',
              subject: "CDT Weather Contact Form Submission",
              html: `A new message has been sent from CDT Weather:<br />
              Sender Name: ${name}<br />
              Sender Email: ${email}<br /><br />
              Message: ${message}<br />`
            });
            res.send({message: 'Message Sent!'});

    })


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => (
    console.log(`Server listening on port ${PORT}`)
));