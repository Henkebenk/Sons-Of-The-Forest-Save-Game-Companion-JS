const fs = require("fs");
const os = require("os");
const path = require("path");

// Global objects
let saveDirectoryPath;
let currentSavePath;
let gameStateSaveData;
let playerStateSaveData;
let playerInventorySaveData;
let saveData;
let worldItemManagerSaveData;
let worldObjectLocatorManagerSaveData;
let customSaveName = false;
const username = os.userInfo().username;
const defaultSaveDir = `C:\\Users\\${username}\\AppData\\LocalLow\\Endnight\\SonsOfTheForest\\Saves`;
const directoryLabel = document.getElementById("directory");

class Item {
  constructor(type, name, itemID) {
    this.type = type;
    this.name = name;
    this.quantity = 0;
    this.itemID = itemID;
    this.itemFound = false;
  }
}

let inventory = [
  //Weapons
  new Item("weapons", "Climbing Axe", 478),
  new Item("weapons", "Compact Pistol", 355),
  new Item("weapons", "Crafted Bow", 443),
  new Item("weapons", "Crafted Club", 477),
  new Item("weapons", "Crafted Spear", 474),
  new Item("weapons", "Crossbow", 365),
  new Item("weapons", "Firefighter Axe", 431),
  new Item("weapons", "Golf Putter", 525),
  new Item("weapons", "Rifle", 361),
  new Item("weapons", "Shotgun", 358),

  //Attachments
  new Item("attachments", "Air Gun Scope", 470),
  new Item("attachments", "Crossbow Quiver", 384),
  new Item("attachments", "Flashlight", 378),
  new Item("attachments", "Laser Sight", 375),
  new Item("attachments", "Pistol Rail", 376),
  new Item("attachments", "Pistol Suppressor", 374),
  new Item("attachments", "Scope", 377),
  new Item("attachments", "Silencer", 374),

  //Ammo
  new Item("ammo", "Buckshot Ammo", 364),
  new Item("ammo", "Carbon Arrow", 373),
  new Item("ammo", "Crafted Arrow", 507),
  new Item("ammo", "Pistol Ammo", 362),
  new Item("ammo", "Slug ammo", 363),
  new Item("ammo", "Stun Gun Ammo", 369),
  new Item("ammo", "Zipline Rope", 523),

  //Throwable
  new Item("throwable", "Grenade", 381),
  new Item("throwable", "Flare", 440),
  new Item("throwable", "Time Bomb", 417),
  new Item("throwable", "Molotov", 388),

  //Tools
  new Item("tools", "Binoculars", 341),
  new Item("tools", "GPS Locator", 529),
  new Item("tools", "GPS Tracker", 412),
  new Item("tools", "Walkie-Talkie", 486),

  //Printed
  new Item("printed", "Printed Arrow", 618),
  new Item("printed", "Printed Grappling Hook", 560),
  new Item("printed", "Printed Flask", 426),
  new Item("printed", "Printer Resin", 390),
  new Item("printed", "Printed Sled", 428),

  //Clothing
  new Item("clothing", "Blazer (Old Jacket)", 491),
  new Item("clothing", "Camouflage Suit", 558),
  new Item("clothing", "Hoodie", 490),
  new Item("clothing", "Silk Pajamas", 487),
  new Item("clothing", "Puffy Jacket", 500),
  new Item("clothing", "Track Suit", 555),

  //Armor
  new Item("armor", "Bone Armor", 494),
  new Item("armor", "Creepy Armor", 593),
  new Item("armor", "Deer Hide Armor", 519),
  new Item("armor", "Golden Armor", 572),
  new Item("armor", "Gold Mask", 435),
  new Item("armor", "Leaf Armor", 473),
  new Item("armor", "Mutant Armor", 492),
  new Item("armor", "Red Mask", 391),
  new Item("armor", "Tech Armor", 554),

  //Food and drinks
  new Item("food", "Canned Food", 434),
  new Item("food", "Cat Food", 464),
  new Item("food", "Emergency Pack", 483),
  new Item("food", "Fish", 436),
  new Item("food", "Energy Drink", 439),
  new Item("food", "MRE", 438),
  new Item("food", "Ramen Noodles", 421),

  //Plants and seeds
  new Item("plants", "Aloe Vera", 451),
  new Item("plants", "Blackberries", 595),
  new Item("plants", "Blackberry Seed", 598),
  new Item("plants", "Arrowleaf", 454),
  new Item("plants", "Blueberries", 445),
  new Item("plants", "Chicory", 465),
  new Item("plants", "Devil’s Club", 449),
  new Item("plants", "Energy Mix", 461),
  new Item("plants", "Energy Mix Plus", 462),
  new Item("plants", "Fireweed", 453),
  new Item("plants", "Fireweed Seed", 601),
  new Item("plants", "Guarana Berries", 594),
  new Item("plants", "Guarana Seed", 602),
  new Item("plants", "Health Mix", 455),
  new Item("plants", "Health Mix Plus", 456),
  new Item("plants", "Horsetail", 450),
  new Item("plants", "Horsetail Seed", 603),
  new Item("plants", "Salmonberries", 447),
  new Item("plants", "Salmon Seed", 604),
  new Item("plants", "Snowberries", 448),
  new Item("plants", "Twinberries", 446),
  new Item("plants", "Yarrow", 452),
  new Item("plants", "Yarrow Seed", 606),

  //Other
  new Item("other", "Air Canister", 469),
  new Item("other", "Battery Charger", 458),
  new Item("other", "Bone", 405),
  new Item("other", "C4 Brick", 420),
  new Item("other", "Circuit Board", 416),
  new Item("other", "Cloth", 415),
  new Item("other", "Coins", 502),
  new Item("other", "Duct tape", 419),
  new Item("other", "Feather", 479),
  new Item("other", "Leaf", 484),
  new Item("other", "Loot Pouch", 508),
  new Item("other", "Medicine", 437),
  new Item("other", "Money", 496),
  new Item("other", "Paper Target", 518),
  new Item("other", "Radio", 590),
  new Item("other", "Rock", 393),
  new Item("other", "Rope", 403),
  new Item("other", "Severed Arm", 480),
  new Item("other", "Severed Leg", 481),
  new Item("other", "Severed Head", 482),
  new Item("other", "Skin Pouch", 508),
  new Item("other", "Skull", 430),
  new Item("other", "Sleeping Bag", 573),
  new Item("other", "Small Rock", 476),
  new Item("other", "Stick", 392),
  new Item("other", "Tarp", 504),
  new Item("other", "Tech Mesh", 553),
  new Item("other", "Torch", 503),
  new Item("other", "Turtle Egg", 401),
  new Item("other", "Turtle Shell", 506),
  new Item("other", "Wire", 418),
  new Item("other", "Wrist Watch", 410),
  new Item("other", "Vodka Bottle", 414)
  ]; 


// ---[DETECT THE SAVES]---
function detectSaves(){
// Check if default save directory exists
fs.access(defaultSaveDir, (err) => {
    if (!err) {
      saveDirectoryPath = defaultSaveDir;
      // directoryLabel.textContent = defaultSaveDir;
      loadAllSavesFromFolder(defaultSaveDir);
      document.getElementById("detected").textContent = "automatically detected";
      document.getElementById("detected").classList = "green";
      document.getElementById("detected").title = saveDirectoryPath;
    } else {
      document.getElementById("detected").textContent = "not detected";
      document.getElementById("detected").classList = "red";
    }
  });
}

// ---[READING]---
function readInitialSaveInfo(savePath, callback) {
    fs.readFile(savePath + '\\GameStateSaveData.json', "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        callback([]);
      } else {
        gameStateSaveData = JSON.parse(data);
        const saveInfo = [];
        const saveTime = JSON.parse(gameStateSaveData.Data.GameState).SaveTime;
        const date = new Date(saveTime);
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        saveInfo.push(date.toLocaleDateString("en-US",options));
        saveInfo.push(JSON.parse(gameStateSaveData.Data.GameState).GameDays);
        saveInfo.push(JSON.parse(gameStateSaveData.Data.GameState).CoreGameCompleted);
        saveInfo.push(JSON.parse(gameStateSaveData.Data.GameState).GameType);
        saveInfo.push(JSON.parse(gameStateSaveData.Data.GameState).CrashSite);
        callback(saveInfo);
      }
    });
  }

async function loadSaveFile(){
  const gameStatePromise = new Promise((resolve, reject) => {
    fs.readFile(currentSavePath + '/GameStateSaveData.json', "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        reject();
      } else {
        gameStateSaveData = JSON.parse(data);
        resolve();
      }
    });
  });

  const playerStatePromise = new Promise((resolve, reject) => {
    fs.readFile(currentSavePath + '/PlayerStateSaveData.json', "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        reject();
      } else {
        playerStateSaveData = JSON.parse(data);
        resolve();
      }
    });
  });

  const playerInventoryPromise = new Promise((resolve, reject) => {
    fs.readFile(currentSavePath + '/PlayerInventorySaveData.json', "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        reject();
      } else {
        playerInventorySaveData = JSON.parse(data);
        resolve();
      }
    });
  });

  const saveDataPromise = new Promise((resolve, reject) => {
    fs.readFile(currentSavePath + '/SaveData.json', "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        reject();
      } else {
        saveData = JSON.parse(data);
        resolve();
      }
    });
  });

  const worldItemManagerSaveDataPromise = new Promise((resolve, reject) => {
    fs.readFile(currentSavePath + '/WorldItemManagerSaveData.json', "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        reject();
      } else {
        worldItemManagerSaveData = JSON.parse(data);
        resolve();
      }
    });
  });

  const worldObjectLocatorManagerSaveDataPromise = new Promise((resolve, reject) => {
    fs.readFile(currentSavePath + '/WorldObjectLocatorManagerSaveData.json', "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        reject();
      } else {
      worldObjectLocatorManagerSaveData = JSON.parse(data);
        resolve();
      }
    });
  });  

  await Promise.all([gameStatePromise, playerStatePromise, playerInventoryPromise, saveDataPromise, worldItemManagerSaveDataPromise, worldObjectLocatorManagerSaveDataPromise]);
}
// ---[WRITING]---

function writePlayerStateSaveData() {  
  // parse the nested JSON object first
  const playerState = JSON.parse(playerStateSaveData["Data"].PlayerState);
  
  // update CurrentHealth
  const currentHealthEntry = playerState._entries.find(entry => entry.Name === "CurrentHealth");
  currentHealthEntry.FloatValue = document.getElementById('player-health-input').value;

  // update TargetHealth
  const targetHealthEntry = playerState._entries.find(entry => entry.Name === "TargetHealth");
  targetHealthEntry.FloatValue = document.getElementById('player-health-input').value;

  // update Stamina
  const staminaEntry = playerState._entries.find(entry => entry.Name === "Stamina");
  staminaEntry.FloatValue = document.getElementById('player-energy-input').value;

  // update Rest
  const restEntry = playerState._entries.find(entry => entry.Name === "Rest");
  restEntry.FloatValue = document.getElementById('player-rest-input').value;

  // update Fullness
  const fullnessEntry = playerState._entries.find(entry => entry.Name === "Fullness");
  fullnessEntry.FloatValue = document.getElementById('player-fullness-input').value;

  // update Hydration
  const hydrationEntry = playerState._entries.find(entry => entry.Name === "Hydration");
  hydrationEntry.FloatValue = document.getElementById('player-hydration-input').value;
  
  // stringify the updated data and save it to the file
  playerStateSaveData["Data"].PlayerState = JSON.stringify(playerState);
  const data = JSON.stringify(playerStateSaveData);
  console.log(data);
  fs.writeFileSync(currentSavePath + "\\PlayerStateSaveData.json", data);
}

function writeSaveData(){
  // Set the new value for kelvinHealth
kelvinHealth = 50;

// Update the value of kelvinActor.Stats.Health in the actors array
actors.forEach(actor => {
  if (actor.TypeId === 9) {
    actor.Stats.Health = kelvinHealth;
    console.log("Found kelvins health and setting it to: " + actor.Stats.Health)
  }
});

// Write the updated data back to the JSON file
try {
  saveData.Data.VailWorldSim.Actors = JSON.stringify({ Actors: actors });
  // save the file using Node.js file system API, for example:
  // const fs = require('fs');
  console.log(saveData.Data.VailWorldSim.Actors);
  // fs.writeFileSync(currentSavePath + '\\SaveData.json', JSON.stringify(saveData));
} catch (error) {
  console.error(`Error writing JSON: ${error.message}`);
}
}

