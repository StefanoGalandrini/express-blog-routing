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
	<p style="margin-bottom:2rem";><a href="/">TORNA ALLA HOME</a></p>
	<p style="margin-bottom:2rem";><a href="/posts/create">CREA UN NUOVO POST</a></p>
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


// routes definition
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function show(req, res)
{
	// find post by id if exists
	const post = findOrFail(req, res);

	//return post in json format
	if (!post)
	{
		return;
	}

	return res.json(post);
}


// routes definition
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function create(req, res)
{
	res.format({
		'text/html': function ()
		{
			res.send(`
				<h1 style="margin-bottom: 2rem;"> Creazione nuovo post</h1>
				<p style="margin-bottom: 2rem;"><a href="/posts">BACK TO POSTS LIST</a></p>
			`);
		},
		'default': function ()
		{
			// rispondi con 406
			res.status(406).send('Not Acceptable');
		}
	});

}





function findOrFail(req, res)
{
	// find slug from request
	const slug = req.params.slug;

	// find post by slug if exists
	const post = posts.find((post) => post.slug === slug);

	// If post is not found, return 404
	if (!post)
	{
		res.status(404).send(`Post con slug ${slug} non trovato`);
		return;
	}

	return post;
}


module.exports = {
	index,
	show,
	create,
};
