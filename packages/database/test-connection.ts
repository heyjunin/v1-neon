#!/usr/bin/env bun

import { db } from './src/drizzle';
import { organizations } from './src/schema/organizations';
import { users } from './src/schema/users';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const result = await db.select().from(users).limit(1);
    console.log('✅ Users table accessible:', result.length, 'users found');
    
    // Test organizations table
    const orgResult = await db.select().from(organizations).limit(1);
    console.log('✅ Organizations table accessible:', orgResult.length, 'organizations found');
    
    console.log('✅ Database connection successful!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
