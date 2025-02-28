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

function sendCmdToSystem(cmd, callback) {  // callback instead of async
    exec(cmd, { timeout: 4000 },(error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return callback(`Error: ${error.message}`);
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return callback(`Stderr: ${stderr}`);
        }
        callback(stdout);
    });
}

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
   

app.post('/NetworkInfo', async(req, res) => {  // get info and relays for this networkName
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

app.post('/RelayServerIps',  (req, res) => {
    postDataParam1 = req.body.param1; // This will be an object with the keys and values sent by the client

    console.log('Received POST data:',  req.body);  // has the region in it

    strval = `python3 /home/ubuntu/scatr_relay_db/scatr_relays_db.py query name ${postDataParam1}`;
    console.log('strval: ', strval);  

    sendCmdToSystem(strval, (output) => {
        const fixedOptions = output.replace(/'/g, '"');
        console.log("retrieved data", fixedOptions);
        res.send(`${fixedOptions}`);
    });

});

app.post('/RelayNamesOnly',  (req, res) => {
    postDataParam1 = req.body.param1; // This will be an object with the keys and values sent by the client

    console.log('Received POST data:',  req.body);  // has the region in it

    strval = `python3 /home/ubuntu/scatr_relay_db/scatr_relays_db.py query name ${postDataParam1}`;
    console.log('strval: ', strval);  

    sendCmdToSystem(strval, (output) => {
        console.log("retrieved data", output);
        let formattedOutput = [];
        output = output.split('\n');
        len = output.length;
        for(let i=0;i<len;i++){
            formattedOutput.push(output[i].split(':')[0].trim());
        }
        formattedOutput = formattedOutput[0].replace(/'/g, '"');
        console.log("formattedOutput:", formattedOutput);
        res.send(`${formattedOutput}`);
    });

});

app.post('/deleteRelayIndex', async (req, res) => {  // use networkName and list of relays to allocate by writing to SQL DB
    // find the index of the network relay and delete it, given the network name and the label
    const mysql = require('mysql2/promise');
    networkName = req.body.param1;
    index = req.body.param2;  // this is the row in the table; corresponds to array index in DB
    ipAddresses = req.body.param3;
    label = req.body.param4;

    try{
        const connection = await mysql.createConnection({
            host: WIREGUARD_MS_HOST,
            user: 'scatr',
            password: 'stun1234',
            database: 'SCATR'
        });

        // Query the database; get list of existing relays for this network
        var relays;
        const query = 'SELECT JSON_EXTRACT(configuration, "$.relays") AS relays FROM networks WHERE network = ?';
        //const [rows] = await connection.execute('SELECT JSON_EXTRACT(configuration, "$.relays") AS relays FROM networks WHERE network = ?');
        var rows;
        try {
            const [rowsQueryResult] = await connection.execute(query, [networkName]);
            rows = rowsQueryResult;
            //kconsole.log(rows);
        } catch (error) {
            console.error('Error executing query:', error);
        } finally {
            await connection.end(); // Ensure the connection is closed
        }
        
        console.log('Query results:', rows[0]);

        // verify index from the webpage is correct before deletion in the SQL DB
        // verify the label; NB: labels may not be unique across the network
        let dbDataBindIps = [];
        if(rows[0]['relays'][index]){
            dbIndexData = rows[0]['relays'][index];
            keys = Object.keys(rows[0]['relays'][index]['bind']);
            for(let i=0; i<keys.length; i++){
                dbDataBindIps.push(rows[0]['relays'][index]['bind'][keys[i]]);
            }

            console.log('dbData', dbIndexData, dbDataBindIps);
        }

        tableDataIps = ipAddresses.trim().split('\n');
        tableDataIps = tableDataIps.sort();
        console.log(tableDataIps);

        dbDataBindIps = dbDataBindIps.sort();
        result = dbDataBindIps.every((value, index) => value === tableDataIps[index]);
        
        if(!result){
            console.log("Error! list of IPs to delete not found in SQL db relay list");

        }
        else{
            console.log("result of compare is true");
            // verify that the SQL DB has the index matching the row to be deleted
            const connection = await mysql.createConnection({
                host: WIREGUARD_MS_HOST,
                user: 'scatr',
                password: 'stun1234',
                database: 'SCATR'
            });
            const query = 'SELECT JSON_LENGTH(configuration, "$.relays") AS relay_count FROM networks WHERE network = ?';
            //const [rows] = await connection.execute('SELECT JSON_EXTRACT(configuration, "$.relays") AS relays FROM networks WHERE network = ?');
            var rows;
            try{
            const [rowsQueryResult] = await connection.execute(query, [networkName]);
            rows = rowsQueryResult;            
            //kconsole.log(rows);
            } catch (error) {
            console.error('Error executing query:', query, error);
            } finally {
            await connection.end(); // Ensure the connection is closed

                            
            if (Number.isInteger(index) || index < 0) throw new Error("Invalid index");
            console.log("index: ", index, typeof(index));
            // verify the index is found in the DB
            if(index <= rows[0].relay_count ){
                   
                const connection = await mysql.createConnection({
                    host: WIREGUARD_MS_HOST,
                    user: 'scatr',
                    password: 'stun1234',
                    database: 'SCATR'
                });
                const query = `UPDATE networks SET configuration = JSON_REMOVE(configuration, "$.relays[${index}]") WHERE  network = ?`;
                //const [rows] = await connection.execute('SELECT JSON_EXTRACT(configuration, "$.relays") AS relays FROM networks WHERE network = ?');
                var rows;
                try {
                    const [rowsQueryResult] = await connection.execute(query, [networkName]);
                    rows = rowsQueryResult;
                    //kconsole.log(rows);
                } catch (error) {
                    console.error('Error executing query:', error);
                    throw new Error("Unable to remove array element from SQL DB");
                } finally {
                    await connection.end(); // Ensure the connection is closed
                }
            }


            res.send(result);
        
            }
        }

    }
    
    catch(error){
        console.error('Error fetching data:', error);
    }

});


app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'css')));

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);     
});