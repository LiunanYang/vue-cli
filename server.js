var fs = require('fs');
var http = require('http');
var url = require("url")
var path = require("path")
var querystring = require("querystring")
var mime = {
  ".jpg":"image/jpg",
  ".jpeg":"image/jpeg",
  ".gif":"image/gif",
  ".png" : "image/png",
  ".html" : "text/html;charset=UTF-8",
  ".js":"application/x-javascript",
  ".css":"text/css"
}

var server = http.createServer((req,res)=>{
  // 得到用户读取什么
  var pathname = url.parse(req.url).pathname
  // 得到扩展名
  var extname = path.extname(pathname)
  // 如果URL不存在拓展名，此时表示这是一个文件夹，自动补全这个文件夹
  if(!extname){
    // 如果不是以/结尾，会造成浏览器识别路径层次有问题
    if(pathname.substr(-1)!="/"){
        res.writeHead(302,{"locatgion":pathname+"/"})
    }
    pathname +="/index.html"
  }
  // 读取这个文件
  fs.readFile("./dist/"+pathname,'utf-8',function(err,data){
    if(err){
      console.log(err)
      res.end("err")
      return
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
