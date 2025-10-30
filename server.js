const express = require('express'); 
const app = express(); 
 
app.get('/', (req, res) =
  res.send(` 
<!DOCTYPE html> 
<html><head><title>Attendance Tracker</title></head> 
<body style="font-family:Arial;margin:40px"> 
  <h1>Attendance Tracker</h1> 
  <input id="name" placeholder="Enter name"> 
  <button onclick="mark()">Mark</button> 
  <ul id="list"></ul> 
  <script> 
    let list = []; 
    function mark() { 
      const name = document.getElementById('name').value.trim(); 
      if (name) { 
        list.push(name); 
        document.getElementById('list').innerHTML += '<li>' + name + '</li>'; 
        document.getElementById('name').value = ''; 
      } 
    } 
  </script> 
</body></html> 
  `); 
}); 
 
app.listen(PORT, () = running on port ' + PORT)); 
