const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const auth = require('../middleware/auth');

// Helper function to read JSON file
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
};

// Helper function to write JSON file
const writeJsonFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw new Error(`Error writing file: ${error.message}`);
  }
};

// Get all available data files
router.get('/files', auth, async (req, res) => {
  try {
    const dataDir = path.join(__dirname, '../../src/data');
    const portfoliosDir = path.join(dataDir, 'portfolios');
    
    const mainFiles = await fs.readdir(dataDir);
    const portfolioFiles = await fs.readdir(portfoliosDir);

    const files = {
      main: mainFiles.filter(file => file.endsWith('.json')),
      portfolios: portfolioFiles.filter(file => file.endsWith('.json'))
    };

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get content of a specific file
router.get('/file/:location/:filename', auth, async (req, res) => {
  try {
    const { location, filename } = req.params;
    const baseDir = path.join(__dirname, '../../src/data');
    const filePath = location === 'portfolios' 
      ? path.join(baseDir, 'portfolios', filename)
      : path.join(baseDir, filename);

    const data = await readJsonFile(filePath);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update content of a specific file
router.put('/file/:location/:filename', auth, async (req, res) => {
  try {
    const { location, filename } = req.params;
    const baseDir = path.join(__dirname, '../../src/data');
    const filePath = location === 'portfolios' 
      ? path.join(baseDir, 'portfolios', filename)
      : path.join(baseDir, filename);

    await writeJsonFile(filePath, req.body);
    res.json({ message: 'File updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new file
router.post('/file/:location/:filename', auth, async (req, res) => {
  try {
    const { location, filename } = req.params;
    const baseDir = path.join(__dirname, '../../src/data');
    const filePath = location === 'portfolios' 
      ? path.join(baseDir, 'portfolios', filename)
      : path.join(baseDir, filename);

    // Check if file already exists
    try {
      await fs.access(filePath);
      return res.status(400).json({ message: 'File already exists' });
    } catch {
      // File doesn't exist, proceed with creation
      await writeJsonFile(filePath, req.body);
      res.status(201).json({ message: 'File created successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a file
router.delete('/file/:location/:filename', auth, async (req, res) => {
  try {
    const { location, filename } = req.params;
    const baseDir = path.join(__dirname, '../../src/data');
    const filePath = location === 'portfolios' 
      ? path.join(baseDir, 'portfolios', filename)
      : path.join(baseDir, filename);

    await fs.unlink(filePath);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 