const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const axios = require('axios');
const schedule = require('node-schedule');

const getInformationsOfBinance = async () => {
  try {
    const response = await axios({
      url: process.env.BINANCE_URL,
      method: 'get',
      params: {
        'symbol': process.env.SYMBOL
      }
    })
    
    return {
      symbol: response.data.symbol,
      priceNow: +response.data.lastPrice,
      lowPrice: +response.data.lowPrice,
      highPrice: +response.data.highPrice
    }
  } catch (error) {
    console.log("Binance", error.message)
  }
}

const sendSMS = async (binance) => {
  try {
    await axios({
      url: process.env.SERVICE_URL_SMS,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-API-TOKEN': process.env.API_TOKEN
      },
      data: {
        from: process.env.PHONE,
        to: process.env.PHONE,
        contents: [{
          type: 'text',
          text: JSON.stringify(binance)
        }]
      }
    });
    console.log("SMS sended");
  } catch (error) {
    console.log(error.message);
  }
}

schedule.scheduleJob('0 0 * * * *', async() => {
  console.log("Run schedule");
  const responseOfBinance = await getInformationsOfBinance();
  await sendSMS(responseOfBinance);
});