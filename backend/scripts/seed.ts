require('dotenv').config();
const { connectDB } = require('../src/lib/database');
const { User } = require('../src/models/User');
const { Package } = require('../src/models/Package');
const { hashPassword } = require('../src/lib/password');

async function seedDatabase() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Package.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@xyztours.com',
      phone: '+1234567890',
      country: 'India',
      passwordHash: adminPassword,
      role: 'admin',
      isActive: true,
      emailVerifiedAt: new Date(),
      phoneVerifiedAt: new Date()
    });
    console.log('Created admin user:', adminUser.email);

    // Create regular user
    const userPassword = await hashPassword('user123');
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567891',
      country: 'United States',
      passwordHash: userPassword,
      role: 'user',
      isActive: true,
      emailVerifiedAt: new Date()
    });
    console.log('Created regular user:', regularUser.email);

    // Create sample packages
    const packages = [
      {
        title: 'Kerala Backwaters Experience',
        slug: 'kerala-backwaters-experience',
        shortDesc: 'Explore the serene backwaters of Kerala in traditional houseboats',
        longDesc: 'A magical journey through Kerala\'s famous backwaters, staying in traditional houseboats and experiencing the unique lifestyle of the region.',
        itinerary: [
          {
            day: 1,
            activities: ['Arrive in Kochi', 'City tour', 'Chinese fishing nets'],
            accommodation: 'Hotel in Kochi',
            meals: ['Dinner'],
            notes: 'Evening at leisure'
          },
          {
            day: 2,
            activities: ['Drive to Alleppey', 'Houseboat check-in', 'Backwater cruise'],
            accommodation: 'Houseboat',
            meals: ['Breakfast', 'Lunch', 'Dinner'],
            notes: 'Overnight on houseboat'
          },
          {
            day: 3,
            activities: ['Morning cruise', 'Village walk', 'Return to Kochi'],
            accommodation: 'Hotel in Kochi',
            meals: ['Breakfast', 'Lunch'],
            notes: 'Departure'
          }
        ],
        minPax: 2,
        maxPax: 8,
        basePricePerPax: 15000,
        images: ['kerala1.jpg', 'kerala2.jpg'],
        region: 'kerala',
        tags: ['backwaters', 'houseboat', 'nature'],
        featured: true,
        inclusions: ['Accommodation', 'Meals', 'Transport', 'Guide'],
        exclusions: ['Personal expenses', 'Tips'],
        isActive: true
      },
      {
        title: 'Tamil Nadu Temple Trail',
        slug: 'tamil-nadu-temple-trail',
        shortDesc: 'Discover the magnificent temples and rich culture of Tamil Nadu',
        longDesc: 'A spiritual journey through Tamil Nadu\'s most famous temples, experiencing the rich Dravidian architecture and cultural heritage.',
        itinerary: [
          {
            day: 1,
            activities: ['Arrive in Chennai', 'Kapaleeshwarar Temple', 'Marina Beach'],
            accommodation: 'Hotel in Chennai',
            meals: ['Dinner'],
            notes: 'Evening at leisure'
          },
          {
            day: 2,
            activities: ['Drive to Mahabalipuram', 'Shore Temple', 'Five Rathas'],
            accommodation: 'Hotel in Mahabalipuram',
            meals: ['Breakfast', 'Lunch', 'Dinner'],
            notes: 'UNESCO World Heritage sites'
          },
          {
            day: 3,
            activities: ['Drive to Kanchipuram', 'Temple visits', 'Return to Chennai'],
            accommodation: 'Hotel in Chennai',
            meals: ['Breakfast', 'Lunch'],
            notes: 'Departure'
          }
        ],
        minPax: 2,
        maxPax: 12,
        basePricePerPax: 12000,
        images: ['tamil1.jpg', 'tamil2.jpg'],
        region: 'tamil-nadu',
        tags: ['temples', 'culture', 'heritage'],
        featured: true,
        inclusions: ['Accommodation', 'Meals', 'Transport', 'Guide'],
        exclusions: ['Personal expenses', 'Tips'],
        isActive: true
      },
      {
        title: 'Karnataka Heritage Tour',
        slug: 'karnataka-heritage-tour',
        shortDesc: 'Explore the royal heritage and architectural marvels of Karnataka',
        longDesc: 'Discover Karnataka\'s royal heritage through visits to magnificent palaces, ancient temples, and architectural wonders.',
        itinerary: [
          {
            day: 1,
            activities: ['Arrive in Bangalore', 'Lalbagh Botanical Garden', 'Cubbon Park'],
            accommodation: 'Hotel in Bangalore',
            meals: ['Dinner'],
            notes: 'Evening at leisure'
          },
          {
            day: 2,
            activities: ['Drive to Mysore', 'Mysore Palace', 'Chamundi Hills'],
            accommodation: 'Hotel in Mysore',
            meals: ['Breakfast', 'Lunch', 'Dinner'],
            notes: 'Royal city experience'
          },
          {
            day: 3,
            activities: ['Drive to Hampi', 'Virupaksha Temple', 'Vittala Temple'],
            accommodation: 'Hotel in Hampi',
            meals: ['Breakfast', 'Lunch', 'Dinner'],
            notes: 'UNESCO World Heritage site'
          }
        ],
        minPax: 2,
        maxPax: 10,
        basePricePerPax: 18000,
        images: ['karnataka1.jpg', 'karnataka2.jpg'],
        region: 'karnataka',
        tags: ['heritage', 'palaces', 'temples'],
        featured: false,
        inclusions: ['Accommodation', 'Meals', 'Transport', 'Guide'],
        exclusions: ['Personal expenses', 'Tips'],
        isActive: true
      }
    ];

    for (const pkg of packages) {
      await Package.create(pkg);
    }
    console.log(`Created ${packages.length} packages`);

    console.log('Database seeded successfully!');
    console.log('\nTest credentials:');
    console.log('Admin: admin@xyztours.com / admin123');
    console.log('User: john@example.com / user123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();