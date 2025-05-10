const app = require('./app');
const PORT = 5000;


// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Game-Zilla Backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
