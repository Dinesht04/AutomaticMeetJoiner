# Automatic Google Meet Joiner for Automating Online Classes

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-Automate%20Chrome-40B5A4?style=for-the-badge&logo=puppeteer&logoColor=white)](https://pptr.dev/)

This project provides a simple Node.js script that uses Puppeteer to automatically join Google Meet classes based on a predefined schedule. It's designed to help you never miss a class by handling the joining process for you!

##  Features

* **Automated Class Joining:** Automatically navigates to Google Meet links at scheduled times.
* **Microphone/Camera Control:** Attempts to disable microphone and camera upon joining.
* **Configurable Schedule:** Easily define your daily class timetable in a JSON-like JavaScript file.
* **Browser Profile Support:** Uses a specific Chrome user profile, allowing you to stay logged into your Google account.
* **Automatic Class End:** Closes the browser tab/window once the class end time is reached.

## ⚙️ How It Works

The script operates in the background, continuously checking the current time against your defined `schedule.js` (or `classData.js` if you choose to separate it).

1.  **Time Check:** Every 2 minutes (default, can be adjusted), it checks the current day and time.
2.  **Schedule Lookup:** It looks for a matching class slot in your timetable where `class` is set to `true` and the current time falls within the `start` and `end` times.
3.  **Browser Launch:** If an ongoing class is found, it launches a headless (or non-headless, configurable) Chrome browser instance using Puppeteer.
4.  **Google Meet Navigation:** It navigates to the specified Google Meet link.
5.  **Join Process:** It attempts to:
    * Click on the microphone disable button.
    * Click on the camera disable button.
    * Click the "Join Now" button.
6.  **Class End:** Once the class's `end` time is reached, the browser tab/window automatically closes.
7.  **Prevents Multiple Joins:** The `classOnGoing` flag ensures that the script doesn't try to open multiple browser instances for the same ongoing class.

##  Getting Started

Follow these steps to set up and run the auto-joiner on your machine.

### Prerequisites

* **Node.js:** Make sure you have Node.js installed (LTS version recommended). You can download it from [nodejs.org](https://nodejs.org/).
* **Google Chrome:** Puppeteer interacts with Google Chrome, so ensure it's installed on your system. The script currently points to a Windows default path, but you can adjust `executablePath` if needed.

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Dinesht04/AutomaticMeetJoiner.git
    
    cd AutomaticMeetJoiner
    ```
    (Replace `your-username/your-repo-name` with your actual GitHub repository details.)

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    This will install `puppeteer` and `nodemon` (for automatic restarts during development).

### Configuration

The core of this project is your class schedule.

1.  **Create your `classData.js` (or `schedule.js`) file:**
    You'll need to create a file (e.g., `classData.js` in the root of your project) that exports your class schedule as a JavaScript object.

    **Example `classData.js` structure:**

    ```javascript
    export const schedule = {
        "monday": {
            "slot1": {
                "class": false, // Set to true if there's a class
                "start": "08:30:00",
                "end": "10:00:00"
            },
            "slot2": {
                "class": true,
                "start": "10:05:00",
                "end": "11:35:00",
                "link": "[https://meet.google.com/yrx-nrks-bpe](https://meet.google.com/yrx-nrks-bpe)" // Your Google Meet link
            },
            // ... more slots for Monday
        },
        "tuesday": {
            "slot1": {
                "class": true,
                "start": "08:30:00",
                "end": "10:00:00",
                "link": "[https://meet.google.com/xxo-ejnx-iqk](https://meet.google.com/xxo-ejnx-iqk)"
            },
            // ... more slots for Tuesday
        },
        // ... repeat for "wednesday", "thursday", "friday", "saturday", "sunday"
    };
    ```

    * **Day Names:** Use lowercase full day names (e.g., `"monday"`, `"tuesday"`).
    * **Slot Names:** You can name your slots anything (e.g., `"slot1"`, `"morningClass"`).
    * **`class: true/false`:** Set to `true` if there's a class in that slot, `false` otherwise.
    * **`start` and `end`:** Use **24-hour format (HH:MM:SS)**. These define the window during which the script will attempt to join.
    * **`link`:** The full Google Meet link for that specific class. **Only required if `class` is `true`.**

2.  **Locate your Chrome `Profile 2` (or desired profile) `User Data` directory:**
    Puppeteer uses Chrome profiles to remember logins and settings.
    * **Windows:** Typically `C:\Users\YourUsername\AppData\Local\Google\Chrome\User Data\`
    * **macOS:** `~/Library/Application Support/Google/Chrome/`
    * **Linux:** `~/.config/google-chrome/`

    **Identify your profile folder:** Inside the `User Data` directory, you'll find folders like `Default`, `Profile 1`, `Profile 2`, etc. If you want to use "Profile 2" as specified in the code, ensure that folder exists and contains your logged-in Google account. If you use a different profile, update `"--profile-directory=Profile 2"` in `index.js` accordingly.

3.  **Adjust `executablePath` (if needed):**
    In `index.js`, the `executablePath` for Chrome is set to a Windows default. If you're on a different OS or your Chrome is installed in a custom location, **you must update this path**:

    ```javascript
    const browser = await puppeteer.launch({
      headless: false, // Set to true for background execution without a visible browser
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // <--- UPDATE THIS PATH
      userDataDir: "./User Data/", // Relative path within your project or full path
      args: [
        "--profile-directory=Profile 2", // <--- UPDATE IF USING A DIFFERENT PROFILE
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });
    ```
    * **`headless: false`:** This setting means you'll see a Chrome window pop up and navigate to the meeting. Change to `true` if you want it to run entirely in the background without a visible browser window (useful for servers or less intrusive operation).
    * **`userDataDir`:** This points to where your Chrome profile data is stored. The provided `"./User Data/"` suggests it will look for a `User Data` folder *relative to your project's root*. It's often safer to use an absolute path to your actual Chrome `User Data` directory.

### Running the Script



1.  **To Start the Program:**
    You can run it directly with:
    ```bash
    node index.js
    ```
    

## ⚠️ Important Notes

* **Google Meet UI Changes:** Google Meet's interface might change over time, which could break the selectors (`#yDmH0d > ...`) used to find buttons. If the script stops working, you might need to update these selectors by inspecting the Google Meet page's HTML in your browser's developer tools.
* **Microphone/Camera Permissions:** When Puppeteer first launches Chrome with your profile, Google Meet might ask for microphone and camera permissions. You'll need to grant these manually once in the launched browser window.
* **Time Zones:** The script uses your system's local time. Ensure your system's time zone is correctly configured.
* **Internet Connection:** A stable internet connection is required for the script to function correctly.

## 🤝 Contributing

Feel free to fork this repository, open issues, and submit pull requests if you have improvements or bug fixes!

The aim of this project was just to provide an escape and automate the joining and leaving of online classes for attendance. 