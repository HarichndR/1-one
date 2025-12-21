const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapePageData(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const pageData = [];

        // Select each card containing the commodity data
        $('.card').each((index, element) => {
            const commodity = $(element).find('.card-header p a').text().trim();
            const mandi = $(element).find('.card-header a.fs-5').text().trim();
            const price = $(element).find('.card-body .d-flex span.fw-bold.fs-5').first().text().trim();
            const date = $(element).find('.card-body .d-flex span.fw-bold.ms-2').text().trim();

            if (commodity && mandi && price && date) {
                pageData.push({
                    commodity,
                    mandi,
                    price,
                    date
                });
            }
        });

        return pageData;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function scrapeAndSaveData() {
    const allData = [];
    const baseURL = 'https://www.mandiguru.co.in/daily-bhav/maharashtra?page=';

    for (let page = 1; page <= 20; page++) {
        const url = `${baseURL}${page}`;
        try {
            const data = await scrapePageData(url);
            allData.push(...data);
        } catch (error) {
            console.error(`Error scraping data from page ${page}:`, error);
        }
    }

    fs.writeFileSync('data.json', JSON.stringify(allData, null, 2));
    console.log('Data has been written to data.json');
    console.log(`Total records scraped: ${allData.length}`);
}

// Start the scraping process
scrapeAndSaveData();
