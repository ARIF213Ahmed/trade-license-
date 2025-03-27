// Select elements
const searchBar = document.getElementById("searchBar");
const resultsTable = document.getElementById("results");
const resultsCount = document.getElementById("resultsCount"); // Add this element to your HTML

// Constants
const DEFAULT_RESULTS_LIMIT = 10;

// Function to display results
const displayResults = (filteredData, limit = null) => {
    resultsTable.innerHTML = "";
    
    // Apply limit only if specified and not searching
    const displayData = limit ? filteredData.slice(0, limit) : filteredData;
    
    // Show results count
    resultsCount.textContent = `Showing ${displayData.length} of ${filteredData.length} results`;
    
    if (displayData.length === 0) {
        resultsTable.innerHTML = `<tr><td colspan="3">No results found</td></tr>`;
        return;
    }
    
    displayData.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.type}</td>
            <td>${item.code}</td>
        `;
        resultsTable.appendChild(row);
    });
};

// Debounce function to prevent rapid firing of search
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

// Improved search function
const performSearch = () => {
    const searchText = searchBar.value.trim().toLowerCase();
    
    if (!searchText) {
        // Show default limited results when search is empty
        displayResults(tradeData, DEFAULT_RESULTS_LIMIT);
        return;
    }
    
    // Split search terms by spaces
    const searchTerms = searchText.split(/\s+/).filter(term => term.length > 0);
    
    const filteredData = tradeData.filter(item => {
        const itemName = item.name.toLowerCase();
        const itemCode = item.code.toString();
        
        // Match ALL search terms (AND logic)
        return searchTerms.every(term => 
            itemName.includes(term) || 
            itemCode.includes(term)
        );
    });
    
    displayResults(filteredData); // Show all matching results without limit
};

// Optimized event listener with debouncing
searchBar.addEventListener("input", debounce(performSearch, 300));

// Initial display (only first 10 entries)
displayResults(tradeData, DEFAULT_RESULTS_LIMIT);