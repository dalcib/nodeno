require("./deno");
console.log(Deno.version);
var x = Deno.readDirSync("./rt");
console.log(x);
