// Test script to verify API configuration
// Run this with: node test-api-config.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

console.log('=== API Configuration Test ===');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Expected:', 'https://api.liquidata.dev');
console.log('Match:', API_BASE_URL === 'https://api.liquidata.dev');

// Test the login endpoint
const testLogin = async () => {
    try {
        console.log('\n=== Testing Login Endpoint ===');
        const endpoint = `${API_BASE_URL}/api/admin/login`;
        console.log('Full URL:', endpoint);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });

        console.log('Response Status:', response.status);
        console.log('Response OK:', response.ok);

        const data = await response.json();
        console.log('Response Data:', JSON.stringify(data, null, 2));

        if (data.token) {
            console.log('\n✅ Login successful!');
            console.log('Token received:', data.token.substring(0, 20) + '...');
        } else {
            console.log('\n❌ Login failed - no token received');
        }
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
};

testLogin();
