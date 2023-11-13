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
	const postTemplate = fs.readFileSync(path.join(__dirname, "../html", "./posts-template.html"), "utf-8");

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

	/*
<p style="margin-bottom:2rem;";><a href="/">TORNA ALLA HOME</a></p>
<h1>LISTA DEI POST</h1>
<ul>
	${posts.map(post => `
							<li>
									<h2>${post.titolo}</h2>
									<img style="width: 250px;" src="img/${post.immagine}" alt="${post.titolo}">
									<p>${post.contenuto}</p>
									<p>Tags: ${post.tags.join(", ")}</p>
							</li>
					`).join('')}
</ul>
	`;
*/


	res.format({
		html: () =>
		{
			res.type("html").send(finalHTML);
		},
		json: () =>
		{
			res.json(posts);
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
