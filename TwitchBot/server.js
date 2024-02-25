require('dotenv').config();
const tmi = require('tmi.js');

const regexCommand = new RegExp (/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const keyWords = ['cetus','vallis','cambion','duviri','zariman','archonHunt','nightwave']

const client = new tmi.Client({
	channels: ['oldeknight','ghostcupcake_'],
    identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_BOT_TOKEN
	},
});

client.connect();




client.on('message', async  (channel, tags, message, self) => {
    const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;
    if (!isNotBot){
        return;
    }else{
        try{
            const [raw, chatCommand, chatArgument] = message.match(regexCommand);
            
            const command = chatCommand.toLowerCase()
            // if(chatArgument != ""){
            //     const argument = chatArgument.toLowerCase()
            // }
            // console.log("Current command: " + command)
            
        
            if(command == 'help' || command === 'commands'){
                client.say(channel, `Every command starts with ! + one of the keywords: ` + keyWords);
            }else if (command === 'cetus') {
                client.say(channel, `Current time on Cetus is ${(await getData(command)).state}. Time left: ${(await getData(command)).timeLeft} -ish (±2mins)`);
            }else if (command === 'vallis'){
                client.say(channel, `Current time on Orb Vallis is ${(await getData(command)).state}. Time left: ${(await getData(command)).timeLeft} -ish (±2mins)`);
            }else if (command === 'cambion'){
                client.say(channel, `Current time on Cambion Drift is ${(await getData(command)).state}. Time left: ${(await getData(command)).timeLeft} -ish (±2mins)`);
            }else if (command === 'duviri'){
                client.say(channel, `Current emotion on the Duviri Paradox is ${(await getData(command)).state}`);
            }else if (command === 'zariman'){
                client.say(channel, `Current faction aboard the Zariman ship is ${(await getData(command)).state}. Time left: ${(await getData(command)).timeLeft} -ish (±2mins)`);
            }else if (command === 'archonhunt'){
                client.say(channel, `Current archon is ${(await getArchHuntData()).boss} and current missions are: ${(await getArchHuntData()).missions[0].type}, ${(await getArchHuntData()).missions[1].type}, ${(await getArchHuntData()).missions[2].type} on ${await guessTheArchonPlanet()}`);
            }else if (command === 'nightwave'){
                challengesList = (await getNightwaveData()).activeChallenges
                mappedChallenges = challengesList.map((curChallenge) => curChallenge.isDaily == true || curChallenge.isElite == true ? `${curChallenge.title} => ${curChallenge.desc}` : null).filter(a => a != null)
                console.log(mappedChallenges)
                client.say(channel , `This week's nightwave challenges are: ${mappedChallenges}`)
            }
            
            
        }catch(e){
            
            console.log("No command sent!")
            // console.log(e)
            
        }
    }
	
	// console.log(`${tags['display-name']}: ${message}`);
});

async function getData(chosenOW) {
    url = `https://api.warframestat.us/pc/${chosenOW}Cycle`;
    const response = await fetch(url);
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    return jsonResponse
  } 

async function getArchHuntData() {
    url = 'https://api.warframestat.us/PC/en/archonHunt/';
    const response = await fetch(url);
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    return jsonResponse
} 

async function guessTheArchonPlanet(){
    let planet = (await getArchHuntData()).missions[2].nodeKey;
    result = planet.split(" ")
    console.log(typeof result)
    console.log(result)
    return result[1].substring(1,result[1].length - 1);
}

async function getNightwaveData(){
    url = 'https://api.warframestat.us/PC/en/nightwave/';
    const response = await fetch(url);
    const jsonResponse = await response.json();
    // console.log(jsonResponse);
    return jsonResponse
}
 