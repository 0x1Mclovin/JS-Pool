module.exports = (data, tempCards) => {
	let output = tempCards.replace(/{%BLOG-TITLE%}/g, data.title)
	output = output.replace(/{%BLOG-TEXT%}/g, data.excerpt);
	output = output.replace(/{%BLOG-LINK%}/g, data.id)
	output = output.replace(/{%BLOG-IMG%}/g, data.image)
	output = output.replace(/{%BLOG-AUTHOR%}/g, data.author)
	output = output.replace(/{%PUBLISH-DATE%}/g, data.publish_date)
	output = output.replace(/{%BLOG-CONTENT%}/g, data.content)
	return output;
}


