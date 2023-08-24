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
    if (options.userProfileLinkFollowing) {
        await page.goto(options.userProfileLinkFollowing)
        await page.waitForSelector(searchSelectors)
        return
    }

    await page.goto(options.userProfileLinkLiked);
    await page.waitForSelector(searchSelectors)
}

async function followUsersFollowed(page: Page) { 
    const followButtonClasses = '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-kemksi.r-1kqtdi0.r-1ljd8xs.r-13l2t4g.r-1phboty.r-16y2uox.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > section > div > div > div > div > div:nth-child(1) > div > div > div > div > div.css-1dbjc4n.r-1iusvr4.r-16y2uox > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1wtj0ep > div.css-1dbjc4n.r-19u6a5r > div' + parseClasses('css-18t94o4 css-1dbjc4n r-42olwf r-sdzlij r-1phboty r-rs99b7 r-15ysp7h r-4wgw6l r-1ny4l3l r-ymttw5 r-o7ynqc r-6416eg r-lrvibr')
    setInterval(async () => { 
        try { 

            await page.waitForSelector(followButtonClasses)
        } catch { 
            // scroll down
        }
        await page.click(followButtonClasses)
    }, 1000 * 1.6 )
}

async function followUsersLiked(page: Page) { 
    const postClasses = '[data-testid="cellInnerDiv"]'
    const replyClasses = '.css-1dbjc4n.r-4qtqp9.r-zl2h9q'
    const usernameClasses = parseClasses('')
    const userDetailsPromptClass = parseClasses('css-1dbjc4n r-nsbfu8');
    const followButtonClass = parseClasses('css-18t94o4 css-1dbjc4n r-42olwf r-sdzlij r-1phboty r-rs99b7 r-2yi16 r-1qi8awa r-1ny4l3l r-ymttw5 r-o7ynqc r-6416eg r-lrvibr')

    const followUsers = () => {  
        const test = document.querySelectorAll('[data-testid="cellInnerDiv"]')
        const event = new MouseEvent('mouseover', {'view': window,'bubbles': true,'cancelable': true})
        
        test.forEach(async (user) => { 
            const isReply =  user.querySelector('.css-1dbjc4n.r-4qtqp9.r-zl2h9q')

            
            if (isReply) { 
                console.log('is a reply')
                return
            }

            
            // pending
            const userElem = user.querySelector(".css-901oao.r-1awozwy.r-1nao33i.r-6koalj.r-1qd0xha.r-a023e6.r-b88u0q.r-rjixqe.r-bcqeeo.r-1udh08x.r-3s2u2q.r-qvutc0")
            userElem?.dispatchEvent(event)

            await page.waitForSelector('.css-1dbjc4n.r-nsbfu8')
            
            await page.click(`${userDetailsPromptClass} ${followButtonClass}`);
            console.log('followed')
        })
        console.log(test, 'testing')
    }

    await page.waitForSelector(postClasses);
    await page.evaluate((followUsers))
}

async function followUsers(page: Page, options: option) { 
    if (options.userProfileLinkFollowing) { 
        return await followUsersFollowed(page)
    }

    await followUsersLiked(page)

}

async function main(options: option) { 
   
    
   
    const URL = "https://twitter.com/i/flow/login" 
    const page = await initializeBrowser(options)
    
    await page.goto(URL)
    await page.setViewport({width: 1080, height: 1024});

    await login(page)
    await goToUser(page, options);
    await followUsers(page, options)

}

// variables 
const options = {
    userProfileLinkFollowing: '',
    // userProfileLinkFollowing: 'https://twitter.com/harkirat961/following',
    userProfileLinkLiked: 'https://twitter.com/harkirat961/likes',
    launchOptions: { headless: false } 
}

main(options)


