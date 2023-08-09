const searchForm = document.getElementById('search-form');
const locationInput = document.getElementById('location');
const searchBtn = document.getElementById('search-btn');
const toiletList = document.getElementById('toilet-list');
const mapContainer = document.getElementById('map');
const pageSize = 10; // Number of results to display per page

// Replace 'YOUR_BACKEND_API_URL' with the actual backend API URL
const apiUrl = 'YOUR_BACKEND_API_URL/nearby-toilets';

// Initialize Google Places Autocomplete
const autocomplete = new google.maps.places.Autocomplete(locationInput);

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const location = locationInput.value.trim();
  
  if (!location) {
    alert('Please enter a valid location.');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}?location=${encodeURIComponent(location)}`);
    const data = await response.json();
    displayResults(data, 1); // Display the first page of results
    displayMap(data);
  } catch (error) {
    console.error('Error fetching nearby toilets:', error);
  }
});

function displayResults(toilets, currentPage) {
  toiletList.innerHTML = '';

  if (toilets.length === 0) {
    toiletList.innerHTML = '<li>No nearby toilets found.</li>';
    return;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, toilets.length);

  for (let i = startIndex; i < endIndex; i++) {
    const toilet = toilets[i];
    const listItem = document.createElement('li');
    listItem.textContent = `${toilet.name} - ${toilet.address}`;
    toiletList.appendChild(listItem);
  }

  // Create pagination buttons
  const totalPages = Math.ceil(toilets.length / pageSize);
  createPaginationButtons(totalPages, currentPage);
}

function createPaginationButtons(totalPages, currentPage) {
  const paginationContainer = document.getElementById('pagination');

  // Clear previous pagination buttons
  paginationContainer.innerHTML = '';

  // Create 'Previous' button if not on the first page
  if (currentPage > 1) {
    const prevBtn = createPaginationButton('Previous', currentPage - 1);
    paginationContainer.appendChild(prevBtn);
  }

  // Create numbered buttons for each page
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = createPaginationButton(i, i, currentPage);
    paginationContainer.appendChild(pageBtn);
  }

  // Create 'Next' button if not on the last page
  if (currentPage < totalPages) {
    const nextBtn = createPaginationButton('Next', currentPage + 1);
    paginationContainer.appendChild(nextBtn);
  }
}

function createPaginationButton(text, page, currentPage) {
  const button = document.createElement('button');
  button.textContent = text;

  if (page === currentPage) {
    button.disabled = true; // Disable the current page button
  }

  button.addEventListener('click', () => {
    displayResults(data, page);
  });

  return button;
}

function displayMap(toilets) {
  mapContainer.innerHTML = ''; // Clear previous map content if any

  if (toilets.length === 0) {
    return; // No toilets to display on the map
  }

  // Initialize Google Maps
  const map = new google.maps.Map(mapContainer, {
    center: { lat: toilets[0].location.coordinates[1], lng: toilets[0].location.coordinates[0] },
    zoom: 12,
  });

  toilets.forEach(toilet => {
    const marker = new google.maps.Marker({
      position: { lat: toilet.location.coordinates[1], lng: toilet.location.coordinates[0] },
      map: map,
      title: toilet.name,
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${toilet.name}</h3><p>${toilet.address}</p>`,
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  });
}