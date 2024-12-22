const statisticsDiv = document.getElementById('statistics');

document.getElementById('searchForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('countryName') as HTMLInputElement | null;
    if (!nameInput) {
        console.error('Country name input field is missing.');
        return;
    }
    const name = nameInput.value.trim();
    if (!name) {
        alert('Please enter a country name.');
        return;
    }
    fetchCountriesByName(name);
});

document.getElementById('allButton')?.addEventListener('click', fetchAllCountries);

async function fetchAllCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Failed to fetch all countries');
        }
        const data = await response.json();
        displayStatistics(data);
    } catch (error) {
        if (statisticsDiv) {
            statisticsDiv.innerHTML = `<div class="alert alert-danger">Error: Error fetching all countries.</div>`;
        }
        console.error('Error fetching all countries:', error);
    }
}

async function fetchCountriesByName(name: string) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
        if (!response.ok) {
            throw new Error('Failed to fetch countries by name');
        }
        const data = await response.json();
        displayStatistics(data);
    } catch (error) {
        if (statisticsDiv) {
            statisticsDiv.innerHTML = `<div class="alert alert-danger">Error fetching countries by name verify the name or try again later</div>`;
        }
        // document.getElementById('statistics')?.innerHTML = `<div class="alert alert-danger">Error fetching countries by name: ${error}</div>`;    

        console.error('Error fetching countries by name:', error);
    }
}

function displayStatistics(countries: any[]) {
    const totalCountries = countries.length;
    const totalPopulation = countries.reduce((sum, country) => sum + (country.population || 0), 0);
    const avgPopulation = totalPopulation / totalCountries;

    const countryTableRows = countries.map(country => {
        return `<tr>
                    <td>${country.name.common}</td>
                    <td>${country.population || 'N/A'}</td>
                </tr>`;
    }).join('');

    const regionStats: Record<string, number> = {};
    countries.forEach(country => {
        const region = country.region || 'Unknown';
        if (!regionStats[region]) {
            regionStats[region] = 0;
        }
        regionStats[region]++;
    });

    const regionTableRows = Object.entries(regionStats).map(([region, count]: [string, number]) => {
        return `<tr>
                    <td>${region}</td>
                    <td>${count}</td>
                </tr>`;
    }).join('');

    const currencyStats: Record<string, number> = {};
    countries.forEach(country => {
        if (country.currencies) {
            Object.values(country.currencies).forEach((currency: any) => {
                const currencyName = currency.name;
                if (!currencyStats[currencyName]) {
                    currencyStats[currencyName] = 0;
                }
                currencyStats[currencyName]++;
            });
        }
    });

    const currencyTableRows = Object.entries(currencyStats).map(([currency, count]: [string, number]) => {
        return `<tr>
                    <td>${currency}</td>
                    <td>${count}</td>
                </tr>`;
    }).join('');

    if (!statisticsDiv) {
        console.error('Statistics container is missing.');
        return;
    }
    statisticsDiv.innerHTML = `
    <h4 class="mt-3">General Statistics</h4>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Statistic</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total Countries</td>
                            <td>${totalCountries}</td>
                        </tr>
                        <tr>
                            <td>Total Population</td>
                            <td>${totalPopulation.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>Average Population</td>
                            <td>${avgPopulation.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
<ul class="nav nav-tabs" id="statsTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="countries-tab" data-bs-toggle="tab" data-bs-target="#countries" type="button" role="tab">Countries</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="regions-tab" data-bs-toggle="tab" data-bs-target="#regions" type="button" role="tab">Regions</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="currencies-tab" data-bs-toggle="tab" data-bs-target="#currencies" type="button" role="tab">Currencies</button>
            </li>
        </ul>
        <div class="tab-content" id="statsTabsContent">
            <div class="tab-pane fade show active" id="countries" role="tabpanel">
                <h4 class="mt-3">Country Details</h4>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Country Name</th>
                            <th>Population</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${countryTableRows}
                    </tbody>
                </table>
            </div>
            <div class="tab-pane fade" id="regions" role="tabpanel">
                <h4 class="mt-3">Regions</h4>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Region</th>
                            <th>Number of Countries</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${regionTableRows}
                    </tbody>
                </table>
            </div>
            <div class="tab-pane fade" id="currencies" role="tabpanel">
                <h4 class="mt-3">Currencies</h4>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Currency</th>
                            <th>Number of Countries</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currencyTableRows}
                    </tbody>
                </table>
            </div>
        </div>
`;
   /* statisticsDiv.innerHTML = `
  
                <h4 class="mt-3">General Statistics</h4>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Statistic</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total Countries</td>
                            <td>${totalCountries}</td>
                        </tr>
                        <tr>
                            <td>Total Population</td>
                            <td>${totalPopulation.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>Average Population</td>
                            <td>${avgPopulation.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        <ul class="nav nav-tabs" id="statsTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                <button class="nav-link" id="countries-tab" data-bs-toggle="tab" data-bs-target="#countries" type="button" role="tab">Countries</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="regions-tab" data-bs-toggle="tab" data-bs-target="#regions" type="button" role="tab">Regions</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="currencies-tab" data-bs-toggle="tab" data-bs-target="#currencies" type="button" role="tab">Currencies</button>
            </li>
        </ul>
        <div class="tab-pane fade" id="countries" role="tabpanel">
                <h4 class="mt-3">Country Details</h4>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Country Name</th>
                            <th>Population</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${countryTableRows}
                    </tbody>
                </table>
            </div>
            <div class="tab-pane fade" id="regions" role="tabpanel">
                <h4 class="mt-3">Regions</h4>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Region</th>
                            <th>Number of Countries</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${regionTableRows}
                    </tbody>
                </table>
            </div>
            <div class="tab-pane fade" id="currencies" role="tabpanel">
                <h4 class="mt-3">Currencies</h4>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Currency</th>
                            <th>Number of Countries</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currencyTableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;*/
}
