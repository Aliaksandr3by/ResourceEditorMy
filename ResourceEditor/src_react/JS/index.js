import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { AjaxPOSTAsync, AjaxPOSTAsyncFileSend, getBrowserType } from "../../dist/src/Utils";

import CreateSelect from "./Components/CreateSelect";
import CreateTable from "./Components/CreateTable";

import "../css/style.css";

console.log(getBrowserType());

document.addEventListener("DOMContentLoaded", function () {

	getCountryList(urlControlSelectCountry);
	//CountrySelectUpdate("it", urlControlSwitchLanguage);

	document.getElementById("CountrySelect").addEventListener("change", (e) => {
		const that = e.target.value;
		localStorage.setItem("countrySelect", String(that));
		getDataResourceWithTitle(that, urlControlSwitchLanguage, "", "");

	});

});

function getCountryList(url) {
	const CountrySelect = document.getElementById("CountrySelect");
	if (CountrySelect) {
		AjaxPOSTAsync(url).then((data) => {
			ReactDOM.render(< CreateSelect langList={data} />, CountrySelect);
		}).catch((error) => {
			console.error(error);
		});
	}
}

function getDataResourceWithTitle(lang, url, sort = "Id", filter = "") {
	const rootMainTable = document.getElementById("rootMainTable");
	if (rootMainTable) {
		const dataLG = {
			"language": lang,
			"sort": sort,
			"filter": filter
		};
		const dataEN = {
			"language": "en",
			"sort": sort,
			"filter": filter
		};
		AjaxPOSTAsync(url, dataLG).then((datum) => {
			if (!datum.error) {
				AjaxPOSTAsync(url, dataEN).then((titles) => {
					ReactDOM.render(<CreateTable dataResource={datum} titleResource={titles} />, rootMainTable);
				}).catch((error) => {
					console.error(error);
				});
			}
			else {
				console.error(datum["error"]);
			}
		}).catch((error) => {
			console.error(error);
		});
	}
}
