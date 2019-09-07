const { Router } = require('express');
const router = Router();
const fs = require('fs');
const uuid = require('uuid/v4');

const json_books = fs.readFileSync('src/books.json', 'utf-8');
let books = JSON.parse(json_books);

router.get('/', (req, res) => {
    res.render('index.ejs', {
        books
    })
});

router.get('/new-entry', (req, res) => {
    res.render('new-entry');
});

router.post('/new-entry', (req, res) => {

    const { title, author, image, description } = req.body;
    if (!title || !author || !image || !description) {
        res.status(400).send('Entries must have a title and description');
        return;
    }
    let newBook = {
        id: uuid(),
        title,
        author,
        image,
        description
    };

    books.push(newBook);

    const json_books = JSON.stringify(books);

    fs.writeFileSync('src/books.json', json_books, 'utf-8');

    res.redirect('/');

});


router.get('/delete/:id', (req, res) => {

    books = books.filter(book => book.id != req.params.id);
    const json_books = JSON.stringify(books);
    fs.writeFileSync('src/books.json', json_books, 'utf-8');
    res.redirect('/');

});

router.get('/edit-entry/:id', (req, res) => {

    let book = books.find( book => book.id === req.params.id);

    res.render('edit-entry.ejs', {
        id: book.id,
        author : book.author,
        title : book.title,
        description : book.description,
        image : book.image
    })

});

router.post('/edit-entry', (req, res) => {

    const { id, title, author, image, description } = req.body;
    if (!title || !author || !image || !description) {
        res.status(400).send('Entries must have a title and description');
        return;
    }
    let updateBook = {
        id: uuid(),
        title,
        author,
        image,
        description
    };

    books = books.filter(book => book.id != id);
 
    books.push(updateBook);

    const json_updatebooks = JSON.stringify(books);

    fs.writeFileSync('src/books.json', json_updatebooks, 'utf-8');

    res.redirect('/');

});

module.exports = router;