// ---[SAVE DIRECTORY BUTTON]---
const selectDirBtn = document.getElementById("select-dir-btn");
selectDirBtn.addEventListener("click", () => {
    const dialog = document.createElement("input");
    dialog.type = "file";
    dialog.accept = "application/json"; // Set accepted file types
    dialog.webkitdirectory = true; // Allow selection of directories
    dialog.addEventListener("change", () => {
      const selectedFilePath = dialog.files[0].path;
      const selectedFolderPath = path.dirname(selectedFilePath);
      const savesFolderPath = path.join(selectedFolderPath, "Saves");
      if (fs.existsSync(savesFolderPath)) {
        console.log(savesFolderPath);
        // saveDirInput.value = savesFolderPath;
        pDirectory.textContent = savesFolderPath;
        loadAllSavesFromFolder(savesFolderPath);
      } else {
        alert(
          'Please select the folder that contains "Saves". (Most likely SonsOfTheForest)'
        );
      }
    });
    dialog.click();
  });

  // ---[SAVE NAME TOGGLE]---
  function toggleSaveNames(){
    const checkBox = document.getElementById("toggleSaveNames");
    const fileNames = document.getElementsByClassName("fileName");
    if(checkBox.checked){
      for(let i = 0; i < fileNames.length; i++){
        fileNames[i].style.display = "block";
      }
    } else {
      for(let i = 0; i < fileNames.length; i++){
        fileNames[i].style.display = "none";
      }
    }
  }
  

  // ---[THEME TOGGLE]---
  function toggleTheme() {
    var element = document.body;
    element.classList.toggle("lightMode");

    var themeToggle = document.getElementById("themeToggle");
    if (themeToggle.src.includes("lightMode.png")) {
        themeToggle.src = "./images/shared/darkMode.png";
    } 
    else {
        themeToggle.src = "./images/shared/lightMode.png";
    }
  } 

  // ---[SAVES TOGGLE]---
  function toggleSavesVisibility(){
    if (document.getElementById("savesList").style.display === "none") {
      document.getElementById("savesList").style.display = "block";
      document.getElementById("saves-directory-manager").style.display = "block";
    } else {
      document.getElementById("savesList").style.display = "none";
      document.getElementById("saves-directory-manager").style.display = "none";
    }
} 

// ---[PLAYER STATS]---
function switchTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  if (tabName === "Inventory"){
    document.getElementById(tabName).style.display = "block";
  }
  else{
    document.getElementById(tabName).style.display = "block";
  } 
  evt.currentTarget.className += " active";
}

const sliderHealth = document.getElementById("player-health-input");
const sliderHealthValue = document.getElementById("slider-value-player-health");
const sliderEnergy = document.getElementById("player-energy-input");
const sliderEnergyValue = document.getElementById("slider-value-player-energy");
const sliderRest = document.getElementById("player-rest-input");
const sliderRestValue = document.getElementById("slider-value-player-rest");
const sliderFullness = document.getElementById("player-fullness-input");
const sliderFullnessValue = document.getElementById("slider-value-player-fullness");
const sliderHydration = document.getElementById("player-hydration-input");
const sliderHydrationValue = document.getElementById("slider-value-player-hydration");


sliderHealth.addEventListener("input", (event) => {
    sliderHealthValue.textContent = event.target.value;
});

sliderEnergy.addEventListener("input", (event) => {
    sliderEnergyValue.textContent = event.target.value;
});

sliderRest.addEventListener("input", (event) => {
    sliderRestValue.textContent = event.target.value;
});

sliderFullness.addEventListener("input", (event) => {
    sliderFullnessValue.textContent = event.target.value;
});

sliderHydration.addEventListener("input", (event) => {
    sliderHydrationValue.textContent = event.target.value;
});

sliderHealth.oninput = function() {
    var value = (this.value-this.min)/(this.max-this.min)*100
    this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
    this.style.background
 };

sliderEnergy.oninput = function() {
    var value = (this.value-this.min)/(this.max-this.min)*100
    this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
    this.style.background
 };

 sliderRest.oninput = function() {
    var value = (this.value-this.min)/(this.max-this.min)*100
    this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
    this.style.background
 };

 sliderFullness.oninput = function() {
    var value = (this.value-this.min)/(this.max-this.min)*100
    this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
    this.style.background
 };

 sliderHydration.oninput = function() {
    var value = (this.value-this.min)/(this.max-this.min)*100
    this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
    this.style.background
 };

 function playerFillStats(){
  displaySliders(playerMaxHealth, playerMaxHealth, 100, 100, 100, 100);
 }

// ---[KELVIN STATS]---
const sliderKelvinHealth = document.getElementById("kelvin-health-input");
const sliderKelvinHealthValue = document.getElementById("slider-value-kelvin-health");
const sliderKelvinEnergy = document.getElementById("kelvin-energy-input");
const sliderKelvinEnergyValue = document.getElementById("slider-value-kelvin-energy");
const sliderKelvinHydration = document.getElementById("kelvin-hydration-input");
const sliderKelvinHydrationValue = document.getElementById("slider-value-kelvin-hydration");
const sliderKelvinCourage = document.getElementById("kelvin-courage-input");
const sliderKelvinCourageValue = document.getElementById("slider-value-kelvin-courage");
const sliderKelvinAffection = document.getElementById("kelvin-affection-input");
const sliderKelvinAffectionValue = document.getElementById("slider-value-kelvin-affection");

sliderKelvinHealth.addEventListener("input", (event) => {
  sliderKelvinHealthValue.textContent = event.target.value;
});

sliderKelvinEnergy.addEventListener("input", (event) => {
  sliderKelvinEnergyValue.textContent = event.target.value;
});

sliderKelvinHydration.addEventListener("input", (event) => {
  sliderKelvinHydrationValue.textContent = event.target.value;
});

sliderKelvinCourage.addEventListener("input", (event) => {
  sliderKelvinCourageValue.textContent = event.target.value;
});

sliderKelvinAffection.addEventListener("input", (event) => {
  sliderKelvinAffectionValue.textContent = event.target.value;
});

sliderKelvinHealth.oninput = function() {
  var value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
  this.style.background
};

sliderKelvinEnergy.oninput = function() {
  var value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
  this.style.background
};

sliderKelvinHydration.oninput = function() {
  var value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
  this.style.background
};

sliderKelvinCourage.oninput = function() {
  var value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
  this.style.background
};

sliderKelvinAffection.oninput = function() {
  var value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
  this.style.background
};

function kelvinFillStats(){
  displayCompanionSliders("kelvin",100,100,100,100,100);
 }

// ---[VIRGINIA STATS]---
const sliderVirginiaHealth = document.getElementById("virginia-health-input");
const sliderVirginiaHealthValue = document.getElementById("slider-value-virginia-health");
const sliderVirginiaEnergy = document.getElementById("virginia-energy-input");
const sliderVirginiaEnergyValue = document.getElementById("slider-value-virginia-energy");
const sliderVirginiaHydration = document.getElementById("virginia-hydration-input");
const sliderVirginiaHydrationValue = document.getElementById("slider-value-virginia-hydration");
const sliderVirginiaCourage = document.getElementById("virginia-courage-input");
const sliderVirginiaCourageValue = document.getElementById("slider-value-virginia-courage");
const sliderVirginiaAffection = document.getElementById("virginia-affection-input");
const sliderVirginiaAffectionValue = document.getElementById("slider-value-virginia-affection");

sliderVirginiaHealth.addEventListener("input", (event) => {
  sliderVirginiaHealthValue.textContent = event.target.value;
});

sliderVirginiaEnergy.addEventListener("input", (event) => {
  sliderVirginiaEnergyValue.textContent = event.target.value;
});

sliderVirginiaHydration.addEventListener("input", (event) => {
  sliderVirginiaHydrationValue.textContent = event.target.value;
});

sliderVirginiaCourage.addEventListener("input", (event) => {
  sliderVirginiaCourageValue.textContent = event.target.value;
});

sliderVirginiaAffection.addEventListener("input", (event) => {
  sliderVirginiaAffectionValue.textContent = event.target.value;
});

sliderVirginiaHealth.oninput = function() {
  var value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
  this.style.background
};

sliderVirginiaEnergy.oninput = function() {
  var value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
  this.style.background
};

sliderVirginiaHydration.oninput = function() {
  var value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
  this.style.background
};

sliderVirginiaCourage.oninput = function() {
  var value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
  this.style.background
};

sliderVirginiaAffection.oninput = function() {
  var value = (this.value-this.min)/(this.max-this.min)*100
  this.style.background = 'linear-gradient(to right, var(--font-color2) 0%, var(--font-color2) ' + value + '%,  var(--main-bg-color) ' + value + '%,  var(--main-bg-color) 100%)'
  this.style.background
};

 function virginiaFillStats(){
  displayCompanionSliders("virginia",120,100,100,100,100);
 }




//  INVENTORY TAB
function openInventoryTab(evt, tabCategory) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("inventory-tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("inventory-tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the link that opened the tab
  document.getElementById(tabCategory).style.display = "grid";
  evt.currentTarget.className += " active";
}






