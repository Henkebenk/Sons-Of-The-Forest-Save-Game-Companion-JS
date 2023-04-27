let playerMaxHealth;
let kelvinActor;
let virginiaActor;
let actors;
let markerLayer;
let step = 1;

async function loadSaveTypeFolder(fullSaveDirPath, gameType) {
    const subdirs = await fs.promises.readdir(fullSaveDirPath + "\\" + gameType, { withFileTypes: true });
    if(subdirs){
      const savesDiv = document.getElementById('savesList');
      if(gameType === "SinglePlayer"){
        const singlePlayerSpacerDiv = document.createElement("div");
        const singlePlayerSpacer = document.createElement("p");
        singlePlayerSpacerDiv.classList="gametype-spacer";
        singlePlayerSpacer.textContent="Singleplayer";
        const singlePlayerSpacerIcon= document.createElement("img");
        singlePlayerSpacerIcon.src='./images/shared/icons/singleplayer.svg';
        singlePlayerSpacerIcon.classList="icon16";
        singlePlayerSpacerDiv.appendChild(singlePlayerSpacerIcon);
        singlePlayerSpacerDiv.appendChild(singlePlayerSpacer);
        savesDiv.appendChild(singlePlayerSpacerDiv);
      }
      else if(gameType === "Multiplayer"){
        const multiPlayerSpacerDiv = document.createElement("div");
        const multiPlayerSpacer = document.createElement("p");
        multiPlayerSpacerDiv.classList="gametype-spacer";
        multiPlayerSpacer.textContent="Multiplayer";
        const multiPlayerSpacerIcon= document.createElement("img");
        multiPlayerSpacerIcon.src='./images/shared/icons/multiplayer.svg';
        multiPlayerSpacerIcon.classList="icon16";
        multiPlayerSpacerDiv.appendChild(multiPlayerSpacerIcon);
        multiPlayerSpacerDiv.appendChild(multiPlayerSpacer);
        savesDiv.appendChild(multiPlayerSpacerDiv);
      }
    }

    for (const subdir of subdirs) {
        const saveName = subdir.name;
        let customSaveName = "";

        // TODO: Check if this fixed the issue on Main PC
        if (saveName.endsWith(".zip") || !(fullSaveDirPath + "\\" + gameType + '\\' + saveName +  '\\SaveDataThumbnail.png')) {
          continue;
        }

        // Create a div for each save
        const savesDiv = document.getElementById('savesList');
        const div = savesDiv.appendChild(document.createElement("div"));
        div.classList.add("saveButton");

        // Create a button element for the thumbnail
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("thumbnail-button");

        // Save-dependant variables
        let saveTime;
        let saveDay;
        let saveCompletion;
        let saveDifficulty;
        let saveCrashSite;

        // --Create image
        const img = div.appendChild(document.createElement("img"));
        img.src = fullSaveDirPath + "\\" + gameType + '\\' + saveName +  '\\SaveDataThumbnail.png';
        img.alt = `Thumbnail for ${subdir.name}`;
        img.style.height = "50px";
        div.appendChild(img);

        // --Create save-time span
        const saveTimeSpan = div.appendChild(document.createElement("span"));
        saveTimeSpan.classList.add("save-time");

        // --Create game-days span
        const gameDaysSpan = div.appendChild(document.createElement("span"));
        gameDaysSpan.classList.add("gameDay");

        // --Create file name span
        const filenameSpan = div.appendChild(document.createElement("span"));
        filenameSpan.textContent = '[' + saveName + ']';
        filenameSpan.classList.add("fileName");

        //Check if there is custom name for save
        fs.readdir(fullSaveDirPath + "\\" + gameType + '\\' + saveName, (err, files) => {
          if (err) {
            console.error(err);
          } else {
            const matchingFiles = files.filter(file => file.endsWith('.name'));
            if (matchingFiles.length > 0) {
              customSaveName = matchingFiles[0];
              customSaveName = customSaveName.replace("_", " ");
              customSaveName = customSaveName.replace(".name", "");

              // -- Create custom file name span
              const customNameSpan = div.appendChild(document.createElement("span"));
              customNameSpan.textContent = customSaveName + '  ';
              customNameSpan.classList.add("customFileName", "green");
            } else {
              //Do sum
            }
          }
        });


        
        readInitialSaveInfo(fullSaveDirPath + '\\' + gameType + '\\' + subdir.name, (saveDataInfo) => {
            // console.log(saveDataInfo[0]);
            if(saveDataInfo[0]){
              saveTime = saveDataInfo[0];
              saveDay = saveDataInfo[1];
              if (saveDay === undefined){
                saveDay = 0;
              }
              saveCompletion = saveDataInfo[2];
              saveDifficulty = saveDataInfo[3];
              saveCrashSite = saveDataInfo[4];
  
              saveTimeSpan.textContent = saveTime;
              gameDaysSpan.textContent = 'Day: ' + saveDay + ' - ' + saveDifficulty;
              // Onclick for the div
              div.addEventListener("click", async () => {
                currentSavePath = fullSaveDirPath + '\\' + gameType + '\\' + subdir.name;
                await loadSaveFile();
                displaySaveValues();
                document.getElementById("load-icon").title = "Load saves";
                document.getElementById("date").textContent = saveTime;
                document.getElementById("day-difficulty").textContent = 'Day: ' + saveDay + ' - ' + saveDifficulty;
                document.getElementById("spawn").textContent = saveCrashSite.charAt(0).toUpperCase() + saveCrashSite.slice(1) + " crash-site";
                window.scrollTo({
                  top: 0,
                  behavior: "smooth"
                });
                if(saveCompletion === false){
                  document.getElementById("story-complete").textContent = 'Story not completed';
                }
                else{
                  document.getElementById("story-complete").textContent = 'Story completed';
                }
                document.getElementById("saveThumb").src = fullSaveDirPath + "\\" + gameType + '\\' + saveName +  '\\SaveDataThumbnail.png';
      
                document.getElementById("savesList").style.display = "none";
                document.getElementById("saves-directory-manager").style.display = "none";
                document.getElementById("load-icon").classList = "clickable-load";
                document.getElementById("load-icon").onclick = function toggleSavesVisibility() {
                if (document.getElementById("savesList").style.display === "none") {
                    document.getElementById("savesList").style.display = "block";
                    document.getElementById("saves-directory-manager").style.display = "block";
                    document.getElementById("load-icon").title = "Close saves tab";
                } 
                else {
                    document.getElementById("savesList").style.display = "none";
                    document.getElementById("saves-directory-manager").style.display = "none";
                    document.getElementById("load-icon").title = "Load saves";
                }
                };               
              });
            }
            else{
              console.log("saveData could not be read");
            }
        });       
    }
  }

function loadAllSavesFromFolder(filePath) {
  // Use fs.readdir() to find the Steam ID folder in the selected `Saves` directory
  fs.readdir(filePath, async (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    const steamIdFolder = files.find(
      (file) =>
        fs.statSync(path.join(filePath, file)).isDirectory() && file !== "Temp"
    );

    // If steam user folder found
    if (steamIdFolder) {
      const fullSaveDirPath = path.join(filePath, steamIdFolder);
      console.log("Full file path:" + fullSaveDirPath); // Output full path to console

     await loadSaveTypeFolder(fullSaveDirPath, "SinglePlayer");
     await loadSaveTypeFolder(fullSaveDirPath, "Multiplayer");
    } 
    else {
      alert("Could not find Steam ID folder.");
    }
  });
}

function displaySaveValues(){
  playerMaxHealth = JSON.parse(playerStateSaveData["Data"].PlayerState)._entries.find((entry) => entry.Name === "MaxHealth").FloatValue;
  const playerCurrentHealth = JSON.parse(playerStateSaveData["Data"].PlayerState)._entries.find((entry) => entry.Name === "CurrentHealth").FloatValue;
  const playerTargetHealth = JSON.parse(playerStateSaveData["Data"].PlayerState)._entries.find((entry) => entry.Name === "TargetHealth").FloatValue;
  const playerEnergy = JSON.parse(playerStateSaveData["Data"].PlayerState)._entries.find((entry) => entry.Name === "Stamina").FloatValue;
  const playerRest = JSON.parse(playerStateSaveData["Data"].PlayerState)._entries.find((entry) => entry.Name === "Rest").FloatValue;
  const playerFullness = JSON.parse(playerStateSaveData["Data"].PlayerState)._entries.find((entry) => entry.Name === "Fullness").FloatValue;
  const playerHydration = JSON.parse(playerStateSaveData["Data"].PlayerState)._entries.find((entry) => entry.Name === "Hydration").FloatValue;
  const playerPosition = JSON.parse(playerStateSaveData["Data"].PlayerState)._entries.find((entry) => entry.Name === "player.position").FloatArrayValue;

  try{
    actors = (JSON.parse(saveData.Data.VailWorldSim).Actors);
  }
  catch(error){
    console.error(`Error parsing JSON: ${error.message}`);
    console.error(`The error is embedded in the JSON file.`);
  }
  

  for(let i = 0; i < actors.length; i++){
    const actor = actors[i];
    if (actor.TypeId === 9) {
      kelvinActor = actor;
    }
    else if(actor.TypeId === 10) {
      virginiaActor = actor;
    }
  }

  kelvinHealth = kelvinActor.Stats.Health;
  kelvinEnergy = kelvinActor.Stats.Energy;
  kelvinHydration = kelvinActor.Stats.Hydration;
  kelvinCourage = (100 - kelvinActor.Stats.Fear);
  kelvinAffection = kelvinActor.Stats.Affection;

  if (kelvinActor.Stats.Fear === undefined) {
    kelvinActor.Stats.Fear = 0;
    kelvinCourage = 100;
  }
  if (kelvinActor.Stats.Affection === undefined){
    kelvinActor.Stats.Affection = 0;
    kelvinAffection = 0;
  }


  virginiaHealth = virginiaActor.Stats.Health;
  virginiaEnergy = virginiaActor.Stats.Energy;
  virginiaHydration = virginiaActor.Stats.Hydration;
  virginiaCourage = (100-virginiaActor.Stats.Fear);
  virginiaAffection = virginiaActor.Stats.Affection;

  if (virginiaActor.Stats.Fear === undefined) {
    virginiaActor.Stats.Fear = 0;
    virginiaCourage = 100;
  }
  if (virginiaActor.Stats.Affection === undefined){
    virginiaActor.Stats.Affection = 0;
    virginiaAffection = 0;
  }

  displaySliders(playerCurrentHealth, playerMaxHealth, playerEnergy, playerRest, playerFullness, playerHydration);
  displayCompanionSliders('kelvin',kelvinHealth,kelvinEnergy,kelvinHydration,kelvinCourage,kelvinAffection);
  displayCompanionSliders('virginia',virginiaHealth,virginiaEnergy,virginiaHydration,virginiaCourage,virginiaAffection);
  loadInventory();
  loadMapMarkers();

  document.getElementById("player-position").textContent =
        "X: " +
        (playerPosition[0] | 0) +
        " Y: " +
        (playerPosition[1] | 0) +
        " Z: " +
        (playerPosition[2] | 0);

  document.getElementById("kelvin-position").textContent = "X: " + (kelvinActor.Position.x|0) + " Y: " + (kelvinActor.Position.y|0) + " Z: " + (kelvinActor.Position.z|0);
  document.getElementById("virginia-position").textContent = "X: " + (virginiaActor.Position.x|0) + " Y: " + (virginiaActor.Position.y|0) + " Z: " + (virginiaActor.Position.z|0);
}

function displaySliders(playerCurrentHealth, playerMaxHealth, playerEnergy, playerRest, playerFullness, playerHydration){
  document.getElementById('player-health-input').style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + playerCurrentHealth/playerMaxHealth*100 + '%,  var(--main-bg-color) ' + playerCurrentHealth/playerMaxHealth*100 + '%,  var(--main-bg-color) 100%)';
  document.getElementById('player-health-input').max = playerMaxHealth;
  document.getElementById('slider-value-player-health').textContent = (playerCurrentHealth | 0);  
  document.getElementById('player-health-input').value = (playerCurrentHealth|0);
  
  document.getElementById('player-energy-input').style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + (playerEnergy|0) + '%,  var(--main-bg-color) ' + (playerEnergy|0) + '%,  var(--main-bg-color) 100%)';
  document.getElementById('slider-value-player-energy').textContent = (playerEnergy | 0);  
  document.getElementById('player-energy-input').value = (playerEnergy|0);
  
  document.getElementById('player-rest-input').style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + (playerRest | 0) + '%,  var(--main-bg-color) ' + (playerRest | 0) + '%,  var(--main-bg-color) 100%)';
  document.getElementById('slider-value-player-rest').textContent = (playerRest | 0);  
  document.getElementById('player-rest-input').value = (playerRest|0);
  
  document.getElementById('player-fullness-input').style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + (playerFullness | 0) + '%,  var(--main-bg-color) ' + (playerFullness | 0) + '%,  var(--main-bg-color) 100%)';
  document.getElementById('slider-value-player-fullness').textContent = (playerFullness | 0);  
  document.getElementById('player-fullness-input').value = (playerFullness|0);
  
  document.getElementById('player-hydration-input').style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + (playerHydration | 0) + '%,  var(--main-bg-color) ' + (playerHydration | 0) + '%,  var(--main-bg-color) 100%)';
  document.getElementById('slider-value-player-hydration').textContent = (playerHydration | 0);  
  document.getElementById('player-hydration-input').value = (playerHydration|0);
}

function displayCompanionSliders(companionName, companionHealth, companionEnergy, companionHydration, companionCourage, companionAffection){
  if(companionName === 'virginia'){
    document.getElementById(`${companionName}-health-input`).style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + ((companionHealth|0)/1.2) + '%,  var(--main-bg-color) ' + ((companionHealth|0)/1.2) + '%,  var(--main-bg-color) 100%)';
    document.getElementById(`slider-value-${companionName}-health`).textContent = (companionHealth | 0);  
    document.getElementById(`${companionName}-health-input`).max = 120;
  }
  else{
    document.getElementById(`${companionName}-health-input`).style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + (companionHealth|0) + '%,  var(--main-bg-color) ' + (companionHealth|0) + '%,  var(--main-bg-color) 100%)';
    document.getElementById(`slider-value-${companionName}-health`).textContent = (companionHealth | 0);  
  }
  document.getElementById(`${companionName}-health-input`).value = (companionHealth|0);

  document.getElementById(`${companionName}-energy-input`).style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + (companionEnergy|0) + '%,  var(--main-bg-color) ' + (companionEnergy|0) + '%,  var(--main-bg-color) 100%)';
  document.getElementById(`slider-value-${companionName}-energy`).textContent = (companionEnergy | 0);  
  document.getElementById(`${companionName}-energy-input`).value = (companionEnergy|0);

  document.getElementById(`${companionName}-hydration-input`).style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + (companionHydration|0) + '%,  var(--main-bg-color) ' + (companionHydration|0) + '%,  var(--main-bg-color) 100%)';
  document.getElementById(`slider-value-${companionName}-hydration`).textContent = (companionHydration | 0);  
  document.getElementById(`${companionName}-hydration-input`).value = (companionHydration|0);

  document.getElementById(`${companionName}-courage-input`).style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + (companionCourage|0) + '%,  var(--main-bg-color) ' + (companionCourage|0) + '%,  var(--main-bg-color) 100%)';
  document.getElementById(`slider-value-${companionName}-courage`).textContent = (companionCourage | 0);  
  document.getElementById(`${companionName}-courage-input`).value = (companionCourage|0);

  document.getElementById(`${companionName}-affection-input`).style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + (companionAffection|0) + '%,  var(--main-bg-color) ' + (companionAffection|0) + '%,  var(--main-bg-color) 100%)';
  document.getElementById(`slider-value-${companionName}-affection`).textContent = (companionAffection | 0);  
  document.getElementById(`${companionName}-affection-input`).value = (companionAffection|0);
}

function clearInventoryCategory(category){
  category = document.getElementById(category);
  while(category.firstChild){
    category.removeChild(category.firstChild)
  }
}

function loadInventory(){

  clearInventoryCategory("weapons");
  clearInventoryCategory("attachments");
  clearInventoryCategory("ammo");
  clearInventoryCategory("throwable");
  clearInventoryCategory("tools");
  clearInventoryCategory("printed");
  clearInventoryCategory("clothing");
  clearInventoryCategory("armor");
  clearInventoryCategory("food");
  clearInventoryCategory("plants");
  clearInventoryCategory("other");

  for (i = 0; i < inventory.length; i++){
    const category = document.getElementById(inventory[i].type);
    const div = category.appendChild(document.createElement("div"));
    div.classList = "inventory-item";

    const label = div.appendChild(document.createElement("label"));
    label.classList = "inventory-item-label";
    label.textContent = inventory[i].name;

    if(inventory[i].type === "weapons" || inventory[i].type === "attachments" || inventory[i].type === "tools" || inventory[i].type === "clothing" || inventory[i].itemID === 426 || inventory[i].itemID === 428 || inventory[i].itemID === 572 || inventory[i].itemID === 435){
      label.setAttribute('for', inventory[i].itemID);
      div.appendChild(label);
      const input = document.createElement("input");
      input.type="checkbox";
      input.id=inventory[i].itemID;
      div.appendChild(input);
      category.appendChild(div);
    }
    else{
      div.appendChild(label);
      const quantityScroller = document.createElement("div");
      quantityScroller.classList = "quantity-scroller";
      const quantityValue = document.createElement("span");
      quantityValue.textContent = inventory[i].quantity;
      quantityValue.classList = "quantity-value";
      quantityScroller.appendChild(quantityValue);
      div.appendChild(quantityScroller);
      category.appendChild(div);
    }
  }

  const spacer = document.createElement("div");
  spacer.classList="inventory-spacer";
  document.getElementById("other").appendChild(spacer);

  const emptySpacer = document.createElement("div");
  const spacer2 = document.createElement("div");
  spacer2.classList="inventory-spacer";
  document.getElementById("plants").appendChild(emptySpacer);
  document.getElementById("plants").appendChild(spacer2);

  const quantityValue = document.getElementsByClassName("quantity-value");

  const divs = [];
  for (let i = 0; i < quantityValue.length; i++) {
    const div = quantityValue[i].closest(".quantity-scroller");
    divs.push({
      element: div,
      value: 0,
      listener: (event) => {
        event.preventDefault();
        if (event.deltaY < 0) {
          divs[i].value += step;
        } else {
          divs[i].value -= step;
        }
        if (divs[i].value < 0) {
          divs[i].value = 0;
        }
        quantityValue[i].textContent = divs[i].value;
      }
    });
    div.addEventListener("wheel", divs[i].listener);
  }
}

function changeStep(newStep){
  document.getElementById("increment1").classList="";
  document.getElementById("increment5").classList="";
  document.getElementById("increment10").classList="";
  document.getElementById("increment" + newStep).classList="incrementSelected";
  step = newStep;
}

function loadMapMarkers(){
  if(markerLayer){
    markerLayer.clearLayers();
  }
  const worldItemStates = JSON.parse(worldItemManagerSaveData.Data.WorldItemManager).WorldItemStates;
  const hangGliders = worldItemStates.filter(item => item.ObjectNameId.startsWith('World.HangGlider'));
  const electricUnicycles = worldItemStates.filter(item => item.ObjectNameId.startsWith('World.KnightV'));

  markerLayer = L.layerGroup().addTo(map);
  const markers = [
    //Cave to bunkers
    L.marker(xy([-478,710]),{icon: markerBunker,id: 'bunker2'}).bindPopup("<h3>Maintenance A</h3>"),
    L.marker(xy([-1133,-1038]),{icon: markerBunker,id: 'bunker3'}).bindPopup("<h3>Maintenance B</h3>"),
    L.marker(xy([1110,1007]),{icon: markerBunker,id: 'bunker4'}).bindPopup("<h3>Maintenance C</h3>"),
    L.marker(xy([1229,-650]),{icon: markerBunker,id: 'bunker5'}).bindPopup("<h3>Residential bunker</h3>"),

    // Cave entrances
    L.marker(xy([-424,1514]),{icon: markerCaveEntrance,id: 'cave1'}).bindPopup("<h3>Rebreather cave entrance</h3>"),
    L.marker(xy([-530,132]),{icon: markerCaveEntrance,id: 'cave2'}).bindPopup("<h3>Shovel cave entrance</h3>"),
    L.marker(xy([-1104,-178]),{icon: markerCaveEntrance,id: 'cave3'}).bindPopup("<h3>Rope gun cave entrance</h3>"),
    L.marker(xy([-531,-626]),{icon: markerCaveEntrance,id: 'cave4'}).bindPopup("<h3>Cultist cave entrance</h3>"),
    L.marker(xy([-1014,1028]),{icon: markerCaveEntrance,id: 'cave5'}).bindPopup("<h3>Cave - Food and Dining</h3>"),

    //Cave exits
    L.marker(xy([-252,1553]),{icon: markerCaveExit,id: 'cave1exit'}).bindPopup("<h3>Rebreather cave exit</h3>"),
    L.marker(xy([-608,87]),{icon: markerCaveExit,id: 'cave2exit'}).bindPopup("<h3>Shovel cave exit</h3>"),
    L.marker(xy([-1235,-302]),{icon: markerCaveExit,id: 'cave3exit'}).bindPopup("<h3>Rope gun cave exit</h3>"),
    L.marker(xy([-650,1113]),{icon: markerCaveExit,id: 'cave5exit'}).bindPopup("<h3>Food and dining exit</h3>"),
  ];
  
  hangGliders.forEach(data => {
    const position = [data.Position.x, data.Position.z];
    const marker = L.marker(xy(position),{icon: markerHangGlider}).bindPopup("<h3>Hang glider</h3><button onclick='alert(\"Button clicked!\")'>Teleport Player here</button><h3></h3><button onclick='alert(\"Button clicked!\")'>Teleport to player</button>");
    markers.push(marker);
  })
  
  electricUnicycles.forEach(data => {
    const position = [data.Position.x, data.Position.z];
    const marker = L.marker(xy(position),{icon: markerKnightV}).bindPopup("<h3>E.U.C Knight V</h3><button onclick='alert(\"Button clicked!\")'>Teleport Player here</button><h3></h3><button onclick='alert(\"Button clicked!\")'>Teleport to player</button>", { autoPan: false });
    marker.on('popupopen', function() {
      map.setView(marker.getLatLng(), map.getZoom());
    });
    markers.push(marker);
  })
  
  const playerPosition = JSON.parse(playerStateSaveData["Data"].PlayerState)._entries.find((entry) => entry.Name === "player.position").FloatArrayValue;
  const playerMarker = L.marker(xy(playerPosition[0],playerPosition[2]),{icon: markerPlayer}).bindPopup("<h3>Player</h3><button onclick='alert(\"Button clicked!\")'>Teleport Kelvin here</button><h3></h3><button onclick='alert(\"Button clicked!\")'>Teleport Virginia here</button>");
  markers.push(playerMarker);
  
  const kelvinMarker = L.marker(xy(kelvinActor.Position.x,kelvinActor.Position.z),{icon: markerKelvin}).bindPopup("<h3>Kelvin</h3><button onclick='alert(\"Button clicked!\")'>Teleport Player here</button><h3></h3><button onclick='alert(\"Button clicked!\")'>Teleport to player</button>");
  markers.push(kelvinMarker);
  
  const virginiaMarker = L.marker(xy(virginiaActor.Position.x,virginiaActor.Position.z),{icon: markerVirginia}).bindPopup("<h3>Virginia</h3><button onclick='alert(\"Button clicked!\")'>Teleport Player here</button><h3></h3><button onclick='alert(\"Button clicked!\")'>Teleport to player</button>");
  markers.push(virginiaMarker);
  
  //Function to adjust z-index based on lat coordinates
  function setMarkerZIndex(marker) {
    var y = marker.getLatLng().lat;
    var newZIndex = 4000-(y + 2000);
    marker.getElement().style.zIndex = newZIndex;
  }
  
  markers.forEach(marker => marker.addTo(markerLayer));
  
  markers.forEach(function(marker) {
    setMarkerZIndex(marker);
  });  
}
