var http = require("http");

http.createServer(function(request, response) {
  console.log("Requested");
  response.writeHead(200, { "Content-Type": "text/json" });
  
  var exampleObject = {
      item1: "test",
      item2: "test2"
  }
  var exampleObject2 = {
    item1: "test3",
    item2: "test4"
}
  var exampleArray = [exampleObject, exampleObject2];
  
  var json = JSON.stringify({
      object1: exampleObject,
      object2: exampleObject2,
      array: exampleArray
  })
  response.end(json);
}).listen(3000);

console.log("runs on 3000");
