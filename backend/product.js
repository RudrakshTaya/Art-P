const mongoose = require('mongoose');
const connectDB = require('./src/database/db'); // Ensure this is the correct path to your DB connection file
const Products = require('./src/Models/product.Models'); // Ensure this path is correct for your product model

// Array of sample products
const allProducts = [
    {
        name: 'Sample Product 1',
        description: 'This is a sample product',
        price: 99.99,
        rating: 4.5,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-A',
            subtype2:'subtype-B',
        }
    },
    {
        name: 'Sample Product 1',
        description: 'This is a sample product',
        price: 99.99,
        rating: 4.5,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-A',
        }
    },
    {
        name: 'Sample Product 1',
        description: 'This is a sample product',
        price: 99.99,
        rating: 4.5,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-A',
        }
    },
    {
        name: 'Sample Product 1',
        description: 'This is a sample product',
        price: 99.99,
        rating: 4.5,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-A',
        }
    },
    {
        name: 'Sample Product 1',
        description: 'This is a sample product',
        price: 99.99,
        rating: 4.5,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-A',
        }
    },
    {
        name: 'Sample Product 1',
        description: 'This is a sample product',
        price: 99.99,
        rating: 4.5,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-A',
        }
    },
    {
        name: 'Sample Product 1',
        description: 'This is a sample product',
        price: 99.99,
        rating: 4.5,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-A',
        }
    },
    {
        name: 'Sample Product 1',
        description: 'This is a sample product',
        price: 99.99,
        rating: 4.5,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-A',
        }
    },
    {
        name: 'Sample Product 1',
        description: 'This is a sample product',
        price: 99.99,
        rating: 4.5,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-A',
        }
    },
    {
        name: 'Sample Product 1',
        description: 'This is a sample product',
        price: 99.99,
        rating: 4.5,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-A',
        }
    },
    {
        name: 'Sample Product 1',
        description: 'This is a sample product',
        price: 99.99,
        rating: 4.5,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-A',
        }
    },
    
    {
        name: 'Sample Product 2',
        description: 'This is a sample product',
        price: 199.99,
        rating: 4.8,
       imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-B',
        }
    },
    {
        name: 'Sample Product 3',
        description: 'This is a sample product',
        price: 299.99,
        rating: 4.7,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-3',
        attributes: {
            subtype1: 'subtype-C',
        }
    },
    {
        name: 'Sample Product 4',
        description: 'This is a sample product',
        price: 149.99,
        rating: 4.6,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-D',
        }
    },
    {
        name: 'Sample Product 2',
        description: 'This is a sample product',
        price: 199.99,
        rating: 4.8,
       imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-B',
        }
    },
    {
        name: 'Sample Product 3',
        description: 'This is a sample product',
        price: 299.99,
        rating: 4.7,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-3',
        attributes: {
            subtype1: 'subtype-C',
        }
    },
    {
        name: 'Sample Product 4',
        description: 'This is a sample product',
        price: 149.99,
        rating: 4.6,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-D',
        }
    },
    {
        name: 'Sample Product 2',
        description: 'This is a sample product',
        price: 199.99,
        rating: 4.8,
       imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-B',
        }
    },
    {
        name: 'Sample Product 3',
        description: 'This is a sample product',
        price: 299.99,
        rating: 4.7,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-3',
        attributes: {
            subtype1: 'subtype-C',
        }
    },
    {
        name: 'Sample Product 4',
        description: 'This is a sample product',
        price: 149.99,
        rating: 4.6,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-D',
        }
    },
    {
        name: 'Sample Product 2',
        description: 'This is a sample product',
        price: 199.99,
        rating: 4.8,
       imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-B',
        }
    },
    {
        name: 'Sample Product 3',
        description: 'This is a sample product',
        price: 299.99,
        rating: 4.7,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-3',
        attributes: {
            subtype1: 'subtype-C',
        }
    },
    {
        name: 'Sample Product 4',
        description: 'This is a sample product',
        price: 149.99,
        rating: 4.6,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-D',
        }
    },
    {
        name: 'Sample Product 2',
        description: 'This is a sample product',
        price: 199.99,
        rating: 4.8,
       imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-B',
        }
    },
    {
        name: 'Sample Product 3',
        description: 'This is a sample product',
        price: 299.99,
        rating: 4.7,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-3',
        attributes: {
            subtype1: 'subtype-C',
        }
    },
    {
        name: 'Sample Product 4',
        description: 'This is a sample product',
        price: 149.99,
        rating: 4.6,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-D',
        }
    },
    {
        name: 'Sample Product 2',
        description: 'This is a sample product',
        price: 199.99,
        rating: 4.8,
       imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-B',
        }
    },
    {
        name: 'Sample Product 3',
        description: 'This is a sample product',
        price: 299.99,
        rating: 4.7,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-3',
        attributes: {
            subtype1: 'subtype-C',
        }
    },
    {
        name: 'Sample Product 4',
        description: 'This is a sample product',
        price: 149.99,
        rating: 4.6,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-D',
        }
    },
    {
        name: 'Sample Product 2',
        description: 'This is a sample product',
        price: 199.99,
        rating: 4.8,
       imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-B',
        }
    },
    {
        name: 'Sample Product 3',
        description: 'This is a sample product',
        price: 299.99,
        rating: 4.7,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-3',
        attributes: {
            subtype1: 'subtype-C',
        }
    },
    {
        name: 'Sample Product 4',
        description: 'This is a sample product',
        price: 149.99,
        rating: 4.6,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-D',
        }
    },
    {
        name: 'Sample Product 2',
        description: 'This is a sample product',
        price: 199.99,
        rating: 4.8,
       imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-B',
        }
    },
    {
        name: 'Sample Product 3',
        description: 'This is a sample product',
        price: 299.99,
        rating: 4.7,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-3',
        attributes: {
            subtype1: 'subtype-C',
        }
    },
    {
        name: 'Sample Product 4',
        description: 'This is a sample product',
        price: 149.99,
        rating: 4.6,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-D',
        }
    },
    {
        name: 'Sample Product 2',
        description: 'This is a sample product',
        price: 199.99,
        rating: 4.8,
       imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-B',
        }
    },
    {
        name: 'Sample Product 3',
        description: 'This is a sample product',
        price: 299.99,
        rating: 4.7,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-3',
        attributes: {
            subtype1: 'subtype-C',
        }
    },
    {
        name: 'Sample Product 4',
        description: 'This is a sample product',
        price: 149.99,
        rating: 4.6,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-D',
        }
    },
    {
        name: 'Sample Product 2',
        description: 'This is a sample product',
        price: 199.99,
        rating: 4.8,
       imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-B',
        }
    },
    {
        name: 'Sample Product 3',
        description: 'This is a sample product',
        price: 299.99,
        rating: 4.7,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-3',
        attributes: {
            subtype1: 'subtype-C',
        }
    },
    {
        name: 'Sample Product 4',
        description: 'This is a sample product',
        price: 149.99,
        rating: 4.6,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-D',
        }
    },
    {
        name: 'Sample Product 5',
        description: 'This is a sample product',
        price: 399.99,
        rating: 4.9,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-E',
        }
    },
    {
        name: 'Sample Product 6',
        description: 'This is a sample product',
        price: 499.99,
        rating: 4.3,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-3',
        attributes: {
            subtype1: 'subtype-F',
        }
    },
    {
        name: 'Sample Product 7',
        description: 'This is a sample product',
        price: 250.00,
        rating: 4.5,
       imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-2',
        attributes: {
            subtype1: 'subtype-G',
        }
    },
    {
        name: 'Sample Product 8',
        description: 'This is a sample product',
        price: 189.99,
        rating: 4.2,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-H',
        }
    },
    {
        name: 'Sample Product 9',
        description: 'This is a sample product',
        price: 120.00,
        rating: 4.7,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-I',
        }
    },
    {
        name: 'Sample Product 10',
        description: 'This is a sample product',
        price: 90.00,
        rating: 4.1,
        imageLink: 'https://th.bing.com/th/id/OIG2.9O4YqGf98tiYzjKDvg7L',
        type: 'Type-1',
        attributes: {
            subtype1: 'subtype-J',
        }
    },
];


// Function to seed the database
const seedDB = async () => {
  await connectDB(); // Connect to MongoDB
  await Products.deleteMany({}); // Clear existing products
  await Products.insertMany(allProducts); // Insert the sample products
  console.log('Products added');
  mongoose.connection.close(); // Close the connection after seeding
};

// Call the seed function
seedDB();
