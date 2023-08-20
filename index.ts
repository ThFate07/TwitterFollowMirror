import puppeteer, { Page } from 'puppeteer'
require('dotenv').config()
import { option } from './types';

function parseClasses(str: string): string { 
    return'.' + str.split(' ').join('.')
}

async function initializeBrowser(options: option) { 
    const browser = await puppeteer.launch(options.launchOptions);
    return await browser.newPage();
}



async function login(page: Page) { 
    const loginInputClasses = ".r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj.r-poiln3.r-7cikom.r-1ny4l3l.r-t60dpp.r-1dz5y72.r-fdjqy7.r-13qz1uu"
    const nextButtonClasses = parseClasses('css-18t94o4 css-1dbjc4n r-sdzlij r-1phboty r-rs99b7 r-ywje51 r-usiww2 r-2yi16 r-1qi8awa r-1ny4l3l r-ymttw5 r-o7ynqc r-6416eg r-lrvibr r-13qz1uu');
    const passInputClasses = '.r-30o5oe.r-1niwhzg.r-17gur6a.r-1yadl64.r-deolkf.r-homxoj';
    const loginButtonClasses = '.css-1dbjc4n.r-1sw30gj.r-sdzlij.r-1phboty';

    await page.waitForSelector(loginInputClasses);
    await page.type(loginInputClasses, process.env.fUSERNAME || '');
    await page.click(nextButtonClasses)
    
    
    await page.waitForSelector(loginButtonClasses)
    await page.type(passInputClasses, process.env.fPASSWORD || '')
    await page.click(loginButtonClasses)
}

async function goToUser(page: Page, options: option) { 
    const searchSelectors = parseClasses('r-30o5oe r-1niwhzg r-17gur6a r-1yadl64 r-deolkf r-homxoj r-poiln3 r-7cikom r-1ny4l3l r-xyw6el r-13rk5gd r-1dz5y72 r-fdjqy7 r-13qz1uu')

    await page.waitForSelector(searchSelectors)
    await page.goto(options.userProfileLink)
}

async function followUsers(page: Page) { 
    const followButtonClasses = parseClasses('css-18t94o4 css-1dbjc4n r-42olwf r-sdzlij r-1phboty r-rs99b7 r-15ysp7h r-4wgw6l r-1ny4l3l r-ymttw5 r-o7ynqc r-6416eg r-lrvibr')

    setInterval(async () => { 
        try { 

            await page.waitForSelector(followButtonClasses)
        } catch { 
            page.
        }
        await page.click(followButtonClasses)
    }, 1000 * 1.6 )



}
async function main(options: option) { 
   
    
   
    const URL = "https://twitter.com/i/flow/login" 
    const page = await initializeBrowser(options)

    await page.goto(URL)
    await page.setViewport({width: 1080, height: 1024});

    await login(page)
    await goToUser(page, options);
    await followUsers(page)

}

// variables 
const options = {
    userProfileLink: 'https://twitter.com/harkirat961/following',
    launchOptions: { headless: false } 
}

main(options)


