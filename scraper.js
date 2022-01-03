const puppeteer = require('puppeteer');

const optionUrl = 'https://www.theocc.com/Market-Data/Market-Data-Reports/Volume-and-Open-Interest/Volume-Query';

async function scrapeOption(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    //Click on “Accept analytic cookies”
    await page.click('[value="Accept analytic cookies"]');

    // Select “Options Symbol” under Symbol
    await page.waitForSelector('#marketData-volumeQuery > div > div.marketData-input.col-12.col-lg-3 > div:nth-child(3) > div.marketData-inputGroupForm > ul > li:nth-child(2) > div');
    await page.click('#marketData-volumeQuery > div > div.marketData-input.col-12.col-lg-3 > div:nth-child(3) > div.marketData-inputGroupForm > ul > li:nth-child(2) > div');

    // Type in ticker (for example Tesla): “TSLA”
    const tickerSymbolTextBoxSelector = '#marketData-volumeQuery > div > div.marketData-input.col-12.col-lg-3 > div:nth-child(3) > div.marketData-inputGroupForm > div > input[type=textbox]';
    await page.waitForSelector(tickerSymbolTextBoxSelector);
    await page.type(tickerSymbolTextBoxSelector, 'TSLA');

    // Selected trading day to get data options data from
    await page.click('#marketData-volumeQuery > div > div.marketData-input.col-12.col-lg-3 > div:nth-child(10) > div > a');
    const callsTableSelector = '#marketData-volumeQuery > div > div.marketData-results-container.col-12.col-lg-9 > div > div:nth-child(4) > table > tbody > tr:nth-child(1) > td:nth-child(2)';
    const putsTableSelector = '#marketData-volumeQuery > div > div.marketData-results-container.col-12.col-lg-9 > div > div:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(2)';
    const dateSelector = '#marketData-volumeQuery > div > div.marketData-results-container.col-12.col-lg-9 > div > h2';
    
    await page.waitForSelector(callsTableSelector);
    await page.waitForSelector(putsTableSelector);
    await page.waitForSelector(dateSelector);

    const numberOfCallsObject = await page.$(callsTableSelector);
    const numberOfPutsObject = await page.$(putsTableSelector);
    const dateObject = await page.$(dateSelector);
    
    const callsString = await numberOfCallsObject.getProperty('textContent');
    const putsString = await numberOfPutsObject.getProperty('textContent');
    const dateString = await dateObject.getProperty('textContent');

    const calls = Number(callsString._remoteObject.value.replace(',',''));
    const puts = Number(putsString._remoteObject.value.replace(',',''));

    const optionsData = {
        date: dateString._remoteObject.value,
        calls,
        puts,
        putCallRatio: puts / calls
    }

    // console.log(optionsData);
    console.log(optionsData);
    

    await browser.close();
}

scrapeOption(optionUrl);


