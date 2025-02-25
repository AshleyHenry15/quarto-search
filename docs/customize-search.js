import { readFileSync, writeFileSync, existsSync } from 'fs';
import matter from 'gray-matter'; // Requires 'gray-matter' for parsing .qmd YAML

const searchFile = "_site/search.json";

// Ensure the search.json file exists
if (!existsSync(searchFile)) {
    console.error("❌ Error: search.json not found. Quarto may not have generated it.");
    process.exit(1);
}

// Read and parse the existing search.json file
let data = JSON.parse(readFileSync(searchFile, "utf8"));

// Function to extract metadata from .qmd files
function extractKeywords(filename) {
    if (!existsSync(filename)) return [];
    const fileContent = readFileSync(filename, "utf8");
    const parsed = matter(fileContent);
    return parsed.data.keywords || [];
}

// Modify entries while preserving original fields
data.forEach(entry => {
    const qmdFile = entry.objectID.replace(".html", ".qmd");
    entry.keywords = extractKeywords(qmdFile);
});

// Write the enriched JSON file
writeFileSync(searchFile, JSON.stringify(data, null, 2));

console.log("✅ search.json updated successfully with keywords.");
