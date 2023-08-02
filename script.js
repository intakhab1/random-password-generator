const randomPasswordDisplay = document.querySelector("[generated-random-password-display]")
const sliderLength = document.querySelector("[password-length-slider]");
const passwordLengthNumber = document.querySelector("[password-length-number]") 

const passwordCopyBtn = document.querySelector("[password-copy-btn]")
const passwordCopyMessage = document.querySelector("[copied-message]")

const allCheckBoxes = document.querySelectorAll("input[type=checkbox]")
const uppercase = document.querySelector("#uppercase")
const lowercase = document.querySelector("#lowercase")
const number = document.querySelector("#number")
const symbol = document.querySelector("#symbol")

const passwordStrengthIndicator = document.querySelector("[password-strength-indicator]")
const generateButton = document.querySelector(".generateButton")

const symbols = '~`!@#$%^&*()_-+={}[]\|:;"<>,.?/';

// 1 Initially
let password = "" ;
let passwordLength = 10 ;
let tickedCheckbox = 0 ;
// setStrengthIndicator(grey = #ccc)// initially 
setStrengthIndicator("#ccc");

// 2 functions
function passwordLengthDisplay(){
    sliderLength.value = passwordLength;
    passwordLengthNumber.innerText = passwordLength; // to show change on UI

    // css part
    const min = sliderLength.min;
    const max = sliderLength.max;
    sliderLength.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"
}
function setStrengthIndicator(color){
    passwordStrengthIndicator.style.backgroundColor = color;
    passwordStrengthIndicator.style.boxShadow = `0px 0px 12px 1px ${color}` ;
}
function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min ;
}
function getRandomNumber(){
    return getRandomInteger(0, 9)
}
function getRandomLowercase(){
    return String.fromCharCode(getRandomInteger(97 , 122))
}
function getRandomUppercase(){
    return String.fromCharCode(getRandomInteger(65 , 90))
}
function getRandomSymbol(){
    const num = getRandomInteger(0 , symbols.length);
    return symbols.charAt(num);
}

// 3 Type of password stength (weak-red , normal-yellow , good-green )
function calculateStength(){
    // assuming that all checkboxes are unchecked
    let uppercaseBoxTicked = false;
    let lowercaseBoxTicked = false;
    let numberBoxTicked = false;
    let symbolBoxTicked = false;

    // Checking which box are checked 
    if(uppercase.checked == true) uppercaseBoxTicked = true;
    if(lowercase.checked  == true) lowercaseBoxTicked = true;
    if(number.checked == true) numberBoxTicked = true;
    if(symbol.checked == true) symbolBoxTicked = true;

    // Setting strength based on the checked boxes
    //1 Good
    if(uppercaseBoxTicked && lowercaseBoxTicked && numberBoxTicked && symbolBoxTicked && passwordLength>=8){
        setStrengthIndicator("#0f0")
    }
    // 2 Moderate
    else if((uppercaseBoxTicked || lowercaseBoxTicked) && (numberBoxTicked || symbolBoxTicked) && passwordLength >=6){
        setStrengthIndicator("#ff0")
    }
    // 3 Bad
    else{setStrengthIndicator("#f00")}
}

// 4 To copy the generated password to clipboard -> using -> navigator.clipboard.writeText()
async function copyPassword(){
    // navigator.clipboard.writeText -> it returns a promise which we need to wait until it is resolved
    try{
        await navigator.clipboard.writeText(randomPasswordDisplay.value)
        passwordCopyMessage.innerText = "Copied";
    }catch(e){
        passwordCopyMessage.innerText = "Failed";
    }
    // To make Copied text visible -> adding Active class and applying css property to this active class to make it visible
    passwordCopyMessage.classList.add("active")
    // After 2 sec we have to make Copied text invisible -> using setTimeOut and removing Active class after 2 sec
    setTimeout( () => {
        passwordCopyMessage.classList.remove("active")
    } , 2000)
}

// 5 Adding EventListeners 
// 1 on slider to change the length of password
sliderLength.addEventListener("input" , (e)=> {
    passwordLength = e.target.value;
    passwordLengthDisplay(); // to show change on UI
})

// 2 on copy button 
passwordCopyBtn.addEventListener("click" , ()=>{
    // if a random password is generated and displayed then only we can copy it to clipboard
    if(randomPasswordDisplay.value){
        copyPassword();
    }
})

// 3 on all checkboxes-> to keep track of how many of them are ticked
allCheckBoxes.forEach((i)=>{
    i.addEventListener("change" , checkboxChangeHandler)
})
function checkboxChangeHandler(){
    tickedCheckbox = 0; // initially -> tickedCheckbox = 0 , we need to update it
    allCheckBoxes.forEach( (i) => {
        if(i.checked){
            tickedCheckbox++;
        }
    })
    
    // edge case
    if(passwordLength < tickedCheckbox){
        passwordLength = tickedCheckbox;
        passwordLengthDisplay(); // to show change on UI
    }
}


// 4 on generate password button
generateButton.addEventListener("click" , ()=>{
    
    // Remove old generated password from randomPasswordDisplay
    password = "";

    if( tickedCheckbox <= 0 ) return;

    if(passwordLength < tickedCheckbox){
        passwordLength = tickedCheckbox;
        passwordLengthDisplay();
    }

    console.log("Generate Button Clicked");

     //if passwordLength > 4 (tickedCheckbox) 
    let randomFunctionArray = []; // randomFunction array contains functions which are ticked
    if(uppercase.checked){
        randomFunctionArray.push(getRandomUppercase);
    }
    if(lowercase.checked){
        randomFunctionArray.push(getRandomLowercase);
    }
    if(number.checked){
        randomFunctionArray.push(getRandomNumber);
    }
    if(symbol.checked){
        randomFunctionArray.push(getRandomSymbol);
    }

    // Add letters as mentioned as per ticked checkbox using randomFunction array
    for(let i = 0 ; i<randomFunctionArray.length ; i++){
        password += randomFunctionArray[i](); 
    }
    console.log("Compulsory adddition done");
    
    // Fill rest with random letters from randomFunction array
    for(let i = 0 ; i < passwordLength - randomFunctionArray.length ; i++){
        let randomIndex = getRandomInteger(0, randomFunctionArray.length);
        console.log("randIndex " + randomIndex);
        password += randomFunctionArray[randomIndex](); 
    }
    console.log("Remaining adddition done");

    // Now Shuffle the letters of generated password -> using-> Fisher Yates Method -> it can be appield on an array and shuffle it
    function shufflePassword(password){
        // Fisher Yates Method
        for (let i = password.length -1; i > 0; i--) {
            // getting random index (j)
            let j = Math.floor(Math.random() * (i+1));
            // swapping j with i
            let temp = password[i];
            password[i] = password[j];
            password[j] = temp;
          }
          let str = "";
          password.forEach((i) =>{
            str += i;
          })
          return str;
    }
    
    password = shufflePassword(Array.from(password)); // sending password as array as Fisher Yates Method requires an array
    console.log("Shuffling done");
    randomPasswordDisplay.value = password;  // show on UI
    console.log("UI adddition done");
    // Now calculate strength and display it
    calculateStength();

})












 

