#!/usr/bin/env node

/**
 * Simple API Testing Script for iTunes Search Application
 * Tests the complete API flow without setting up database
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

class ApiTester {
  constructor() {
    this.testResults = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runTest(name, testFn) {
    try {
      this.log(`Starting test: ${name}`);
      await testFn();
      this.log(`✅ ${name} - PASSED`, 'success');
      this.testResults.push({ name, status: 'PASSED' });
    } catch (error) {
      this.log(`❌ ${name} - FAILED: ${error.message}`, 'error');
      this.testResults.push({ name, status: 'FAILED', error: error.message });
    }
  }

  async testHealthCheck() {
    const response = await axios.get(`${API_BASE}/health`);
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.status) {
      throw new Error('Health check response missing status');
    }
  }

  async testBasicInfo() {
    const response = await axios.get(`${API_BASE}/`);
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.message) {
      throw new Error('Basic info response missing message');
    }
  }

  async testSearchValidation() {
    try {
      await axios.get(`${API_BASE}/search`);
      throw new Error('Should have failed with missing term');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 error, got ${error.response?.status || error.message}`);
      }
    }
  }

  async testSearchWithShortTerm() {
    try {
      await axios.get(`${API_BASE}/search?term=a`);
      throw new Error('Should have failed with short term');
    } catch (error) {
      if (error.response?.status !== 400) {
        throw new Error(`Expected 400 error, got ${error.response?.status || error.message}`);
      }
    }
  }

  async testSearchHistory() {
    const response = await axios.get(`${API_BASE}/search/history`);
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.success) {
      throw new Error('Search history response missing success field');
    }
  }

  async testPopularTerms() {
    const response = await axios.get(`${API_BASE}/search/popular-terms`);
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.data.success) {
      throw new Error('Popular terms response missing success field');
    }
  }

  async runAllTests() {
    this.log('🚀 Starting API Test Suite for iTunes Search Application');
    this.log('📝 Testing against: ' + API_BASE);

    await this.runTest('Health Check', () => this.testHealthCheck());
    await this.runTest('Basic Info Endpoint', () => this.testBasicInfo());
    await this.runTest('Search Validation (Missing Term)', () => this.testSearchValidation());
    await this.runTest('Search Validation (Short Term)', () => this.testSearchWithShortTerm());
    await this.runTest('Search History Endpoint', () => this.testSearchHistory());
    await this.runTest('Popular Terms Endpoint', () => this.testPopularTerms());

    this.log('\n📊 Test Results Summary:');
    this.testResults.forEach(result => {
      const status = result.status === 'PASSED' ? '✅' : '❌';
      this.log(`${status} ${result.name}: ${result.status}`);
      if (result.error) {
        this.log(`   Error: ${result.error}`);
      }
    });

    const passedCount = this.testResults.filter(r => r.status === 'PASSED').length;
    const totalCount = this.testResults.length;
    
    this.log(`\n🎯 Results: ${passedCount}/${totalCount} tests passed`);
    
    if (passedCount === totalCount) {
      this.log('🎉 All tests passed! API is working correctly.', 'success');
    } else {
      this.log('⚠️ Some tests failed. Check the API server and database connection.', 'error');
      process.exit(1);
    }
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new ApiTester();
  tester.runAllTests().catch(error => {
    console.error('❌ Test suite failed:', error.message);
    process.exit(1);
  });
}

module.exports = ApiTester;
