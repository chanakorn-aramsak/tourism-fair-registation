const express = require('express');
const bodyParser = require('body-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();

// CSV Writer Setup
const csvWriter = createCsvWriter({
    path: 'registrations.csv',
    header: [
        { id: 'companyName', title: 'COMPANY' },
        { id: 'boothSize', title: 'BOOTH_SIZE' },
        { id: 'table', title: 'TABLE' },
        { id: 'numberOfChairs', title: 'NO_OF_CHAIRS' },
        { id: 'contactName', title: 'CONTACT_NAME' },
        { id: 'contactNumber', title: 'CONTACT_NUMBER' }
    ],
    append: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('src'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});
app.get('/registration.html', (req, res) => {
    res.sendFile(__dirname + '/src/registration.html');
});

app.post('/save-csv', (req, res) => {
    const data = {
        companyName: req.body.companyName,
        boothSize: req.body.boothSize,
        table: req.body.table ? 'Yes' : 'No',
        numberOfChairs: req.body.numberOfChairs,
        contactName: req.body.contactName,
        contactNumber: req.body.contactNumber
    };

    csvWriter.writeRecords([data])
        .then(() => {
            console.log('Record written to CSV.');
            res.send('Thank you for registering!'); // Send a response back to the client
        })
        .catch((err) => {
            console.error('Error writing to CSV:', err);
            res.status(500).send('Error processing your form');
        });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
