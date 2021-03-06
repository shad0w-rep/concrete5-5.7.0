<?
namespace Concrete\Core\Localization\Service;
use Zend_Locale;
use Localization;
use Events;

class CountryList {

	protected $countries = array();

	public function __construct() {
		
		$countries = Zend_Locale::getTranslationList('territory', Localization::activeLocale(), 2);
		unset(
			// Fake countries
			$countries['FX'], // Metropolitan France (it's not a country, but its the part of France located in Europe, but we've already FR - France)
			$countries['IM'], // Isle of Man (it's a British Crown Dependency)
			$countries['JE'], // Jersey (it's a British Crown Dependency)
			$countries['NT'], // Neutral Zone
			$countries['PU'], // U.S. Miscellaneous Pacific Islands
			$countries['ZZ'], // Unknown or Invalid Region
			// Dismissed countries
			$countries['CS'], // Serbia and Montenegro (since 2006 has been spitted in Serbia and Montenegro)
			$countries['CT'], // Canton and Enderbury Islands (merged into Kiribati since 1979)
			$countries['DD'], // East Germany (merged with West Germany into Germany in 1990)
			$countries['PC'], // Pacific Islands Trust Territory (no more existing since 1994)
			$countries['PZ'], // Panama Canal Zone (merged into Panama since 2000)
			$countries['SU'], // Union of Soviet Socialist Republics (splitted into several countries since 1991)
			$countries['VD'], // North Vietnam (merged with South Vietnam into Socialist Republic of Vietnam in 1976)
			$countries['YD']  // People's Democratic Republic of Yemen (no more existing since 1990)
		);

		asort($countries, SORT_LOCALE_STRING);
		$event = new \Symfony\Component\EventDispatcher\GenericEvent();
		$event->setArgument('countries', $countries);
		$event = Events::dispatch('on_get_countries_list', $event);
		$countries = $event->getArgument('countries');

		$this->countries = $countries;
	}

	/** Returns an array of countries with their short name as the key and their full name as the value
	* @return array Keys are the country codes, values are the county names
	*/
	public function getCountries() {
		return $this->countries;
	}

	/** Gets a country full name given its code
	* @param string $code The country code
	* @return string
	*/
	public function getCountryName($code) {
		$countries = $this->getCountries(true);
		return $countries[$code];
	}

}
