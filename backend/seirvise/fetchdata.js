const axios = require('axios');
const cheerio = require('cheerio');
const fs = require("fs");

async function scrapeTableData(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Assuming the table has a specific Bootstrap class
        const tableData = [];
        $('.table.table-bordered.table-hover.adScroll').each((index, element) => {
            const rowData = [];
            $(element).find('td').each((i, el) => {
                rowData.push($(el).text().trim());
            });
            tableData.push(rowData);
        });

        return tableData;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function scrapeAndSaveData() {
    const allData = [];
    const baseURL = "https://www.mandiguru.co.in/daily-bhav/maharashtra?page=";

    for (let page = 1; page <= 20; page++) {
        const url = `${baseURL}${page}`;
        const jsonDataArray = [];
        ;

        try {
            const data = await scrapeTableData(url);
            arrData = Object.values(data);
            /* // console.log(arrData[0]);
                data.map(([key, mandi, names, price, date]) => {
                  jsonDataArray.push({
                  key: key,
                  mandi: mandi,
                  name: names,
                  price: price,
                  date: date,
                  jon:"hdudwhh",
  
              });
            });*/


            function arrayToObjectArray(array) {
                let objectArray = [];
                for (let i = 0; i < array.length; i += 5) {
                    let chunk = array.slice(i, i + 5);

                    let object = {

                        key: objectArray.length,
                        index: chunk[0],
                        mandi: {
                            city: chunk[1], state: "maharastr",
                            country: "india"
                        },
                        name: chunk[2],
                        price: chunk[3],
                        date: chunk[4],



                        // $pice:chunk[3].map(chunk[3]*72),
                    };
                    objectArray.push(object);
                }

                return objectArray;
            }

            // Call the function with your original array
            const arr = arrData.flat();
            let result = arrayToObjectArray(arr);
            allData.push(...result);

        } catch (error) {
            console.error('Error scraping data:', error);
        }
    }

    //console.log(typeof(allData));
    //allData['$price']=allData[price]*72;
    //console.log(typeof(allData));




    const jsonDataa = JSON.stringify(allData, null, 2);
    fs.writeFileSync('data.json', jsonDataa);
    console.log('Data has been written to data.json');
    console.log(allData.length)

}


// Call the function to start scraping and saving data
module.exports =
    { scrapeAndSaveData }