const { log } = require("console");

console.log("1");
console.log('2');

const test = async()=>{
    const val = await '3';
    return val;
}
setTimeout(()=>{
    console.log(test());
})
console.log("4");