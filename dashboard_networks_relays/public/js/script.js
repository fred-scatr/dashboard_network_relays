let arrayNetworkDivs = [];
let arrayRelayDivs = [];
create_networks_table();


document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("theme-toggle");
    const body = document.body;
    console.log("add event listener");


    // Check stored preference
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
    }

    // Toggle function
    toggleButton.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        console.log("button clicked");
        console.log("body.classList:", body.classList);

        // Save the preference
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            document.body.classList.remove("dark-mode");
            void document.body.offsetWidth; // ✅ Forces repaint
            document.body.classList.add("dark-mode");

        } else {
            localStorage.setItem("theme", "light");
        }

        console.log("dark mode?" , document.body.classList.contains('dark-mode'));
    });
});

(function() {
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(eventType, listener, options) {
        if (!this.eventListenerList) {
            this.eventListenerList = {};
        }
        if (!this.eventListenerList[eventType]) {
            this.eventListenerList[eventType] = [];
        }
        this.eventListenerList[eventType].push(listener);
        //console.log(`Event '${eventType}' added to`, this);
        
        // Call the original addEventListener
        originalAddEventListener.call(this, eventType, listener, options);
    };
})();

function removeAllCustomNameButtonListeners(){        // remove the listeners from the Buttons in the network divs when one has been selected
    const allDivs = document.querySelectorAll('div');
    const theDivs = Array.from(allDivs).map(div => div);
    const divIds = Array.from(allDivs).map(div => div.id); // get array of all divs
    console.log(divIds);

    for(let i=0;i<theDivs.length;i++){
        if(theDivs[i].id.includes('arrayNetworkDivs')){  // only get divs that are network Divs
            const theButton = theDivs[i].querySelectorAll(':scope > button');
            //console.log("theButton", theButton[0], theButton.length);
            if(theButton.length > 0){
                //console.log("Removing from:", theButton);
                theButton[0].removeEventListener("dblclick", handleCustomNameButtonClick);
            }
        }
    }
}

function addAllCustomNameButtonListeners(){  // after Custom Name selected and updated, add all Custom Name button listeners back
    const allDivs = document.querySelectorAll('div');
    const theDivs = Array.from(allDivs).map(div => div);
    const divIds = Array.from(allDivs).map(div => div.id); // get array of all divs
    console.log(divIds);

    for(let i=0;i<theDivs.length;i++){
        if(theDivs[i].id.includes('arrayNetworkDivs')){  // only get divs that are network Divs
            const theButton = theDivs[i].querySelectorAll(':scope > button');
            //console.log("theButton", theButton[0], theButton.length);
            if(theButton.length > 0){
                //console.log("Removing from:", theButton);
                theButton[0].addEventListener("dblclick", handleCustomNameButtonClick);
            }
        }
    }
}

const handleCustomNameButtonClick = (event) => {
    console.log("handleNetworkActionButtonClick");
    customNameButtonClicked(event.target.id, event);
};

function customNameButtonClicked (buttonInfo, event){

    // remove button and replace with a Custom name input box
    console.log("customNameButtonClicked", "button clicked: ", buttonInfo);
    button = document.getElementById(buttonInfo);

    // get index of button so we can get the index of the network div (customNameText15 is format)
    index = buttonInfo.split('Text')[1];
    
    // get the div that this button is located in by the id of the button;     
    networkDiv = document.getElementById(arrayNetworkDivs[index].id);
    //networkDiv.style.setProperty("background-color",  "#38C7FF");

    console.log("index:", index, "event:", event, "networkDiv:", arrayNetworkDivs[index].id);
    // remove the button, to be replaced by an div tag and input box
    theButtonToRemove = networkDiv.querySelectorAll(':scope > button');
    console.log("theButtonToRemove", theButtonToRemove);
    theButtonToRemove[0].remove();

    containerInputBox = document.createElement("div");
    containerInputBox.id = "containerInputBox";
    containerInputBox.classList.add("container_custom_name");
    networkDiv.insertAdjacentElement("beforeend" , containerInputBox);

    inputBox = document.createElement("input");
    inputBox.id = "inputBox" + index;
    inputBox.classList.add("custom_name_input_box");
    inputBox.type = "text";
    console.log("networkDiv:", networkDiv);
    containerInputBox.insertAdjacentElement("beforeend", inputBox);


    removeAllCustomNameButtonListeners();    // remove all button listeners until this button custom name change is complete.

    //if(hasFocus){
        inputBox.addEventListener('keydown', (event) => {
            // Check if the pressed key is Enter
            if (event.key === 'Enter') {
                // Get the value of the input box
                const inputValue = event.target.value;
                console.log('Input value:', inputValue);  
                const hasFocus = inputBox === document.activeElement;
                if(inputValue != '' ){
                    // remove the container for the input box and replace with the new button and Custom Name 
                    event.target.value = '';
                    let customNameButton = document.createElement("button");
                    customNameButton.id = "customNameText" + index;
                    customNameButton.classList.add("custom_name");
                    customNameButton.textContent = inputValue;
                    customNameButton.enabled = true;
                    customNameButton.addEventListener("dblclick", handleCustomNameButtonClick);
                    console.log("customNameText: ", customNameButton, customNameButton.id);
                    networkDiv.insertAdjacentElement("beforeend", customNameButton);
                    const childElements = arrayNetworkDivs[index].children;
                    console.log(childElements);
                    
                    containerInputBox.remove();

                }else{
                    event.target.value = '';
                    let customNameButton = document.createElement("button");
                    customNameButton.id = "customNameText" + index;
                    customNameButton.classList.add("custom_name");
                    customNameButton.textContent = "Custom Name";
                    customNameButton.enabled = true;
                    customNameButton.addEventListener("dblclick", handleCustomNameButtonClick);
                    console.log("customNameText: ", customNameButton, customNameButton.id);
                    networkDiv.insertAdjacentElement("beforeend", customNameButton);
                    const childElements = arrayNetworkDivs[index].children;
                    console.log(childElements);
                    
                    containerInputBox.remove();
                }

            }
            addAllCustomNameButtonListeners();
        });
}

const handleNetworkActionButtonClick = (event) => {
    console.log("handleNetworkActionButtonClick", event.target.id, event);
    networkManageRelaysButtonClicked(event.target.id, event);
};

const handleManageRelaysButtonClicked = (event) => {
    console.log("handleManageRelaysButtonClicked");

    console.log(event);
    index = event.target.id.split('actionButton')[1];  // data is in the network array divs; get index, then get the div of interest
    parentDiv = arrayNetworkDivs[index];
    let network_name = parentDiv.querySelector(".network_name").textContent;
    console.log(network_name);
    networkManageRelaysButtonClicked(network_name, event); 

};

async function deleteRelay(networkName, relayName, index, bind_ips, label){
    // use relay name and index to verify the correct relay is removed

    try{        
        const response = await fetch('deleteRelayIndex', {   // get info and relays for this networkName
            method: 'POST', // Setting the method to POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                param1: networkName,
                param2: index,
                param3: bind_ips,
                param4: label  
            })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        else{
            const data = await response.text();    
            //console.log("netwk info:", data);
            jsonData =  JSON.parse(data);
            console.log("netwk info jsonData", jsonData);

            
            if(jsonData){ 
                let rFrames = document.querySelectorAll(".relay_frame"); // Get all divs with class "r_frame"
                let indexToRemove = index; // Change this to the desired index
                
                if (indexToRemove >= 0 && indexToRemove < rFrames.length) {
                    let targetDiv = rFrames[indexToRemove]; // Select the div to remove
                    targetDiv.parentNode.removeChild(targetDiv); // Remove it from its parent
                } else {
                    console.log("Invalid index: No such element found.");
                }                   

            }   
        }
    }
    catch(error){

    }

}

const handleRelayTrashButtonClick = (networkName, event) => {
    console.log(`handleRelayTrashButtonClick ${networkName}, ev:${event}, ${event.target.id}`);
    const container = document.getElementById("content");

    const observer = new MutationObserver(() => {
    let rFrames = container.querySelectorAll(".relay_frame");

    if (rFrames.length >= expectedCount) {
        observer.disconnect(); // Stop observing once all elements exist

        let parentDiv = rFrames[index];
        console.log(`parentDiv:`, parentDiv);
    } else {
        console.log(`Waiting for all .r_frame elements... Found ${rFrames.length}`);
    }
    });

    try{
        index = event.target.id.split("svg_trash_can_button")[1];

        //console.log([...document.querySelectorAll("*")].map(e => e.className));

        let parentDiv = container.querySelectorAll(".relay_frame")[index];
        console.log(`parentDiv:${parentDiv}`);
        // there may be more than one bind ip; read innerHTML to preserve formatting ad substitute 
        let bindIpTextWithBreaks = parentDiv.querySelector(".bind_ips").innerHTML;
        bind_ips = bindIpTextWithBreaks.replace(/<br\s*\/?>/gi, "\n"); // Replace <br> with newline
        console.log("A bind_ips: ", bind_ips);
        
        relayName = parentDiv.querySelector(".relay_full_server_name").textContent;        
        label = parentDiv.querySelector(".custom_relay_name").textContent; 
        console.log(`remove relay ${relayName}, index:${index}, bind_ips:${bind_ips}, label:${label}`);

        deleteRelay(networkName, relayName, index, bind_ips, label);
    }
    catch(error){
        console.error('Error in handleRelayTrashButtonClick:', error);
    }
};

async function networkManageRelaysButtonClicked(networkName, event){
    console.log("networkManageRelaysButtonClicked");

    try{
        //networkDiv.style.setProperty("background-color",  "#38C7FF");
        const response = await fetch('NetworkInfo', {   // get info and relays for this networkName
            method: 'POST', // Setting the method to POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                param1: networkName    
            })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        else{
            const data = await response.text();    
            //console.log("netwk info:", data);
            jsonData =  JSON.parse(data);
            console.log("netwk info jsonData", jsonData);

            await renderRelaysTable(networkName, jsonData);
        }        

    }
    catch(error){
        console.log("Error in networkActionButtonClicked", error);
    }


}

function renderNetworksTable(networks){
    // create array of divs, each one a separate network

    try{
        for(let i=0;i<networks.length;i++){    
            arrayNetworkDivs[i] = document.createElement("div");
            arrayNetworkDivs[i].id = 'arrayNetworkDivs[' + i + ']';
            arrayNetworkDivs[i].classList.add("network_frame");

            svg_element = `<svg class="svg_lucide_network" width="16" height="16"  viewBox="0 0 16 16">
            <g fill="None" clip-path="url(#clip0_6_109)">
                    <path  d="M3.33337 10.6663V8.66634C3.33337 8.48953 3.40361 8.31996 3.52864 8.19494C3.65366 8.06991 3.82323 7.99967 4.00004 7.99967H12C12.1769 7.99967 12.3464 8.06991 12.4714 8.19494C12.5965 8.31996 12.6667 8.48953 12.6667 8.66634V10.6663M8.00004 7.99967V5.33301M11.3334 10.6663H14C14.3682 10.6663 14.6667 10.9648 14.6667 11.333V13.9997C14.6667 14.3679 14.3682 14.6663 14 14.6663H11.3334C10.9652 14.6663 10.6667 14.3679 10.6667 13.9997V11.333C10.6667 10.9648 10.9652 10.6663 11.3334 10.6663ZM2.00004 10.6663H4.66671C5.0349 10.6663 5.33337 10.9648 5.33337 11.333V13.9997C5.33337 14.3679 5.0349 14.6663 4.66671 14.6663H2.00004C1.63185 14.6663 1.33337 14.3679 1.33337 13.9997V11.333C1.33337 10.9648 1.63185 10.6663 2.00004 10.6663ZM6.66671 1.33301H9.33337C9.70156 1.33301 10 1.63148 10 1.99967V4.66634C10 5.03453 9.70156 5.33301 9.33337 5.33301H6.66671C6.29852 5.33301 6.00004 5.03453 6.00004 4.66634V1.99967C6.00004 1.63148 6.29852 1.33301 6.66671 1.33301Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_6_109">
                    <rect width="16" height="16"  fill="None"  />
                    </clipPath>
                </defs>
                </svg>`;

            const container = document.getElementById('content');   
                        
            console.log("arrayNetworkDivs[i]", arrayNetworkDivs[i]);         
            container.insertAdjacentElement("beforeend", arrayNetworkDivs[i]);

            console.log("arrayNetworkDivs[i].id:", arrayNetworkDivs[i].id);
            arrayNetworkDivs[i].insertAdjacentHTML("beforeend", svg_element);
            
            console.log("networks[i], ", networks[i]['network']);
            /*arrayNetworkDivs[i].insertAdjacentHTML("beforeend", `&nbsp&nbsp${networks[i]['network']}`);*/

            /*console.log("networks[i], ", networks[i]['network'], `<span class="network_name">` + networks[i]['network'] + `</span>`);*/
            arrayNetworkDivs[i].insertAdjacentHTML("beforeend", `<span class="network_name">${networks[i]['network']}</span>`); 

            // insert button for Custom Name
            let customNameButton = document.createElement("button");
            customNameButton.id = "customNameText" + i;
            customNameButton.classList.add("custom_name");
            customNameButton.textContent = "Custom Name";
            customNameButton.enabled = true;
            
            console.log("customNameText: ", customNameButton, customNameButton.id);
            arrayNetworkDivs[i].insertAdjacentElement("beforeend", customNameButton);
            
            console.log("Adding to:", customNameButton);
            const childElements = arrayNetworkDivs[i].children;
            console.log(childElements);

            customNameButton.addEventListener("dblclick", handleCustomNameButtonClick);

            // last modified date
            lastModifiedDate = "Monday Nov 25 23:41:36 2024";
            arrayNetworkDivs[i].insertAdjacentHTML("beforeend", `<span class="last_modified_date">${lastModifiedDate}</span>`); 

            serverVersion = "2024.9.6.0";
            arrayNetworkDivs[i].insertAdjacentHTML("beforeend", `<span class="server_version">${serverVersion}</span>`); 

            networkStatus = "Up";
            arrayNetworkDivs[i].insertAdjacentHTML("beforeend", `<span class="network_status">${networkStatus}</span>`); 

            //arrayNetworkDivs[i].insertAdjacentHTML("beforeend", `<span class="custom_name">Custom Name</span>`); 
            /*containerCustomName = document.createElement("div");
            containerCustomName.id = "containerCustomName";
            containerCustomName.classList.add("container_custom_name"); */
            /*console.log("networks[i], ", networks[i]['network'], `<span class="network_name">` + networks[i]['network'] + `</span>`);*/
            //arrayNetworkDivs[i].insertAdjacentElement("beforeend", containerCustomName); 

            // insert button for Actions
            let manageRelaysButton = document.createElement("button");
            manageRelaysButton.id = "actionButton" + i;
            manageRelaysButton.classList.add("network_actions_button");
            manageRelaysButton.textContent = "Manage Relays";
            manageRelaysButton.enabled = true;     
            arrayNetworkDivs[i].insertAdjacentElement("beforeend", manageRelaysButton); 

            manageRelaysButton.addEventListener("dblclick", handleManageRelaysButtonClicked);

            //console.log("added Custom Name");

            let rect = `<div class="rectangle_line"></div>`;
            arrayNetworkDivs[i].insertAdjacentHTML("afterend",rect); 
        }
    }
    catch(error){
        console.log("Error in renderTable: ", error);
    }
}

async function create_networks_table(){
    console.log("create_networks_table");
    var jsonData;
    // get current values for relays for the network selected
    try {
        const response = await fetch('networks', {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();  // Handle response as plain text
        console.log("updated_item data");

        // Parse the JSON output from the scatr_relays_db and use as options in dropdown
        const networks = JSON.parse(data);
        console.log('fetch Options:', networks);

        renderNetworksTable(networks);

    } catch (error) {
        console.error('Error fetching data:', error);
        alert(`"Failed to fetch data " ${error}`);

    }
}

function renderRelaysTable(networkName, networkInfo){
    const container = document.getElementById('content');  
    container.innerHTML = '';  // insert row header here

    try{
    // create array of divs, each one a separate relay
        let relays = [];
        /*for(let i=0;i<networkInfo.length;i++){
            relays.push(networkInfo[i]);
        }
        console.log("relays", relays);*/
        
        let addRelayButton = document.createElement("button");
        addRelayButton.id = "addRelayButton";
        addRelayButton.classList.add("add_relay_button");
        addRelayButton.textContent = "Add Relay";
        addRelayButton.enabled = true;    
        
        container.insertAdjacentElement("beforebegin", addRelayButton); 
        container.insertAdjacentHTML("beforeend", `<br><br><br><br>`);
        addRelayButton.addEventListener("dblclick",  () => addRelayButtonClicked()); 
        
        let arrayRelayDivs = [];
        let the_trash_can =[];
        for(let i=0;i<networkInfo.length;i++){    
            arrayRelayDivs[i] = document.createElement("div");
            arrayRelayDivs[i].id = 'arrayRelayDivs[' + i + ']';
            arrayRelayDivs[i].classList.add("relay_frame");

            svg_relay_element = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="lucide/server">
                <path id="Vector" d="M4 4.00065H4.00666M4 12.0007H4.00666M2.66666 1.33398H13.3333C14.0697 1.33398 14.6667 1.93094 14.6667 2.66732V5.33398C14.6667 6.07036 14.0697 6.66732 13.3333 6.66732H2.66666C1.93028 6.66732 1.33333 6.07036 1.33333 5.33398V2.66732C1.33333 1.93094 1.93028 1.33398 2.66666 1.33398ZM2.66666 9.33398H13.3333C14.0697 9.33398 14.6667 9.93094 14.6667 10.6673V13.334C14.6667 14.0704 14.0697 14.6673 13.3333 14.6673H2.66666C1.93028 14.6673 1.33333 14.0704 1.33333 13.334V10.6673C1.33333 9.93094 1.93028 9.33398 2.66666 9.33398Z" stroke="#D3D3D3" stroke-width="0.666667" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            </svg>`;              
            
            container.insertAdjacentElement('beforeend',arrayRelayDivs[i]);

            arrayRelayDivs[i].insertAdjacentHTML('beforeend', svg_relay_element);
            
            console.log("name:", networkInfo[i]['full-server-name']);
            arrayRelayDivs[i].insertAdjacentHTML("beforeend", `<span class="relay_full_server_name">${networkInfo[i]['full-server-name']}</span>`); 
            arrayRelayDivs[i].insertAdjacentHTML("beforeend", `<span class="custom_relay_name">Custom Name</span>`); 

            // bind ips list
            keys = Object.keys(networkInfo[i]['bind']);

            str_bind_ips = ''
            if(keys.length == 1)
                str_bind_ips = str_bind_ips + `${networkInfo[i]['bind'][keys[0]]}`;
            else{
                for(let k=0; k<keys.length; k++){
                    console.log(`push ${keys[k]},  ${networkInfo[i]['bind'][keys[k]]}`);
                    str_bind_ips = str_bind_ips + `${networkInfo[i]['bind'][keys[k]]}<br>`;
                    }
            }
            console.log(`str_bind_ips: ${str_bind_ips}`);
            arrayRelayDivs[i].insertAdjacentHTML("beforeend", `<span class=bind_ips>${str_bind_ips}</span>`); 
            
            arrayRelayDivs[i].insertAdjacentHTML("beforeend", `<span class="admin_ip">${networkInfo[i]['adminip']}</span>`);           
            arrayRelayDivs[i].insertAdjacentHTML("beforeend", `<span class="admin_port">${networkInfo[i]['adminport']}</span>`); 
            arrayRelayDivs[i].insertAdjacentHTML("beforeend", `<span class="in_use">In Use</span>`);                
            
            button_id = "svg_trash_can_button" + i;
            //let the_trash_can = `<button class="svg_trash_can_button" id=${button_id} >
            the_trash_can = `<svg id=${button_id} class="svg_trash_can" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="lucide/trash-2">
                <path id="Vector" d="M2 4.00065H14M12.6667 4.00065V13.334C12.6667 14.0007 12 14.6673 11.3333 14.6673H4.66667C4 14.6673 3.33333 14.0007 3.33333 13.334V4.00065M5.33333 4.00065V2.66732C5.33333 2.00065 6 1.33398 6.66667 1.33398H9.33333C10 1.33398 10.6667 2.00065 10.6667 2.66732V4.00065M6.66667 7.33398V11.334M9.33333 7.33398V11.334" stroke="#D3D3D3" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                </svg>`
            //</button>` 

            arrayRelayDivs[i].insertAdjacentHTML("beforeend", the_trash_can);      
            /*document.getElementById('svg_trash_can').addEventListener('click', () => {
                alert('Icon clicked!');
            });*/
            console.log("button_id:", button_id);
            document.getElementById(button_id).addEventListener("dblclick", (event) => handleRelayTrashButtonClick(networkName, event));            

            arrayRelayDivs[i].insertAdjacentHTML("afterend",`<div class="relays_rectangle_line"></div>`);             

            //actionsButton.addEventListener("dblclick", handleAddRelayButtonClick);

        }
    }
    catch(error){
        console.log("Error in renderRelaysTable", error);
    }
}

async function addRelayButtonClicked(){
    console.log("addRelayButtonClicked");
    // bring up popup
    displayRelayPopup();
}

async function displayRelayPopup(){
    console.log("displayRelayPopup");
    container = document.getElementById('content')
    container.innerHTML = `<div id="modal-container"></div>`

    fetch('relay_modal.html') // Load the modal from an external file
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); // Extract the HTML content as a string
    })
    .then(html => {
        //console.log("Fetched HTML Content:", html);  // Log the fetched HTML to verify

        // Insert the modal HTML into the DOM
        let container = document.createElement("div");
        container.innerHTML = html;
        document.body.appendChild(container);

        // Ensure the modal is visible after the HTML is inserted
        let modal = document.getElementById("modal-overlay");
        if (modal) {
            modal.style.display = "block";  // Make the modal visible
            console.log("✅ Modal is now visible!");

            // Now, load modal.js and call the setupEventListeners function
            let script = document.createElement("script");
            script.src = "/js/modal.js";  // Path to the modal.js script
            script.onload = () => {
                console.log("modal.js loaded and executed!");
                // After modal.js is loaded, call setupEventListeners
                if (typeof setupEventListeners === 'function') {
                    setupEventListeners();  // Call the function to setup listeners
                } else {
                    console.error("❌ setupEventListeners function is not available.");
                }
            };
            document.body.appendChild(script);
        } else {
            console.error("❌ Modal element not found after insertion!");
        }
    })
    .catch(error => console.error("❌ Error fetching modal.html:", error));

        

}

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

    relayDropdown = document.getElementById('dropdown1');
    console.log("relayDropdow:",relayDropdown );

    alert(`Dropdown 1: ${dropdown1}\nDropdown 2: ${dropdown2}\nText: ${singleInput}\nDetails: ${multiInput}`);
    
    closeModal();
}
