function openModal() {
    document.getElementById("popupModal").style.display = "block";
}

function closeModal() {
    document.getElementById("popupModal").style.display = "none";
}

function submitForm() {
    const dropdown1 = document.getElementById("dropdown1").value;
    const dropdown2 = document.getElementById("dropdown2").value;
    const singleInput = document.getElementById("singleInput").value;
    const multiInput = document.getElementById("multiInput").value;

    alert(`Dropdown 1: ${dropdown1}\nDropdown 2: ${dropdown2}\nText: ${singleInput}\nDetails: ${multiInput}`);
    
    closeModal();
}

async function relayServersAvailableDropdownChanged(){
    console.log("relayServersAvailableDropdownChanged");
    updateNetworkRelaysAvailableTextBox();
    
}

function emptyNetworkRelaysTextBox(){
    console.log("emptyNetworkRelaysTextBox");
    console.log("delete all selections in dropdown");
    const networkRelaysAVailableTextBox = document.getElementById("networkRelaysAVailableTextBox");
    console.log("networkRelaysAVailableTextBox: ", networkRelaysAVailableTextBox);
    if(networkRelaysAVailableTextBox){
        while (networkRelaysAVailableTextBox.options.length) {
            networkRelaysAVailableTextBox.remove(0);
        }
    }
}


async function updateNetworkRelaysAvailableTextBox(){
    let Container;
    console.log("updateNetworkRelaysAvailableTextBox");
    // Locate the existing dropdown box
    const regionsDropdown = document.getElementById("dropdownRelays"); // 
    const selectedValue = regionsDropdown.value;

    let tableData = [];
    
    // get the ip addresses for this relay server
    const response = await fetch('RelayServerIps', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            param1: selectedValue,
            param2: ''
        })
    });
    
    if (!response.ok) {
        console.log(response.authToken, response.status, response.statusText);         
        document.getElementById('content').innerHTML = `<p>${response.statusText}</p>`; 
        throw new Error('Network response was not ok');

    }
    else{
        console.log("response was ok");
    }

    options = await response.text(); 
    console.log("createNetworkRelaysAvailableTextBox options: ", options);

    // ignore the first line: First ip address is the adminip and the next empty line;
    // the first ip address in the list is the adminip
    options = options.split('\n');
    console.log("2options: ", options, options.length);    
    if(options.length > 1){
        options = options[2];
        options = JSON.parse(options).slice(1);  //remove first item; it is the adminip
    }
    console.log("6options: ", options);    

    const networkRelaysAvailableContainer = document.getElementById("networkRelaysAVailableTextBox2");
    console.log("networkRelaysAvailableContainer: ", networkRelaysAvailableContainer);   
    if (networkRelaysAvailableContainer) {
        // Create a new textbox (select element)
        // Access the networkRelaysAVailableTextBox
        
        networkRelaysAVailableTextBox = document.getElementById('networkRelaysAVailableTextBox');
        networkRelaysAVailableTextBox.setAttribute("multiple", true); // or textbox.multiple = true;
        networkRelaysAVailableTextBox.setAttribute("style", "width: 275px;");
        networkRelaysAVailableTextBox.size = 10;

        console.log("networkRelaysAVailableTextBox: ", networkRelaysAVailableTextBox);   
        if (networkRelaysAVailableTextBox) {
            console.log("1 networkRelaysAVailableTextBox already exists");
            // if exists, then networkRelaysAVailableTextBox was emptied already; fill with latest option values
            /*const newOption = document.createElement("option");
            newOption.value = "new-option";
            newOption.textContent = "New Option";
            networkRelaysAVailableTextBox.appendChild(newOption);*/
            
            emptyNetworkRelaysTextBox();
            console.log("options:", options);
            options.forEach(option => {
                const opt = document.createElement('option');
                const displayed_option = document.createElement("option");
                displayed_option.innerHTML = option;    // use instead of text version to preserve spaces in html: opt.textContent = formattedOption;
                networkRelaysAVailableTextBox.appendChild(displayed_option);
            });         
    }
    else{   
        console.log("2 networkRelaysAVailableTextBox does not exist");             
        const networkRelaysAVailableTextBox = document.createElement("select");
        networkRelaysAVailableTextBox.id = "networkRelaysAVailableTextBox"; // Optional: Assign an ID to the textbox

        networkRelaysAVailableTextBox.setAttribute("multiple", true); // or textbox.multiple = true;
        networkRelaysAVailableTextBox.setAttribute("style", "width: 200px;");
        networkRelaysAVailableTextBox.size = 10;
        networkRelaysAVailableTextBox.setAttribute("background-color, red");


        // Add options to the textbox
        emptyNetworkRelaysTextBox();
        console.log("Type of options:", typeof options);
        console.log("options:", options);
        options.forEach(option => {
            const opt = document.createElement('option');
            const displayed_option = document.createElement("option");
            displayed_option.innerHTML = option;    // use instead of text version to preserve spaces in html: opt.textContent = formattedOption;
            networkRelaysAVailableTextBox.appendChild(displayed_option);
        });

        // Append the new dropdown to the blue div container
        document.getElementById('ContainerForModification').insertAdjacentHTML('beforeend',   `<p><h3>Available Bind IP address</p></h3>`);
        ContainerForModification.appendChild(networkRelaysAVailableTextBox);
        console.log("New textbox added inside the blue container");
        //document.getElementById('ContainerForModification').insertAdjacentHTML('afterend',  `<br><button onclick=AllocateRelaysToDevice() id="AllocateButton">Allocate</button>`);            

        // create an event listener
        networkRelaysAVailableTextBox.removeEventListener("change", networkRelaysAVailableDropdownChanged);
        networkRelaysAVailableTextBox.addEventListener("change", networkRelaysAVailableDropdownChanged);
        
    }


    } else {
        console.error(" container (networkRelaysAvailableContainer) not found!");
    }    
}

async function dropdownRegionsChanged(){
    console.log('dropdownRegionsChanged');

    let options;
    let dropdownRegions = document.getElementById("dropdownRegions");
    console.log("region dropdown: ", dropdownRegions.selectedValue);
    let selectedValueRegion = dropdownRegions.value;

    try {
        
        if (!dropdownRegions) {
            throw new Error("Dropdown element not found!");
        }
    
        const selectedValue = dropdownRegions.value;
        
        console.log("Dropdown selected value before fetch:", selectedValue);
    
        if (!selectedValue) {
            throw new Error("selectedValue is empty or undefined!");
        }
    
        const response = await fetch('RelayNamesOnly', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                param1: selectedValueRegion,
                param2: ''
            })
        });
    
        if (!response.ok) {
            throw new Error(`Network response was not ok, Status: ${response.status}`);
        }
    
        const data = await response.text();   
        options = data;
        console.log("Response from API:", data);
    
    } catch (error) {
        console.error("Fetch error:", error);
    }
    
    try {
        // Parse the JSON output from the scatr_relays_db and use as options in dropdown
        // Populate the dropdown
        options = JSON.parse(options);
        relayServersAvailableDropdown = document.getElementById("dropdownRelays");
        const opt = document.createElement('option');
        opt.value = "select a relay server";
        opt.textContent = "-- Select a relay server --";
        relayServersAvailableDropdown.appendChild(opt);

        options.forEach(option => {
            //console.log("option = ", option)
            const formattedOption = `${option}`; 
            
            const opt = document.createElement('option');
            opt.value = formattedOption;
            //console.log("opt.value:", opt.value);

            const displayed_option = document.createElement("option");
            displayed_option.innerHTML = formattedOption;    // use instead of text version to preserve spaces in html: opt.textContent = formattedOption;
            relayServersAvailableDropdown.appendChild(displayed_option);
        });  

        relayServersAvailableDropdown.addEventListener("change", relayServersAvailableDropdownChanged);
        
        console.log("dropdownRegions:", dropdownRegions, "selected: ", selectedValueRegion);
        dropdownRegions.value = selectedValueRegion;

    } catch (error) {
        console.error('Error fetching data:', error);        
    }            
}

function setupEventListeners(){
    console.log("setupEventListeners");
    //modalOverlay = document.getElementById('modal-overlay');
    dropdownRegions = document.getElementById('dropdownRegions');
    console.log("dropdownRegions:", dropdownRegions);
    if(dropdownRegions != null){        
        dropdownRegions.removeEventListener('change', dropdownRegionsChanged);
        dropdownRegions.addEventListener('change', dropdownRegionsChanged);
        
        console.log("listeners: ", dropdownRegions.eventListenerList);
    }
    else{
        console.log("dropdownRegions not found");
    }
}

window.setupEventListeners = setupEventListeners;