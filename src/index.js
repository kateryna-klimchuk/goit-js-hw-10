import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v3.1/name'
const formEl = document.querySelector('input#search-box');
const countryListEl = document.querySelector('.country-list')
const countryInfoEl = document.querySelector('.country-info')

formEl.addEventListener('input', debounce(onFetch, DEBOUNCE_DELAY))

const fields = 'name,capital,population,flags,languages';

function fetchCountries(name) {
    return fetch(`${BASE_URL}/${name}?fields=${fields}`).then(response => {
        console.log(response);
        return response.json();
    })
}


function onFetch(event) {
    const inputValue = event.target.value.trim();
    console.log(inputValue);
    
    fetchCountries(inputValue).then(data => {

        if (data.length === 1) {
            resetMarkUp();
            markUpCountryInfo(data);
            
        } else if (data.length > 10) {
            resetMarkUp();

            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        } else {
            countryInfoEl.innerHTML = '';
            markUpCountryList(data)
        }

    }).catch(error => {
        resetMarkUp();

        Notiflix.Notify.failure('"Oops, there is no country with that name"');
})
    };

function markUpCountryInfo(countries) {
    const language = Object.values(countries[0].languages).join(', ');

    const markUpCountries = countries.map(({ name, capital,
        population, languages, flags }) => {
        return `<div class="country-info-box"><img src='${flags.svg}' alt="${name.official}" width="60" height="40"></img><p class="info-name">${name.official}</p></div><p><span class="info-name">Capital:</span> ${capital}</p><p><span class="info-name">Population:</span> ${population}</p><p><span class="info-name">Languages:</span> ${language}</p>`
    }).join('');

    return countryInfoEl.insertAdjacentHTML('beforeend', markUpCountries);
    }

    function markUpCountryList(countries) {
    const markUpListCountries = countries.map(({ name, flags }) => {
        return `<li class="country-item"><img src='${flags.svg}' alt="${name.official}" width="30" height="20"></img><p>${name.official}</p></li>`
    }).join('');

    return countryListEl.insertAdjacentHTML('beforeend', markUpListCountries);
    }

    function resetMarkUp() {
        countryInfoEl.innerHTML = '';
        countryListEl.innerHTML = '';
    }