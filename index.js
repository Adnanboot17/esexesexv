import fs from 'fs';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import figlet from 'figlet';
import boxen from 'boxen';
import player from 'play-sound'; // Add the play-sound package

// Function to check if required modules are installed
function checkModule(moduleName) {
  try {
    require(moduleName);
  } catch (error) {
    console.error(`❌ Module '${moduleName}' is not installed. Please install it using:\n` +
                  `npm install ${moduleName} or yarn add ${moduleName}`);
    process.exit(1); // Exit the process if the module is not installed
  }
}

// Function to play music
function playMusic() {
  const audio = player();
  audio.play('ada+apa+kak_out.mp3', (err) => {
    if (err) console.error(`Could not play sound: ${err}`);
  });
}

// Function to read invite codes from a file
function readInviteCodesFromFile(filename) {
  return fs.readFileSync(filename, 'utf-8').split('\n').filter(Boolean); // Filter out empty lines
}

// Function to submit invite codes
async function submitInviteCode(inviteCode) {
  const url = "https://pentil.pink/interstella/";
  const headers = {
    "accept": "*/*",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest",
    "cookie": "PHPSESSID=66ce5cb45fcf83d05cafacff3bf7aca1", // Adjust your session ID
    "Referer": "https://pentil.pink/interstella/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };

  const body = `invite_code=${inviteCode}`;
  const spinner = ora(`📤 Submitting invite code ${chalk.bold(inviteCode)}...`).start(); // Start spinner

  try {
    const response = await axios.post(url, body, { headers });

    // Stop spinner and show success message
    spinner.succeed(chalk.bgGreen.black.bold(`✔️ Invite code ${inviteCode} submitted successfully!`));

    // Output the result with a modern styled format in a box
    const responseOutput = boxen(chalk.greenBright(`🎉 Response:\n${JSON.stringify(response.data, null, 2)}`), {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'green',
      backgroundColor: 'black',
    });
    console.log(responseOutput);

    // Wait for 10 seconds if the submission is successful
    await new Promise(resolve => setTimeout(resolve, 10000));

  } catch (error) {
    // Stop spinner and show error message
    spinner.fail(chalk.bgRed.white.bold(`❌ Failed to submit invite code ${inviteCode}: ${error.message}`));
  }
}

// Function to continuously submit invite codes in sequence
async function startInviteLoop() {
  const inviteCodes = readInviteCodesFromFile('invite_codes.txt');

  console.log(chalk.cyanBright.bold(figlet.textSync('Invite Bot', { horizontalLayout: 'full' })));
  console.log(chalk.yellow('-----------------------------------------------'));

  // Start playing music at the beginning of the script
  playMusic();

  while (true) { // Infinite loop
    for (let code of inviteCodes) {
      await submitInviteCode(code); // Wait for each submission to finish before proceeding to the next one
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds between submissions
    }
  }
}

// Start the script
startInviteLoop();