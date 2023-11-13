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

	// read HTML
	const postTemplate = fs.readFileSync(path.join(__dirname, "../html", "postsTemplate.html"), "utf-8");
	const indexContainer = fs.readFileSync(path.join(__dirname, "../html", "indexContainer.html"), "utf-8");

	const postItemsHtml = posts.map(post =>
	{
		let postHtml = postTemplate.replace("|titolo|", post.title)
			.replace("|contenuto|", post.content)
			.replace("|immagine|", post.image)
			.replace("|tags|", post.tags.join(", "));
		return postHtml;
	}).join("");

	const finalHTML = indexContainer.replace("|post_items|", postItemsHtml);

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
	// find post by slug if exists
	const post = findOrFail(req, res);

	//return post in json format
	if (!post)
	{
		return;
	}

	// add image_url property to post
	const port = process.env.PORT || 3000;
	const imageUrl = "http://localhost:" + port + "/imgs/posts/" + post.image;

	// add link for download image
	const imageDownloadUrl = `http://localhost:${port}/posts/${post.slug}/download`;

	// add keys to json
	const postWithImageUrl = {
		...post,
		image_url: imageUrl,
		image_download_url: imageDownloadUrl,
	};


	// send json with image_url property
	return res.json(postWithImageUrl);

	// return res.json(post);
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


// routes definition
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function download(req, res)
{
	const slug = decodeURIComponent(req.params.slug);
	const post = posts.find(p => p.slug === slug);

	if (!post)
	{
		return res.status(404).send(`Post con slug "${slug}" non trovato`);
	}

	const filePath = path.join(__dirname, '../public/imgs/posts', post.image);
	res.download(filePath);
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
	download,
};
