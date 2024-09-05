document.getElementById('fetch-feed').addEventListener('click', function() {
    const rssUrl = document.getElementById('rss-url').value.trim();
    
    if (rssUrl === '') {
        displayError('Please enter a URL.');
        return;
    }
    
    fetchFeed(rssUrl);
});

document.getElementById('save-feed').addEventListener('click', function() {
    const rssUrl = document.getElementById('rss-url').value.trim();
    
    if (rssUrl === '') {
        displayError('Please enter a URL to save.');
        return;
    }

    saveFeed(rssUrl);
    loadSavedFeeds(); // Refresh the saved feeds list
});

function fetchFeed(url) {
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'ok') {
                displayFeed(data.items);
            } else {
                throw new Error('Invalid RSS feed');
            }
        })
        .catch(error => displayError(`Error fetching the RSS feed: ${error.message}`));
}

function displayFeed(items) {
    const feedList = document.getElementById('rss-feed');
    feedList.innerHTML = '';  // Clear any existing items

    if (items.length === 0) {
        displayError('No items found in this RSS feed.');
        return;
    }

    items.forEach(item => {
        const listItem = document.createElement('li');
        
        const title = `<h3><a href="${item.link}" target="_blank">${item.title}</a></h3>`;
        const pubDate = `<p><strong>Published on:</strong> ${new Date(item.pubDate).toLocaleDateString()}</p>`;
        const description = `<p>${item.description}</p>`;
        
        listItem.innerHTML = `${title}${pubDate}${description}`;
        feedList.appendChild(listItem);
    });
}

function displayError(message) {
    const feedList = document.getElementById('rss-feed');
    feedList.innerHTML = '';  // Clear any existing items
    const errorItem = document.createElement('li');
    errorItem.textContent = message;
    errorItem.style.color = 'red';
    feedList.appendChild(errorItem);
}

function saveFeed(url) {
    let savedFeeds = JSON.parse(localStorage.getItem('rssFeeds')) || [];

    if (!savedFeeds.includes(url)) {
        savedFeeds.push(url);
        localStorage.setItem('rssFeeds', JSON.stringify(savedFeeds));
        alert('Feed saved successfully!');
    } else {
        alert('Feed is already saved.');
    }
}

function deleteFeed(url) {
    let savedFeeds = JSON.parse(localStorage.getItem('rssFeeds')) || [];
    savedFeeds = savedFeeds.filter(feed => feed !== url); // Remove the selected feed
    localStorage.setItem('rssFeeds', JSON.stringify(savedFeeds));
    loadSavedFeeds(); // Refresh the saved feeds list
}

function loadSavedFeeds() {
    const savedFeeds = JSON.parse(localStorage.getItem('rssFeeds')) || [];
    const savedFeedsList = document.getElementById('saved-feeds');
    savedFeedsList.innerHTML = '';  // Clear existing saved feeds

    if (savedFeeds.length > 0) {
        savedFeeds.forEach(url => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a href="#" onclick="fetchFeed('${url}')">${url}</a>
                <button onclick="deleteFeed('${url}')">Delete</button>
            `;
            savedFeedsList.appendChild(listItem);
        });
    } else {
        savedFeedsList.innerHTML = '<li>No saved feeds</li>';
    }
}



// Load saved feeds when the page loads
document.addEventListener('DOMContentLoaded', loadSavedFeeds);
