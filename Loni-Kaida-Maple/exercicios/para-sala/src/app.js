const express = require("express");
const cors = require("cors");
const app = express();
const studentsRoutes = require("./routes/alunaRotas");

let today = new Date();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let date = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear();
let systemTime = time + " - " + date;

let printFigure1 = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡏⠙⣄⠀⠀⣀⡀⠤⠤⠤⠤⠤⠄⢀⡀⠀⣰⠁⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠈⠳⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢱⠇⠀⠀⠘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⡔⠻⣄⣀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠃⠤⢰⠁⠳⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⡌⠀⠀⠂⢔⣸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠀⠀⠀⠀⢡⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢠⠁⠀⠀⠀⠀⠘⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣶⠶⠾⣧⠀⠈⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⠀⠀⢀⣤⣥⣤⣽⣄⣄⠀⠀⠀⠀⠀⠀⡰⢻⣿⣿⠀⠀⠸⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠘⠀⠀⢈⠀⠀⣿⣿⣏⠉⠂⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀⡀⠅⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡄⠀⠀⠀⠄⠀⢿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠈⡻⠋⢀⠐⠀⡐⠀⡟⢆⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⢄⠘⠛⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢁⡸⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡇⠀⠀⠰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠇⢠⡾⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣡⠀⠀⠘⢦⠀⠀⠀⠀⠀⠀⠠⣄⠔⠒⠚⠁⠀⠀⠀⠀⠀⡜⠒⠙⠑⢄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡰⠁⠀⠀⠐⢮⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡜⠀⠀⠀⠀⠀⡁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢰⠁⠀⠀⠀⠐⠻⡀⠙⢦⣄⡀⠀⠀⠀⠀⠀⠀⠀⣀⡴⠞⢹⠁⠀⠀⠀⠀⢴⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢇⠀⠀⠀⠀⠀⢃⠀⠀⠀⠉⠳⣶⣦⣤⣶⣶⣿⡏⠀⠀⢜⠀⠀⠀⠀⠀⠀⠱⡄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⡎⠀⠀⠀⠀⡴⠃⠀⠀⠀⠀⠀⣿⣿⣿⡿⠋⢸⠁⠀⠀⠀⠑⡀⠄⠀⠀⠀⢠⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡸⠀⠀⠀⠀⠈⢡⠀⠀⠀⠀⡀⣰⣿⠿⠋⠀⠀⠸⡇⠀⠀⠀⠘⠇⠀⠀⠀⠀⠁⢱⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠣⡀⠀⠀⢀⠴⠏⠙⠋⠻⢯⣛⠋⠁⠀⠀⠀⠀⠀⠳⢦⣄⡀⠀⠑⡄⠀⠀⠀⣠⠎⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡕⢠⠔⠁⠀⠀⠀⠀⠀⠀⠙⠳⣤⡀⠀⠀⠀⠀⠀⢀⣈⡉⡿⠾⢤⡀⠀⠀⠉⡂⠀⠀⠀⠀⠀
⠀⠀⠀⣀⡴⠋⠁⠀⠀⠀⠀⡆⠀⠀⠀⠀⠀⠈⠹⠶⠦⠔⠒⠚⠉⠉⠂⠀⠀⠀⠉⢷⡀⣴⣥⠀⠀⠀⠀⠀
⠀⣠⠞⠉⠀⠀⠀⠀⠀⠀⠂⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠀⢸⡾⡊⠣⢄⡀⠀⠀⠀
⠞⠁⠀⠀⠀⠀⢀⡔⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⡀⠸⡇⠑⠄⡀⠠⠉⠀⠀
`;

console.log("iniciando variaveis");

app.use(express.json());
console.log("iniciando express");
app.use(cors());
console.log("iniciando cors");

console.log("");
console.log('\x1b[31m%s\x1b[0m', printFigure1);

console.log('\x1b[33m%s\x1b[0m', systemTime);

app.get("/", (req, res)=>{
    res.status(200).send("Nya (OωO) 🍁🐼🍁");
})

app.use("/alunas", studentsRoutes);

module.exports=app, systemTime;