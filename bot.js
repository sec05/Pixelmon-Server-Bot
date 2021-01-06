const Discord = require('discord.js');
require('dotenv').config({path: "\.env"});
const client = new Discord.Client();
const puppeteer = require('puppeteer');
client.once('ready', () => {
	console.log('Ready!');
});
client.on("message",message=>{
	if(message.content==="!start")
	{
		message.channel.send("starting server");
		const scrape = async () =>
		{
		const browser = await puppeteer.launch({headless: false});
		const page = await browser.newPage();
		await page.goto('https://aternos.org/go/');
		await page.evaluate(val => document.querySelector("#user").value = val, process.env.USER_ID);
		await page.evaluate(val=>document.querySelector("#password").value = val, process.env.PASSWORD);
		await page.click("#login");
		await page.waitForNavigation();
		await page.click("body > div > main > section > div > div.servers.single > div"); 
		await page.waitForNavigation();
		await page.click("#start");
		await page.waitForSelector("#nope > main > div > div > div > header > span");
		await page.click("#nope > main > div > div > div > header > span");
		let statusHTML = await page.evaluate(()=>document.querySelector("#nope > main > section > div.page-content.page-server > div.server-status > div.status.queueing > div > span.statuslabel-label-container > span").innerHTML);
		console.log(statusHTML);
		if(statusHTML==="Waiting in queue")
		{
			console.log("Waiting in the queue")
			message.channel.send("Waiting in queue");
			while(true)
			{
				try{
					await page.click("#confirm");
					break;
				}
				catch(error)
				{

				}
			}
			message.channel.send("Server is starting up!");
		}
		if(statusHTML==="Loading ...")
		{
			message.channel.send("Server is starting up!");
		}
		await page.waitForTimeout(300000);
		await browser.close();	
		}
		scrape();
		
	}
})
client.login(process.env.DISCORD_TOKEN);