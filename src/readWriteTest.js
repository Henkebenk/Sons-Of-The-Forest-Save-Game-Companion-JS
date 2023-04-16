const fs = require('fs');

function readFile(){
'use strict';

let rawdata = fs.readFileSync('student.json');
window.student = JSON.parse(rawdata);
console.log(student);
}

function writeFile(){
'use strict';

window.student = { 
    name: 'Mike',
    age: 23, 
    gender: 'Male',
    department: 'English',
    car: 'Honda' 
};
 
let data = JSON.stringify(student);
fs.writeFileSync('student-2.json', data);
}