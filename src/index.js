import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import { fetchCountries } from './js/fetchCountries.js'

const DEBOUNCE_DELAY = 300;
const formEl = document.querySelector('input#search-box');
const countryListEl = document.querySelector('.country-list')
const countryInfoEl = document.querySelector('.country-info')

formEl.addEventListener('input', debounce(onFetch, DEBOUNCE_DELAY))


function onFetch(event) {
    const inputValue = event.target.value.trim();
    if (!inputValue){
        resetMarkUp();
        return;
    }
    
    fetchCountries(inputValue).then(data => {

        if (data.length === 1) {
            resetMarkUp();
            markUpCountryInfo(data);
            return;
        }  else if (data.length > 10) {
            resetMarkUp()
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        } else {
            resetMarkUp();
            markUpCountryList(data)
        }
    }).catch(onCatchError)
};

function markUpCountryInfo(countries) {
    const language = Object.values(countries[0].languages).join(', ');

    const markUpCountries = countries.map(({ name, capital,
        population, flags }) => {
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

function onCatchError(error) {
    resetMarkUp();
    Notiflix.Notify.failure("Oops, there is no country with that name");

}