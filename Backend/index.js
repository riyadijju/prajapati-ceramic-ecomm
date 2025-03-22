const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = process.env.PORT || 5000;

//admin
// YY1QsdPcPSMa29Tb

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://admin:YY1QsdPcPSMa29Tb@prajapati-ceramic.jnkgn.mongodb.net/?retryWrites=true&w=majority&appName=prajapati-ceramic');
}

app.get('/', (req, res) => {
  res.send('Prajapati Ceramic')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
