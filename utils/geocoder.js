import node_geocoder from 'node-geocoder';
import dotenv from 'dotenv';
dotenv.config({ path: './config/config.env' });

const options = {
    provider : process.env.GEOCODER_PROVIDER,
    httpAdapter : 'https',
    apiKey : process.env.GEOCODER_APIKEY,
    formatter : null
}


const geocoder = node_geocoder(options)

export default geocoder;