import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const NotFound = "No book found"; // Change the message to "No book found"

app.get("/", (req, res) => {
    res.render("index", { data: null });
});

app.post("/search", async (req, res) => {
    const searchQuery = req.body.search;
    try {
        const result = await axios.get(`https://gutendex.com/books?search=${encodeURIComponent(searchQuery)}`);
        
        if (result.data.results.length === 0) {
            res.render("index", { data: NotFound }); // Render with "No book found" message
        } else {
            const book = result.data.results[0];  // Assuming you want the first result
            res.render("index", {
                data: {
                    title: book.title,
                    author: book.authors[0].name,
                    birth_year: book.authors[0].birth_year,
                    death_year: book.authors[0].death_year,
                    language: book.languages[0],
                    downloads: book.download_count
                }
            });
        }
    } catch (error) {
        console.log(error.response ? error.response.data : error.message);
        res.status(500).send("An error occurred while fetching the data.");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
