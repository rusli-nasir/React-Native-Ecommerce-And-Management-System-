const IntlPolyFill = require('intl');
require('intl/locale-data/jsonp/en-US');	// U.S.
require('intl/locale-data/jsonp/ee-GH');	// Ghana
require('intl/locale-data/jsonp/rw-RW');	// Rawanda
require('intl/locale-data/jsonp/lg-UG');	// Uganda
require('intl/locale-data/jsonp/sw-KE');	// Kenya
require('intl/locale-data/jsonp/sw-TZ');	// Tanzania
require('intl/locale-data/jsonp/en-ZW');	// Zimbabwe

export const capitalizeWord = word => {
	return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
};

export const isEmptyObj = (obj) => {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

