#!/usr/bin/env node

// Build script for Social Media Kit
// This script prepares the project for deployment

const fs = require('fs').promises;
const path = require('path');

const BUILD_CONFIG = {
    sourceDir: '.',
    outputDir: 'dist',
    minify: process.env.NODE_ENV === 'production',
    copyFiles: [
        'index.html',
        'assets/',
        'utils/',
        'config/',
        'components/',
        'docs/',
        'netlify.toml',
        'package.json',
        'README.md'
    ],
    excludePatterns: [
        '.git',
        'node_modules',
        '*.log',
        '.DS_Store',
        'Thumbs.db'
    ]
};

async function main() {
    console.log('🚀 Building Social Media Kit...');
    
    try {
        // Create output directory
        await createOutputDir();
        
        // Copy files
        await copyProjectFiles();
        
        // Process HTML files
        await processHtmlFiles();
        
        // Validate build
        await validateBuild();
        
        console.log('✅ Build completed successfully!');
        console.log(`📦 Output directory: ${BUILD_CONFIG.outputDir}`);
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

async function createOutputDir() {
    try {
        await fs.access(BUILD_CONFIG.outputDir);
        // Directory exists, clean it
        console.log('🧹 Cleaning output directory...');
        await fs.rm(BUILD_CONFIG.outputDir, { recursive: true });
    } catch (error) {
        // Directory doesn't exist, which is fine
    }
    
    await fs.mkdir(BUILD_CONFIG.outputDir, { recursive: true });
    console.log('📁 Created output directory');
}

async function copyProjectFiles() {
    console.log('📋 Copying project files...');
    
    for (const file of BUILD_CONFIG.copyFiles) {
        const sourcePath = path.join(BUILD_CONFIG.sourceDir, file);
        const destPath = path.join(BUILD_CONFIG.outputDir, file);
        
        try {
            const stat = await fs.stat(sourcePath);
            
            if (stat.isDirectory()) {
                await copyDirectory(sourcePath, destPath);
            } else {
                await fs.mkdir(path.dirname(destPath), { recursive: true });
                await fs.copyFile(sourcePath, destPath);
            }
            
            console.log(`  ✓ Copied ${file}`);
        } catch (error) {
            console.warn(`  ⚠️ Skipped ${file} (${error.message})`);
        }
    }
}

async function copyDirectory(source, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(source);
    
    for (const entry of entries) {
        const sourcePath = path.join(source, entry);
        const destPath = path.join(dest, entry);
        
        // Skip excluded patterns
        if (BUILD_CONFIG.excludePatterns.some(pattern => entry.includes(pattern))) {
            continue;
        }
        
        const stat = await fs.stat(sourcePath);
        
        if (stat.isDirectory()) {
            await copyDirectory(sourcePath, destPath);
        } else {
            await fs.copyFile(sourcePath, destPath);
        }
    }
}

async function processHtmlFiles() {
    console.log('🔧 Processing HTML files...');
    
    const htmlFile = path.join(BUILD_CONFIG.outputDir, 'index.html');
    
    try {
        let content = await fs.readFile(htmlFile, 'utf8');
        
        // Add cache busting to assets in production
        if (BUILD_CONFIG.minify) {
            const timestamp = Date.now();
            content = content.replace(
                /(href|src)="(\.\/assets\/[^"]+)"/g,
                `$1="$2?v=${timestamp}"`
            );
        }
        
        // Add production optimizations
        if (BUILD_CONFIG.minify) {
            // Remove comments and extra whitespace
            content = content.replace(/<!--[\s\S]*?-->/g, '');
            content = content.replace(/\s+/g, ' ');
            content = content.replace(/> </g, '><');
        }
        
        await fs.writeFile(htmlFile, content);
        console.log('  ✓ Processed index.html');
        
    } catch (error) {
        console.warn('  ⚠️ Could not process HTML files:', error.message);
    }
}

async function validateBuild() {
    console.log('🔍 Validating build...');
    
    const requiredFiles = [
        'index.html',
        'assets/css/main.css',
        'assets/css/dashboard.css',
        'assets/js/dashboard.js',
        'assets/js/data-manager.js',
        'assets/js/scraping-engine.js',
        'assets/js/analytics.js',
        'assets/data/manual-data.json',
        'assets/data/cache-config.json'
    ];
    
    let allValid = true;
    
    for (const file of requiredFiles) {
        const filePath = path.join(BUILD_CONFIG.outputDir, file);
        
        try {
            await fs.access(filePath);
            console.log(`  ✓ ${file}`);
        } catch (error) {
            console.error(`  ❌ Missing: ${file}`);
            allValid = false;
        }
    }
    
    // Validate JSON files
    const jsonFiles = [
        'assets/data/manual-data.json',
        'assets/data/cache-config.json'
    ];
    
    for (const file of jsonFiles) {
        const filePath = path.join(BUILD_CONFIG.outputDir, file);
        
        try {
            const content = await fs.readFile(filePath, 'utf8');
            JSON.parse(content);
            console.log(`  ✓ ${file} (valid JSON)`);
        } catch (error) {
            console.error(`  ❌ Invalid JSON: ${file} - ${error.message}`);
            allValid = false;
        }
    }
    
    if (!allValid) {
        throw new Error('Build validation failed');
    }
    
    console.log('✅ Build validation passed');
}

// Development server function
async function serve() {
    const http = require('http');
    const url = require('url');
    const path = require('path');
    
    const server = http.createServer(async (req, res) => {
        const pathname = url.parse(req.url).pathname;
        let filePath = path.join(BUILD_CONFIG.outputDir, pathname === '/' ? 'index.html' : pathname);
        
        try {
            const stat = await fs.stat(filePath);
            
            if (stat.isDirectory()) {
                filePath = path.join(filePath, 'index.html');
            }
            
            const content = await fs.readFile(filePath);
            const ext = path.extname(filePath);
            
            const contentTypes = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'text/javascript',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.svg': 'image/svg+xml'
            };
            
            res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
            res.end(content);
            
        } catch (error) {
            res.statusCode = 404;
            res.end('File not found');
        }
    });
    
    const port = process.env.PORT || 8000;
    server.listen(port, () => {
        console.log(`🌐 Server running at http://localhost:${port}`);
        console.log('📁 Serving from:', BUILD_CONFIG.outputDir);
    });
}

// Command line interface
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'serve':
            serve();
            break;
        case 'clean':
            fs.rm(BUILD_CONFIG.outputDir, { recursive: true })
                .then(() => console.log('🧹 Cleaned output directory'))
                .catch(err => console.error('Error cleaning:', err.message));
            break;
        default:
            main();
    }
}

module.exports = {
    build: main,
    serve,
    config: BUILD_CONFIG
};