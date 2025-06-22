const http = require("http")
const url = require("url")
const fs = require("fs");
const replaceTemp = require("./modules/replaceTemp")

const cardTemp = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const homeTemp = fs.readFileSync(`${__dirname}/templates/template-home.html`, "utf-8");
const blogTemp = fs.readFileSync(`${__dirname}/templates/template-blog.html`, "utf-8");
const blogsData = JSON.parse(fs.readFileSync(`${__dirname}/data/data.json`, "utf-8"));


http.createServer((req, res) => {
	const {pathname, query} = url.parse(req.url, true)
	if (req.method === "GET") {
		if (pathname === "/" || pathname === "/home") {
			res.writeHead(200, {'content-type':'text/html'});
			let htmlCard =blogsData.map((blog) => replaceTemp(blog, cardTemp)).join("");
			let output = homeTemp.replace(/{%BLOG-CARDS%}/g, htmlCard);
			res.end(output);
		} else if (pathname === "/blog") {
			res.writeHead(200, {'content-type':'text/html'});
			let blog = blogsData[query.id];
			console.log(blog)
			let output = replaceTemp(blog, blogTemp);
			res.end(output)
		} else {
			res.writeHead(404, {"content-type" : "text/plain"});
			res.end("Page not found");
		}
	}
	else {
		res.writeHead(405, {"content-type" : "text/plain"});
		res.end("Method not allowed");
	}

}).listen(3000, () => {
	console.log("Listening on port 8080");
})
