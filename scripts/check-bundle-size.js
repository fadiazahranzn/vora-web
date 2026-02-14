/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BUILD_MANIFEST_PATH = path.join(process.cwd(), '.next', 'build-manifest.json');

if (!fs.existsSync(BUILD_MANIFEST_PATH)) {
    console.error('Error: .next/build-manifest.json not found. Run "npm run build" first.');
    process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(BUILD_MANIFEST_PATH, 'utf8'));
const files = manifest.rootMainFiles || [];

if (files.length === 0) {
    console.warn('Warning: No rootMainFiles found in build-manifest.json.');
}

let totalSize = 0;
let missingFiles = 0;

console.log('Checking bundle sizes for initial load (rootMainFiles)...');

files.forEach(file => {
    const filePath = path.join(process.cwd(), '.next', file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath);
        const gzipped = zlib.gzipSync(content);
        const size = gzipped.length;
        totalSize += size;
        console.log(`- ${file}: ${(size / 1024).toFixed(2)} KB (gzipped)`);
    } else {
        console.error(`Error: File not found: ${filePath}`);
        missingFiles++;
    }
});

if (missingFiles > 0) {
    console.error(`Error: ${missingFiles} files missing.`);
    process.exit(1);
}

const totalSizeKB = totalSize / 1024;
console.log(`Total Initial JS Size (gzipped): ${totalSizeKB.toFixed(2)} KB`);

const LIMIT_KB = 200;

if (totalSizeKB > LIMIT_KB) {
    console.error(`FAIL: Bundle size exceeds limit of ${LIMIT_KB} KB.`);
    process.exit(1);
} else {
    console.log(`PASS: Bundle size is within limit (< ${LIMIT_KB} KB).`);
    process.exit(0);
}
