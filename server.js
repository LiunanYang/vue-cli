var fs = require('fs');
var http = require('http');
var url = require("url")
var path = require("path")
var querystring = require("querystring")
var mime = {
  ".jpg":"image/jpg",
  ".jpeg":"image/jpeg",
  ".gif":"image/gif",
  ".js":"application/x-javascript",
  ".css":"text/css"
}

var server = http.createServer((req,res)=>{
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

  // 得到用户读取什么
  var pathname = url.parse(req.url).pathname
  // 得到扩展名
  var extname = path.extname(pathname)

  fs.readFile('index1.html','utf-8',function(err,data){
    if(err){
      throw err ;
    }
    // 检查是否属于我已知的 mime 类型
    if(mime.hasOwnProperty(extname)){
      res.setHeader('Content-Type',mime[extname]);
    }
    res.end(data);
  })
})

server.listen(3000)
console.log("listen on post 3000..")
