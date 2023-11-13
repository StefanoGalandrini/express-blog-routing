//import modules

const express = require('express');
const fs = require("fs");
const path = require("path");
const posts = require("../db/db");

// routes definition
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function index(req, res)
{

	// read HTML template
	const postTemplate = fs.readFileSync(path.join(__dirname, "../html", "./index.html"), "utf-8");

	// generate HTML
	const html = posts.map(post =>
	{
		let postHTML = postTemplate.replace("|titolo|", post.title);
		postHTML = postHTML.replace("|contenuto|", post.content);
		postHTML = postHTML.replace("|immagine|", post.image);
		postHTML = postHTML.replace("|tags|", post.tags.join(", "));

		return postHTML;
	}).join("");

	const finalHTML = `
	<p style="margin-bottom:2rem;" ;><a href="/">TORNA ALLA HOME</a></p>
	<h1>LISTA DEI POST</h1>
${html}
	`;

	// send HTML
	res.format({
		html: () =>
		{
			res.type("html").send(finalHTML);
		},
		default: () =>
		{
			res.status(406).send("Not Acceptable");
		},
	});
}

module.exports = {
	index,
};
