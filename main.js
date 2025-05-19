const http = require('http')
const fs = require('fs')
const url = require('url')

const tempCards = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const productsData = JSON.parse(fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8'))

const replaceTemplate = (product, tempCards) => {
	let output = tempCards.replace(/{%PRODUCT_NAME%}/g, product.productName);
	output = output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
	output = output.replace(/{%PRODUCT_QUANTITY%}/g, product.quantity);
	output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
	output = output.replace(/{%PRODUCT_ID%}/g, product.id);
	output = output.replace(/{%PRODUCT_COUNTRY%}/g, product.from);
	output = output.replace(/{%PRODUCT_NUTRIENTSCT%}/g, product.nutrients);
	output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
	if (!product.organic)  output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic")
	// console.log(output);
	return output;
}

http.createServer((req, res) => {
	const {query, pathname} = url.parse(req.url, true);
	if (pathname === "/" || pathname === "/overview") {
		res.writeHead(200, {'content-type':'text/html'});
		const newHtmlCard = productsData.map(product => replaceTemplate(product, tempCards)).join("");
		let output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, newHtmlCard);
		res.end(output)
	} else if (pathname == "/product") {
		const product = productsData[query.id];
		let output = replaceTemplate(product, tempProduct)
		res.end(output)
	}
}).listen(8080, ()=>{
	console.log("Listenning on port 8080");
})
