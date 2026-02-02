// Script to check if orders exist in Sanity
const { createClient } = require('@sanity/client');

// Load environment variables manually
const fs = require('fs');
const path = require('path');

// Read .env.local file
const envLocalPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
    const envLocalData = fs.readFileSync(envLocalPath, 'utf8');
    envLocalData.split('\n').forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length) {
                const value = valueParts.join('=').replace(/['"]/g, '');
                process.env[key.trim()] = value.trim();
            }
        }
    });
}

// Use the same configuration as in the app
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-01-30',
    useCdn: false,
    perspective: 'published',
});

async function checkOrders() {
    try {
        console.log('Checking for orders in Sanity...');
        
        // Query all orders
        const allOrders = await client.fetch('*[_type == "order"]');
        console.log(`Total orders found: ${allOrders.length}`);
        
        if (allOrders.length > 0) {
            console.log('\nRecent orders:');
            allOrders.slice(0, 5).forEach(order => {
                console.log(`- Order ID: ${order._id}, Number: ${order.orderNumber}, Clerk User ID: ${order.clerkUserId}, Created: ${order.createdAt}`);
            });
            
            // Check if there are orders with a specific clerkUserId
            const clerkUserId = process.argv[2]; // Pass clerkUserId as command line argument
            if (clerkUserId) {
                const userOrders = await client.fetch('*[_type == "order" && clerkUserId == $clerkUserId]', { clerkUserId });
                console.log(`\nOrders for user ${clerkUserId}: ${userOrders.length}`);
                
                if (userOrders.length > 0) {
                    console.log('User orders:');
                    userOrders.forEach(order => {
                        console.log(`- Order ID: ${order._id}, Number: ${order.orderNumber}, Status: ${order.status}, Created: ${order.createdAt}`);
                    });
                }
            }
        } else {
            console.log('No orders found in Sanity.');
        }
    } catch (error) {
        console.error('Error querying Sanity:', error);
    }
}

checkOrders();