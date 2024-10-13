
// Or import puppeteer from 'puppeteer-core';
// import { schedule } from './classData';
import puppeteer from 'puppeteer';

const schedule = {
     "sunday": {
      "slot1": {
        "class": false,
        "start": "08:30:00",
        "end"  : "10:00:00"
      },
      "slot2": {
        "class": true,
        "start": "10:00:00",
        "end": "11:30:00"
      },
      "slot3": {
        "class": true,
        "start": "01:54:00",
        "end":"01:55:00",
        "link":"https://meet.google.com/owc-jfeo-bjz"
      }
    }
}



const joinClass = async (meetingData) =>{
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        userDataDir: './User Data/',
        args: [
            '--profile-directory=Profile 2','--no-sandbox','--disable-setuid-sandbox' // Select your profile here
        ]
    });

    const page = await browser.newPage();

    async function tryJoinMeeting() {
        await page.goto(meetingData.link);

        // Wait for the join button to appear using the full XPath
        try {
            const joinButtonXPath = '#yDmH0d > c-wiz > div > div > div:nth-child(29) > div.crqnQb > div > div.gAGjv > div.vgJExf > div > div > div.d7iDfe.NONs6c > div.shTJQe > div.jtn8y > div.XCoPyb > div > button';
            await page.waitForSelector('#yDmH0d > c-wiz > div > div > div:nth-child(30) > div.crqnQb > div > div.gAGjv > div.vgJExf > div > div > div.d7iDfe.NONs6c > div.shTJQe > div.jtn8y > div.XCoPyb > div > button', { visible: true, timeout: 5000 });
            page.click('#yDmH0d > c-wiz > div > div > div:nth-child(30) > div.crqnQb > div > div.gAGjv > div.vgJExf > div > div > div.d7iDfe.NONs6c > div.shTJQe > div.jtn8y > div.XCoPyb > div > button')

    
        } catch (error) {
            console.log('Join button not found:', error.message);
        }
    }

    // Keep trying to join every minute
    await tryJoinMeeting()

 
const now = new Date();
const endTime = new Date(now.toDateString() + ' ' + meetingData.end);
const timeUntilEnd = endTime.getTime() - now.getTime();


setTimeout(async () => {
  console.log('Meeting ended. Closing browser.');
  await browser.close();
}, timeUntilEnd);

};

const checkAndJoinMeeting = () => {
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 8); // HH:MM:SS format
  
    console.log(`Checking for meetings on ${dayOfWeek} at ${currentTime}`);
  
    if (schedule[dayOfWeek]) {
      for (const slot in schedule[dayOfWeek]) {
        const slotData = schedule[dayOfWeek][slot];
        if (slotData.class && currentTime >= slotData.start && currentTime < slotData.end) {
          console.log(`Found ongoing meeting for ${dayOfWeek} ${slot}`);
          joinClass(slotData);
          return;
        }
      }
    }


  
    console.log('No ongoing meetings right now.');
  };
  
  const getNextSlotStart = (day, currentSlot) => {
    const slots = Object.keys(schedule[day]);
    const currentIndex = slots.indexOf(currentSlot);
    if (currentIndex < slots.length - 1) {
      return schedule[day][slots[currentIndex + 1]].start;
    }
    return "23:59:59"; // End of day if it's the last slot
  };
  
  // Run the check every minute
  setInterval(checkAndJoinMeeting, 60000);
  
  // Initial check
  checkAndJoinMeeting();