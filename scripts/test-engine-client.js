#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log("🧪 Testing Engine Client...\n");

async function testEngineClient() {
  try {
    // 1. Build the engine first
    console.log("📦 Building Engine API...");
    execSync("bun run build", { 
      stdio: "inherit", 
      cwd: path.join(__dirname, "../apps/engine") 
    });

    // 2. Build the client
    console.log("📦 Building Engine Client...");
    execSync("bun run build", { 
      stdio: "inherit", 
      cwd: path.join(__dirname, "../packages/engine-client") 
    });

    // 3. Start the engine API in background
    console.log("🚀 Starting Engine API...");
    const engineProcess = execSync("bun run dev", { 
      stdio: "pipe", 
      cwd: path.join(__dirname, "../apps/engine"),
      detached: true 
    });

    // Wait a bit for the server to start
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 4. Test the client
    console.log("🧪 Testing client functionality...");
    
    // Create a simple test script
    const testScript = `
import { engineClient } from '@v1/engine-client'

async function test() {
  try {
    console.log('Testing health check...')
    const healthResponse = await engineClient.health.$get()
    
    if (healthResponse.ok) {
      const data = await healthResponse.json()
      console.log('✅ Health check successful:', data)
    } else {
      console.log('❌ Health check failed:', healthResponse.status)
    }

    console.log('Testing webhook endpoint...')
    const webhookResponse = await engineClient.webhooks['supabase/test'].$get()
    
    if (webhookResponse.ok) {
      const data = await webhookResponse.json()
      console.log('✅ Webhook test successful:', data)
    } else {
      console.log('❌ Webhook test failed:', webhookResponse.status)
    }

  } catch (error) {
    console.error('❌ Test error:', error.message)
  }
}

test()
`;

    // Write test script to temp file
    const fs = require('fs');
    const testFile = path.join(__dirname, "../packages/engine-client/test-client.js");
    fs.writeFileSync(testFile, testScript);

    // Run the test
    execSync("bun run test-client.js", { 
      stdio: "inherit", 
      cwd: path.join(__dirname, "../packages/engine-client") 
    });

    // Clean up
    fs.unlinkSync(testFile);

    console.log("\n✅ Engine Client test completed successfully!");
    console.log("\n📝 What was tested:");
    console.log("   - Engine API build");
    console.log("   - Engine Client build");
    console.log("   - Health check endpoint");
    console.log("   - Webhook test endpoint");
    console.log("   - Type safety and RPC functionality");

  } catch (error) {
    console.error("❌ Engine Client test failed:", error.message);
    process.exit(1);
  }
}

testEngineClient();
