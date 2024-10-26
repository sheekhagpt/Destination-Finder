// Elements
const searchBtn = document.getElementById('search-btn');
const resultsContainer = document.getElementById('results');

// Event listener for the search button
searchBtn.addEventListener('click', async () => {
  const destination = document.getElementById('destination-input').value;
  if (destination) {
    // Clear previous results
    resultsContainer.innerHTML = '';
    // Fetch destination data
    await fetchDestinationData(destination);
  } else {
    alert("Please enter a destination");
  }
});

// Fetch data from APIs
async function fetchDestinationData(destination) {
  try {
    // Fetch data from GeoDB Cities API for city info
    const geoDBApiKey = '2a72884b6cmsh77ce8aec125d7b0p16d4e5jsn727b34218c0a'; // Replace with your GeoDB key
    const geoDBResponse = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${destination}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': geoDBApiKey,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    });

    // const geoDBResponse = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/places/%7BplaceId%7D/distance?toPlaceId=Q60`, {
    //   method: 'GET',
    //   header: 'x-rapidapi-host: wft-geo-db.p.rapidapi.com',
	  //   header: 'x-rapidapi-key: 2a72884b6cmsh77ce8aec125d7b0p16d4e5jsn727b34218c0a'
    // })

    console.log("geoDBResponse", geoDBResponse);
    

    // Check if the request was successful  
    if (!geoDBResponse.ok) {
      throw new Error(`GeoDB API Error: ${geoDBResponse.statusText}`);
    }

    const geoDBData = await geoDBResponse.json();
    console.log("GeoDB Response: ", geoDBData); // Log GeoDB API response

    // If no data is returned
    if (!geoDBData.data || geoDBData.data.length === 0) {
      alert("No city found. Please try again.");
      return;
    }

    const city = geoDBData.data[0];

    // Display city data
    displayCityData(city);

    // Fetch image from Unsplash API
    await fetchCityImage(destination);

  } catch (error) {
    console.error("Error fetching data:", error);
    alert(`Error: ${error.message}`);
  }
}

// Fetch image from Unsplash API
async function fetchCityImage(destination) {
  try {
    const unsplashApiKey = 'srIDrT0OXN9gxVd_bi8dDhkbu4kJoeE5YiWU2LHpT4s'; // Replace with your Unsplash key
    const unsplashResponse = await fetch(`https://api.unsplash.com/search/photos?query=${destination}&client_id=${unsplashApiKey}`);

    // Check if the request was successful
    if (!unsplashResponse.ok) {
      throw new Error(`Unsplash API Error: ${unsplashResponse.statusText}`);
    }

    const unsplashData = await unsplashResponse.json();
    console.log("Unsplash Response: ", unsplashData); // Log Unsplash API response

    if (unsplashData.results.length > 0) {
      const imageUrl = unsplashData.results[0].urls.small;
      // Display image
      displayImage(imageUrl);
    } else {
      alert("No images found for this destination.");
    }

  } catch (error) {
    console.error("Error fetching image:", error);
    alert(`Error: ${error.message}`);
  }
}

// Function to display city data
function displayCityData(city) {
  const cityCard = document.createElement('div');
  cityCard.classList.add('result-card');
  cityCard.innerHTML = `
    <h2>${city.city}, ${city.country}</h2>
    <p>Population: ${city.population}</p>
    <p>Latitude: ${city.latitude}</p>
    <p>Longitude: ${city.longitude}</p>
  `;
  resultsContainer.appendChild(cityCard);
}

// Function to display image
function displayImage(imageUrl) {
  const imageCard = document.createElement('div');
  imageCard.classList.add('result-card');
  imageCard.innerHTML = `
    <img src="${imageUrl}" alt="Destination Image">
  `;
  resultsContainer.appendChild(imageCard);
}




