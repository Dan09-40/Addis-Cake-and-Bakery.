import { Cake } from '../models/Cake';
import { User } from '../models/User';
import { Order } from '../models/Order';
import bcrypt from 'bcryptjs';

export const seedCakes = async () => {
  try {
    // Clear existing cakes
    await Cake.deleteMany({});

    // Sample cakes
    const sampleCakes = [
      {
        name: "Chocolate Fudge Cake",
        description: "Rich chocolate cake with smooth fudge frosting",
        price: 29.99,
        image: "/images/chocolate-fudge.jpg",
        category: "birthday",
        ingredients: ["chocolate", "flour", "sugar", "eggs", "butter"],
        weight: 1.5,
        available: true
      },
      {
        name: "Vanilla Dream Cake",
        description: "Classic vanilla cake with buttercream frosting",
        price: 25.99,
        image: "/images/vanilla-dream.jpg",
        category: "wedding",
        ingredients: ["vanilla", "flour", "sugar", "eggs", "butter"],
        weight: 1.5,
        available: true
      },
      {
        name: "Red Velvet Elegance",
        description: "Luxurious red velvet with cream cheese frosting",
        price: 32.99,
        image: "/images/red-velvet.jpg",
        category: "anniversary",
        ingredients: ["cocoa", "flour", "sugar", "eggs", "cream cheese"],
        weight: 2.0,
        available: true
      },
      {
        name: "Strawberry Delight",
        description: "Fresh strawberry cake with whipped cream",
        price: 27.99,
        image: "/images/strawberry-delight.jpg",
        category: "seasonal",
        ingredients: ["strawberries", "flour", "sugar", "eggs", "cream"],
        weight: 1.5,
        available: true
      },
      {
        name: "Custom Birthday Cake",
        description: "Personalized birthday cake with custom message",
        price: 45.99,
        image: "/images/custom-birthday.jpg",
        category: "custom",
        ingredients: ["flour", "sugar", "eggs", "butter", "custom decorations"],
        weight: 2.5,
        available: true
      },
      {
        name: "Glazed Donut",
        description: "Classic sweet glazed ring donut",
        price: 2.99,
        image: "/images/glazed-donut.jpg",
        category: "pastry",
        ingredients: ["flour", "sugar", "yeast", "milk", "butter"],
        weight: 0.1,
        available: true
      },
      {
        name: "Vanilla Ice Cream",
        description: "Rich and creamy homemade vanilla ice cream",
        price: 4.99,
        image: "/images/vanilla-icecream.jpg",
        category: "dessert",
        ingredients: ["milk", "cream", "sugar", "vanilla bean"],
        weight: 0.5,
        available: true
      },
      {
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with cheese, lettuce, and tomato on a fresh bun",
        price: 8.99,
        image: "/images/cheeseburger.jpg",
        category: "savory",
        ingredients: ["beef", "cheese", "lettuce", "tomato", "bread bun"],
        weight: 0.3,
        available: true
      },
      {
        name: "Artisan Sourdough Bread",
        description: "Freshly baked crusty sourdough loaf",
        price: 6.99,
        image: "/images/sourdough-bread.jpg",
        category: "bread",
        ingredients: ["flour", "water", "salt", "sourdough starter"],
        weight: 1.0,
        available: true
      },
      {
        name: "Butter Croissant",
        description: "Flaky, buttery authentic French pastry",
        price: 3.49,
        image: "/images/croissant.jpg",
        category: "pastry",
        ingredients: ["flour", "butter", "milk", "yeast", "sugar"],
        weight: 0.1,
        available: true
      },
      {
        name: "Chocolate Chip Cookie",
        description: "Fresh baked cookie loaded with chocolate chips",
        price: 1.99,
        image: "/images/chocolate-chip-cookie.jpg",
        category: "pastry",
        ingredients: ["flour", "sugar", "butter", "chocolate chips", "eggs"],
        weight: 0.1,
        available: true
      },
      {
        name: "Classic White Bread",
        description: "Soft and fluffy everyday white bread",
        price: 3.99,
        image: "/images/white-bread.jpg",
        category: "bread",
        ingredients: ["flour", "water", "yeast", "salt", "sugar", "butter"],
        weight: 0.8,
        available: true
      },
      {
        name: "Healthy Brown Bread",
        description: "Nutritious whole wheat brown bread loaf",
        price: 4.49,
        image: "/images/brown-bread.jpg",
        category: "bread",
        ingredients: ["whole wheat flour", "water", "yeast", "salt", "honey"],
        weight: 0.8,
        available: true
      },
      {
        name: "Assorted Pastries Box",
        description: "A delightful selection of our finest daily pastries",
        price: 14.99,
        image: "/images/assorted-pastries.jpg",
        category: "pastry",
        ingredients: ["flour", "butter", "sugar", "eggs", "fruit filling", "cream"],
        weight: 0.6,
        available: true
      },
      {
        name: "Butter Cookies & Biscuits",
        description: "Crispy and buttery traditional biscuits and cookies",
        price: 5.99,
        image: "/images/cookies-biscuits.jpg",
        category: "pastry",
        ingredients: ["flour", "butter", "sugar", "vanilla", "baking powder"],
        weight: 0.3,
        available: true
      },
      {
        name: "Mixed Donuts Box",
        description: "Half dozen box of assorted frosted and filled donuts",
        price: 12.99,
        image: "/images/mixed-donuts.jpg",
        category: "pastry",
        ingredients: ["flour", "sugar", "yeast", "milk", "butter", "glazes"],
        weight: 0.5,
        available: true
      },
      {
        name: "Blueberry Muffins",
        description: "Freshly baked moist muffins bursting with blueberries",
        price: 3.49,
        image: "/images/blueberry-muffin.jpg",
        category: "pastry",
        ingredients: ["flour", "sugar", "butter", "eggs", "blueberries", "milk"],
        weight: 0.15,
        available: true
      }
    ];

    await Cake.insertMany(sampleCakes);
    console.log('Sample cakes seeded successfully!');
  } catch (error) {
    console.error('Error seeding cakes:', error);
  }
};

export const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    const driverPassword = await bcrypt.hash('deliver123', 10);
    const sellerPassword = await bcrypt.hash('seller123', 10);

    // Sample users
    const sampleUsers = [
      {
        name: "Admin User",
        email: "admin@cakedelivery.com",
        password: adminPassword,
        phone: "123-456-7890",
        address: "123 Admin Street, City, State 12345",
        isAdmin: true,
        isDriver: false
      },
      {
        name: "Delivery Driver",
        email: "deliver@gmail.com",
        password: driverPassword,
        phone: "555-555-5555",
        address: "999 Driver Lane, City, State 12345",
        isAdmin: false,
        isDriver: true
      },
      {
        name: "John Customer",
        email: "john@example.com",
        password: userPassword,
        phone: "555-123-4567",
        address: "456 Customer Ave, Town, State 67890",
        isAdmin: false,
        isDriver: false
      },
      {
        name: "Seller",
        email: "seller2@gmail.com",
        password: sellerPassword,
        phone: "555-200-0000",
        address: "10 Seller Street, Addis Ababa",
        isAdmin: true,
        isDriver: false
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: userPassword,
        phone: "555-987-6543",
        address: "789 Smith Road, Village, State 11223",
        isAdmin: false,
        isDriver: false
      }
    ];

    await User.insertMany(sampleUsers);
    console.log('Sample users seeded successfully!');
    console.log('Admin login: admin@cakedelivery.com / admin123');
    console.log('Seller login: seller2@gmail.com / seller123');
    console.log('Driver login: deliver@gmail.com / deliver123');
    console.log('User login: john@example.com / user123');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

export const seedOrders = async () => {
  try {
    // Clear existing orders
    await Order.deleteMany({});

    // Get sample users and cakes
    const users = await User.find();
    const cakes = await Cake.find();

    const john = users.find(u => u.email === 'john@example.com');
    const jane = users.find(u => u.email === 'jane@example.com');

    if (!john || !jane || cakes.length === 0) {
      console.log('No users or cakes found, skipping order seeding');
      return;
    }

    // Sample orders
    const sampleOrders = [
      {
        user: john._id, // John Customer
        orderItems: [
          { cake: cakes[0]._id, quantity: 1 }, // Chocolate Fudge Cake
          { cake: cakes[1]._id, quantity: 2 }  // Vanilla Dream Cake
        ],
        shippingAddr: {
          street: "456 Customer Ave",
          city: "Town",
          postalCode: "67890"
        },
        totalPrice: 81.97, // 29.99 + (25.99 * 2)
        isPaid: true,
        deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        user: jane._id, // Jane Smith
        orderItems: [
          { cake: cakes[2]._id, quantity: 1 }, // Red Velvet Elegance
          { cake: cakes[3]._id, quantity: 1 }  // Strawberry Delight
        ],
        shippingAddr: {
          street: "789 Smith Road",
          city: "Village",
          postalCode: "11223"
        },
        totalPrice: 60.98, // 32.99 + 27.99
        isPaid: false,
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      },
      {
        user: john._id, // John Customer - another order
        orderItems: [
          { cake: cakes[4]._id, quantity: 1 }  // Custom Birthday Cake
        ],
        shippingAddr: {
          street: "456 Customer Ave",
          city: "Town",
          postalCode: "67890"
        },
        totalPrice: 45.99,
        isPaid: true,
        deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log('Sample orders seeded successfully!');
  } catch (error) {
    console.error('Error seeding orders:', error);
  }
};
