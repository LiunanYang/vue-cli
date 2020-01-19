
var fs = require('fs');
var http = require('http');

var server = http.createServer((req,res)=>{
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
  fs.readFile('./dist/index.html','utf-8',function(err,data){
    if(err){
      throw err ;
    }
    res.write(data);
    res.end()
  })
})

server.listen(3000)
