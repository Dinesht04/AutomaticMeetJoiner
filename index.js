// Or import puppeteer from 'puppeteer-core';
import puppeteer from "puppeteer";
import { schedule } from "./classData.js";
// const url1 = "https://meet.google.com/wqy-bwvj-aib";
// const url2 = "https://meet.google.com/rzt-qwgf-gmf"
// const schedule = {
//   monday: {
//     slot1: {
//       class: false,
//       start: "08:30:00",
//       end: "10:00:00",
//     },
//     slot2: {
//       class: true,
//       start: "21:26:00",
//       end: "21:30:00",
//       link:url1
//     },
//     slot3: {
//       class: true,
//       start: "15:57:00",
//       end: "21:35:00",
//       link: url2,
//     },
//   },
// };

var classOnGoing = false;

const joinClass = async (meetingData) => {
  if(!classOnGoing){
    const browser = await puppeteer.launch({
      headless: false,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      userDataDir: "./User Data/",
      args: [
        "--profile-directory=Profile 2",
        "--no-sandbox",
        "--disable-setuid-sandbox", // Select your profile here
      ],
    });
  
    const page = await browser.newPage();
  
    async function tryJoinMeeting() {
      await page.goto(meetingData.link);
  
      // Wait for the join button to appear using the full XPath
      try {
         //mic
          await page.waitForSelector("#yDmH0d > c-wiz > div > div > div.TKU8Od > div.crqnQb > div > div.gAGjv > div.vgJExf > div > div > div.ZUpb4c > div.oORaUb.NONs6c > div > div.EhAUAc > div.Pr6Uwe > div > div",{visible: true, timeout:10000})
        page.click(
          "#yDmH0d > c-wiz > div > div > div.TKU8Od > div.crqnQb > div > div.gAGjv > div.vgJExf > div > div > div.ZUpb4c > div.oORaUb.NONs6c > div > div.EhAUAc > div.Pr6Uwe > div > div"
        );
        //camera
        await page.waitForSelector("#yDmH0d > c-wiz > div > div > div.TKU8Od > div.crqnQb > div > div.gAGjv > div.vgJExf > div > div > div.ZUpb4c > div.oORaUb.NONs6c > div > div.EhAUAc > div.utiQxe > div > div",{visible: true, timeout:10000})
        page.click("#yDmH0d > c-wiz > div > div > div.TKU8Od > div.crqnQb > div > div.gAGjv > div.vgJExf > div > div > div.ZUpb4c > div.oORaUb.NONs6c > div > div.EhAUAc > div.utiQxe > div > div")
          // join button
          await page.waitForSelector(
          "#yDmH0d > c-wiz > div > div > div.TKU8Od > div.crqnQb > div > div.gAGjv > div.vgJExf > div > div > div.d7iDfe.NONs6c > div.shTJQe > div.jtn8y > div.XCoPyb",
          { visible: true, timeout: 500000 }
        );
        //how can I improve the code? the script? what else do I want it to achieve? I guess once joined I could alter the time it checks
        page.click(
          "#yDmH0d > c-wiz > div > div > div.TKU8Od > div.crqnQb > div > div.gAGjv > div.vgJExf > div > div > div.d7iDfe.NONs6c > div.shTJQe > div.jtn8y > div.XCoPyb"
        );       

        classOnGoing = true;
        
      } catch (error) {
        console.log("Join button not found:", error.message);
      }
    }
  
    // Keep trying to join every minute
    await tryJoinMeeting();
  
    const now = new Date();
    const endTime = new Date(now.toDateString() + " " + meetingData.end);
    const timeUntilEnd = endTime.getTime() - now.getTime();
  
    setTimeout(async () => {
      console.log("Meeting ended. Closing browser.");
      classOnGoing = false;
      await browser.close();
    }, timeUntilEnd);
  }
  
};

const checkAndJoinMeeting = () => {
  const now = new Date();
  const dayOfWeek = now
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const currentTime = now.toTimeString().slice(0, 8); // HH:MM:SS format

  console.log(`Checking for meetings on ${dayOfWeek} at ${currentTime}`);

  if (schedule[dayOfWeek]) {
    for (const slot in schedule[dayOfWeek]) {
      const slotData = schedule[dayOfWeek][slot];
      if (
        slotData.class &&
        currentTime >= slotData.start &&
        currentTime < slotData.end
      ) {
        console.log(`Found ongoing meeting for ${dayOfWeek} ${slot}`);
        joinClass(slotData);
        return;
      }
    }
  }

  console.log("No ongoing meetings right now.");
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
setInterval(checkAndJoinMeeting, 120000);

// Initial check
checkAndJoinMeeting();
