const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const { log } = require('console');
const { fileURLToPath } = require('url');
const app = express();
const fs = require('fs').promises;
WIREGUARD_MS_HOST = '10.0.0.253';

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

const port = 3100;
app.use(express.json());

app.get('/', (req, res) => {
    console.log("dirname = ", __dirname)
    console.log("get first page")
    const filePath = path.join(__dirname, 'public', 'dashboard1.html');
    console.log("Serving file:", filePath);  // Log file path
    res.sendFile(filePath);
});

app.get('/networks',  async (req, res) => {  // get list of networks on MS
    const mysql = require('mysql2/promise');
    // Create connection
    const connection = await mysql.createConnection({
        host: WIREGUARD_MS_HOST,
        user: 'scatr',
        password: 'stun1234',
        database: 'SCATR'
    });

    // Query the database; get list of networks
    const query = 'SELECT network FROM networks';
    var rows;
    try {
        const [networksQueryResult] = await connection.execute(query);
        rows = networksQueryResult;
        console.log(rows);
        } catch (error) {
        console.error('Error executing query:', error);
        } finally {
        await connection.end(); // Ensure the connection is closed
    }
    
    console.log('Query results:', rows[0]);
    res.send(rows);
});
   

app.post('/NetworkInfo', async(req, res) => {  // get relays for this networkName
    var networkName = req.body.param1;
    console.log("networkName: ", networkName);
    // Create connection
    const mysql = require('mysql2');
    try{
        const connection = mysql.createConnection({
            host: WIREGUARD_MS_HOST,
            user: 'scatr',
            password: 'stun1234',
            database: 'SCATR'
            }); 
        
            // Query the database
        connection.query(`SELECT *  FROM networks WHERE network="${networkName}"`, (err, results) => {
        if (err) {
            console.error('Error:', err.message);
            res.send('');
        } else {
            console.log('Results:', results);
            if(typeof(results) == 'object'){
                if(results.length > 0 && 
                    results[0]['configuration'] != null){
                        const relays = results[0]['configuration']['relays'];
                        console.log(relays);
                        res.send(relays);
                }
                else{
                    res.send("Error");
                }
            }
            else{
                res.send("Error");

            }
        }
        connection.end();
        });    
    } catch (err) {
        console.error('NetworkInfo:', err.message);
        res.send("Error;", err);
      }

});  





app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'css')));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);     
});