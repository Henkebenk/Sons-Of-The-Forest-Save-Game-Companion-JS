'use strict';

const fs2 = require('fs2');

let student = { 
    name: 'Mike',
    age: 23, 
    gender: 'Male',
    department: 'English',
    car: 'Honda' 
};
 
let data = JSON.stringify(student);
fs2.writeFileSync('student-2.json', data);