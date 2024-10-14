const app = require('./app'); // Import the app module

const PORT = process.env.PORT || 5002; // Use environment variable or default to port 5002

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
