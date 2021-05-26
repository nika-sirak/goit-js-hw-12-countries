import debounce from 'lodash.debounce';
import countriesTpl from './templates/countries-list.hbs';
import countryCardTpl from './templates/country-card.hbs';
import API from './js/fetchCountries.js';
import { error } from '../node_modules/@pnotify/core/dist/PNotify';
import '../node_modules/@pnotify/core/dist/PNotify.css';
import '../node_modules/@pnotify/core/dist/BrightTheme.css';
import './sass/main.scss';

const refs = {
  formInput: document.querySelector('.form-input'),
  listCountries: document.querySelector('.js-countries-list'),
  countryCardContainer: document.querySelector('.js-country-card'),
};

refs.formInput.addEventListener('input', debounce(onFormInput, 500));

function onFormInput(e) {
  const searchQuery = e.target.value;
  console.log(searchQuery);

  API.fetchCountries(searchQuery)
    .then(data => {
      resetListCountries();
      markupListCountries(data);
      clearCountryCard();
      if (data.length === 1) {
        resetListCountries();
        markupCountryCard(data);
      }

      if (data.length >= 10) {
        error({
          text: 'Too many matches found. Please enter a more specific query!',
        });
      }
    })
    .catch(error => {
      console.log(error);
      resetListCountries();
      clearCountryCard();
    });
}

function resetListCountries() {
  refs.listCountries.innerHTML = '';
}
function clearCountryCard() {
  refs.countryCardContainer.innerHTML = '';
}

function markupListCountries(data) {
  refs.listCountries.insertAdjacentHTML('beforeend', countriesTpl(data));
}

function markupCountryCard(data) {
  refs.countryCardContainer.insertAdjacentHTML('beforeend', countryCardTpl(data[0]));
}
