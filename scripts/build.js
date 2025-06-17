// This script automates the build process for the browser extension.
// It copies source files, customizes the manifest for different browsers (Chromium/Firefox),
// and packages the extension into a ZIP file for distribution.

const fs = require('fs-extra'); // Used for file system operations (copy, ensureDir, emptyDir, readJson, writeJson).
const path = require('path'); // Used for working with file and directory paths.
const archiver = require('archiver'); // Used for creating ZIP archives.

// Get the version from the package.json file.
const { version } = require('../package.json');

// Define key directories.
const SOURCE_DIR = path.join(__dirname, '..'); // Root directory of the project.
const DIST_DIR = path.join(SOURCE_DIR, 'dist'); // Directory for temporary build files.
const RELEASE_DIR = path.join(SOURCE_DIR, 'release'); // Directory for final ZIP files.

// List of source files to be included in the extension package.
const sourceFiles = [
    'src/background.js',
    'src/content-youtube.js',
    'src/content-music.js'
];

// Async function to build the extension for a specific browser.
async function buildExtension(browser) {
    console.log(`Building for ${browser}...`);

    // Define the build directory path for the specific browser.
    const buildDir = path.join(DIST_DIR, browser);
    // Ensure the build directory exists and is empty.
    await fs.ensureDir(buildDir);
    await fs.emptyDir(buildDir);

    // Copy source files to the build directory.
    for (const filePath of sourceFiles) {
        const destPath = path.join(buildDir, path.basename(filePath)); // Destination path uses only the filename.
        await fs.copy(path.join(SOURCE_DIR, filePath), destPath);
    }

    // Handle the manifest file.
    const manifestSrcPath = path.join(SOURCE_DIR, 'manifest.json');
    const manifestDestPath = path.join(buildDir, 'manifest.json');
    // Read the manifest.json file.
    const manifest = await fs.readJson(manifestSrcPath);

    // Update the version in the manifest from package.json.
    manifest.version = version;

    // Adjust paths in the manifest to be relative to the build directory (which is flat).
    // For Manifest V3, the background script is a service worker.
    manifest.background.service_worker = 'background.js';
    // Adjust content script paths.
    manifest.content_scripts.forEach(script => {
        script.js = script.js.map(jsPath => path.basename(jsPath)); // Use only the filename.
    });

    // Apply browser-specific modifications.
    if (browser === 'firefox') {
        // Firefox (MV3) uses 'scripts' array instead of 'service_worker' string for background.
        manifest.background = {
            scripts: [manifest.background.service_worker]
        };
        // Add Firefox-specific settings, including an extension ID.
        manifest.browser_specific_settings = {
            gecko: {
                id: 'ytm-pauser@ameenalasady', // Required for signing/distribution on AMO.
                strict_min_version: '109.0' // Specify minimum Firefox version.
            }
        };
    } else {
        // Ensure the Firefox-specific settings are not present for Chromium builds.
        delete manifest.browser_specific_settings;
    }


    // Write the modified manifest file to the build directory.
    await fs.writeJson(manifestDestPath, manifest, { spaces: 2 });
    console.log(`Customized manifest for ${browser}.`);

    // Create the release directory if it doesn't exist.
    await fs.ensureDir(RELEASE_DIR);
    // Define the path for the output ZIP file.
    const zipPath = path.join(RELEASE_DIR, `ytm-pauser-${browser}-v${version}.zip`);
    // Create a write stream for the ZIP file.
    const output = fs.createWriteStream(zipPath);
    // Create a zip archiver instance.
    const archive = archiver('zip', { zlib: { level: 9 } }); // Use maximum compression.

    // Create a promise that resolves when the output stream closes (ZIP is finished)
    // or rejects if an error occurs during archiving.
    const closePromise = new Promise((resolve, reject) => {
        output.on('close', resolve);
        archive.on('error', reject);
    });

    // Pipe the archive output to the file stream.
    archive.pipe(output);
    // Append the contents of the build directory to the archive.
    // The second argument 'false' means files are added to the root of the archive, not inside a folder.
    archive.directory(buildDir, false);
    // Finalize the archive (write all pending data).
    await archive.finalize();

    // Wait for the output stream to close.
    await closePromise;
    console.log(`Successfully created ZIP file at ${zipPath}`);
}

// Main function to orchestrate the build process.
async function main() {
    // Clean the distribution and release directories before building.
    await fs.emptyDir(DIST_DIR);
    await fs.emptyDir(RELEASE_DIR);
    // Build for Chromium-based browsers (Chrome, Edge, Brave, etc.).
    await buildExtension('chromium');
    // Build for Firefox.
    await buildExtension('firefox');
    console.log('All builds complete!');
}

// Run the main function and catch any errors.
main().catch(console.error);