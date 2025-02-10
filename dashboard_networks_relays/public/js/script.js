
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
            create_networks_table();

        } else {
            localStorage.setItem("theme", "light");
        }

        console.log("dark mode?" , document.body.classList.contains('dark-mode'));
    });
});

function renderTable(networks){
    // create array of divs, each one a separate network
    let arrayNetworkDivs = [];
    try{
        for(let i=0;i<networks.length;i++){    
            arrayNetworkDivs[i] = document.createElement("div");
            arrayNetworkDivs[i].id = 'arrayNetworkDivs[' + i + ']';
            arrayNetworkDivs[i].classList.add("network_frame");

            svg_element = `<svg class="svg_lucide_network" width="16" height="16"  viewBox="0 0 16 16">
            <g clip-path="url(#clip0_6_109)">
                    <path  d="M3.33337 10.6663V8.66634C3.33337 8.48953 3.40361 8.31996 3.52864 8.19494C3.65366 8.06991 3.82323 7.99967 4.00004 7.99967H12C12.1769 7.99967 12.3464 8.06991 12.4714 8.19494C12.5965 8.31996 12.6667 8.48953 12.6667 8.66634V10.6663M8.00004 7.99967V5.33301M11.3334 10.6663H14C14.3682 10.6663 14.6667 10.9648 14.6667 11.333V13.9997C14.6667 14.3679 14.3682 14.6663 14 14.6663H11.3334C10.9652 14.6663 10.6667 14.3679 10.6667 13.9997V11.333C10.6667 10.9648 10.9652 10.6663 11.3334 10.6663ZM2.00004 10.6663H4.66671C5.0349 10.6663 5.33337 10.9648 5.33337 11.333V13.9997C5.33337 14.3679 5.0349 14.6663 4.66671 14.6663H2.00004C1.63185 14.6663 1.33337 14.3679 1.33337 13.9997V11.333C1.33337 10.9648 1.63185 10.6663 2.00004 10.6663ZM6.66671 1.33301H9.33337C9.70156 1.33301 10 1.63148 10 1.99967V4.66634C10 5.03453 9.70156 5.33301 9.33337 5.33301H6.66671C6.29852 5.33301 6.00004 5.03453 6.00004 4.66634V1.99967C6.00004 1.63148 6.29852 1.33301 6.66671 1.33301Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_6_109">
                    <rect width="16" height="16"  fill="currentColor"  />
                    </clipPath>
                </defs>
                </svg>`;

            const container = document.getElementById('content');   
            console.log("arrayNetworkDivs[i]", arrayNetworkDivs[i]);         
            container.insertAdjacentElement("beforeend", arrayNetworkDivs[i]);

            console.log("arrayNetworkDivs[i].id:", arrayNetworkDivs[i].id);
            //const section = document.querySelector(arrayNetworkDivs[0]);
            //console.log("section:". section);
            const svg_container = document.getElementById(arrayNetworkDivs[i].id);  
            console.log("svg_container", svg_container);
            svg_container.insertAdjacentHTML("beforeend", svg_element);
            
            console.log("networks[i], ", networks[i]['network']);
            /*svg_container.insertAdjacentHTML("beforeend", `&nbsp&nbsp${networks[i]['network']}`);*/

            /*console.log("networks[i], ", networks[i]['network'], `<span class="network_name">` + networks[i]['network'] + `</span>`);*/
            svg_container.insertAdjacentHTML("beforeend", `<span class="network_name">${networks[i]['network']}</span>`); 

            rect = `<div class="rectangle_line"></div>`
            svg_container.insertAdjacentHTML("afterend",rect);
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
        renderTable(networks);

        } catch (error) {
            console.error('Error fetching data:', error);
            alert(`"Failed to fetch data " ${error}`);

        }
}