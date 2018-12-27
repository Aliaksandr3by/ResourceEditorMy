import { AjaxPOSTAsync, AjaxPOSTAsyncFileSend, getBrowserType } from "./Utils.js";

/*eslint-env jquery*/
/*global urlControlActionDelete*/
/*global urlControlActionUpdate*/
/*global urlControlActionDataProtect*/
/*global urlControlSwitchLanguage*/
/*global urlControlUploadFile*/
/*global urlControlGetFile*/
/*global urlControlSelectCountry*/
/*global urlControlRead*/
/*global urlControlLogFile*/

console.log(getBrowserType());

function createRow(data, titleText) {

	const tableBody = window.document.getElementById("mainDataBodyTable");

	if (tableBody) {
		const tableBodyTR = tableBody.appendChild(createElementWithAttr("tr", {
			"class": "tabl-row",
			"data-row": "table-row"
		}));

		tableBodyTR
			.appendChild(createElementWithAttr("th", {
				"class": "tabl-tbody-row el-01",
				"aria-label": "Key",
				"scope": "row"
			}))
			.appendChild(createElementWithAttr("input", {
				"class": `inputDataId ${titleText.Id ? "" : "error"}`,
				"value": data.Id,
				"title": titleText.Id,
				"data-purpose": "Id",
				"readonly": String(data.Id).length > 0 ? true : false
			}));
		tableBodyTR
			.appendChild(createElementWithAttr("td", {
				"class": "tabl-tbody-row el-02",
				"aria-label": "Value"
			}))
			.appendChild(createElementWithAttr("textarea", {
				"class": `inputDataValue`,
				"textContent": data.Value,
				"title": titleText.Value,
				"data-purpose": "Value",
				"readonly": false
			}));
		tableBodyTR
			.appendChild(createElementWithAttr("td", {
				"class": "tabl-tbody-row el-03",
				"aria-label": "Comment"
			}))
			.appendChild(createElementWithAttr("textarea", {
				"class": `inputDataComment`,
				"textContent": data.Comment,
				"title": titleText.Comment,
				"data-purpose": "Comment",
				"readonly": false
			}));
		tableBodyTR
			.appendChild(createElementWithAttr("td", {
				"class": "tabl-tbody-row el-04",
				"data-label": "Save"
			}))
			.appendChild(createElementWithAttr("button", {
				"class": "btn saveLineButton",
				"type": "button",
				"textContent": data.Id === "" ? "Insert" : "Save",
				"title": titleText.Comment,
				"data-action": data.Id === "" ? "Insert" : "Save"
			}));
		tableBodyTR
			.appendChild(createElementWithAttr("td", {
				"class": "tabl-tbody-row el-05",
				"data-label": "Delete"
			}))
			.appendChild(createElementWithAttr("button", {
				"class": "btn deleteLineButton",
				"type": "button",
				"textContent": "Delete",
				"title": titleText.Comment,
				"data-action": "Delete"
			}));
	}
}

function createTable(datum_tmp, titles_tmp) {

	let datum = datum_tmp;
	let titles = titles_tmp;

	if (Array.isArray(datum) && Array.isArray(titles)) {
		for (let data of datum) {
			let _title = {};
			for (let title of titles) {
				if (data.Id === title.Id) {
					_title = title;
				}
			}
			createRow(data, _title);
		}
	} else if (typeof datum === "object" && typeof titles === "object") {
		createRow(datum, titles);
	} else {
		console.error("unknown error ");
	}
}

const countryResolver = (data) => {
	let dataTmp = data;
	const countrySelecter = document.createElement("select");
	countrySelecter.className = `flex-container-element element-01`;
	countrySelecter.id = `countrySelect`;

	let opt = document.createElement("option");
	opt.text = "Select language";
	opt.disabled = true;
	countrySelecter.add(opt, null);
	let i = 1;

	Array.from(dataTmp).forEach((item) => {
		let opt = document.createElement("option");
		opt.className = ``;
		opt.value = item.Id;
		opt.text = `${i++}. ${item.Id} - ${item.Value}(${item.Comment})`;
		opt.selected = item.Id === window.localStorage.getItem("countrySelect");
		countrySelecter.add(opt, null);
	});

	return countrySelecter;
};

function GetCountrySet(langSet) {
	AjaxPOSTAsync(urlControlSelectCountry, null).then((data) => {
		const CountrySelect = window.document.getElementById("CountrySelect");
		if (data !== "" && CountrySelect) {
			let countrySelect = window.document.getElementById("countrySelect");
			if (countrySelect) {
				CountrySelect.replaceChild(countryResolver(data), countrySelect);
			} else {
				countrySelect = CountrySelect.insertBefore(countryResolver(data), CountrySelect[0]);
			}
			let lang = langSet || countrySelect.value || window.localStorage.getItem("countrySelect");
			CountrySelectUpdateSet(lang);
		} else {
			console.log("error");
		}
	}).catch((error) => {
		console.error(error);
	});
}

const ResourceUploads = window.document.getElementById("ResourceUploads");
if (ResourceUploads) {
	ResourceUploads.addEventListener("click", () => {
		const colFileContainer = document.getElementById("colFileContainer");
		const fileUpload = document.querySelector(".fileUpload");

		const resultUpload = (respond = "", alert = "") => {
			const resultUpload = document.createElement("div");
			resultUpload.className = `${alert}`;
			resultUpload.textContent = `${respond}`;
			return resultUpload;
		};

		AjaxPOSTAsyncFileSend(urlControlUploadFile, "FileResource").then((respond) => {
			if (!respond.error && respond.fileName) {
				if (colFileContainer && fileUpload) {
					colFileContainer.replaceChild(resultUpload(respond.fileName, "success"), fileUpload);
					GetCountrySet();
				}
			} else {
				if (colFileContainer && fileUpload) {
					colFileContainer.replaceChild(resultUpload(respond.error, "error"), fileUpload);
					GetCountrySet();
				}
			}
		}).catch((error) => {
			console.error(error);
		});
	});
}

const ResourceSave = window.document.getElementById("ResourceSave");
if (ResourceSave) {
	ResourceSave.addEventListener("click", () => {

		const data = {
			language: window.document.getElementById("countrySelect").value
		};

		AjaxPOSTAsync(urlControlGetFile, data, "GET").then(() => {
			if (data !== "") {
				window.location.href = `${urlControlGetFile}?${encodeURIComponent("language")}=${encodeURIComponent(data.language)}`;
			} else {
				console.log("Please select language");
			}
		}).catch((error) => {
			console.error(error);
		});
	});
}

/**
 * Method protects exist node of resource
 */
const rootMainTable = window.document.getElementById("rootMainTable");
if (rootMainTable) {
	rootMainTable.addEventListener("change", (e) => {

		if (e.target.getAttribute("data-purpose") === "Id") {

			const that = e.target;
			const countrySelect = document.getElementById("countrySelect").value;
			const those = that.closest("tr");
			const id = those.querySelector("[data-purpose=Id]");
			const value = those.querySelector("[data-purpose=Value]");
			const comment = those.querySelector("[data-purpose=Comment]");

			const dataTmp = {
				language: countrySelect,
				itemExists: {
					"Id": id.value,
					"Value": value.value,
					"Comment": comment.value
				}
			};

			AjaxPOSTAsync(urlControlActionDataProtect, dataTmp).then((data) => {

				if (data.status) {
					that.classList.remove("error");
					that.classList.add("success");

					value.removeAttribute("placeholder");
					comment.removeAttribute("placeholder");

					those.querySelectorAll("div.dataError").forEach((el) => {
						el.remove();
					});

					id.parentElement.appendChild(createElementWithAttr("div", {
						"class": "success dataSuccess",
						"data-result": "Success",
						"textContent": data.status
					}));

					those.querySelector("button.saveLineButton").disabled = false;

				} else {
					that.classList.remove("success");
					that.classList.add("error");

					value.setAttribute("placeholder", data.Value);
					comment.setAttribute("placeholder", data.Comment);

					those.querySelectorAll("div.dataSuccess").forEach((el) => {
						el.remove();
					});

					id.parentElement.appendChild(createElementWithAttr("div", {
						"class": "error dataError",
						"data-result": "Error",
						"textContent": `${data.Id} was found!`
					}));

					those.querySelector("button.saveLineButton").disabled = true;
				}
			}).catch((error) => {
				console.error(error);
			});
		}

	});

	rootMainTable.addEventListener("click", (e) => {

		const that = e.target;
		const countrySelect = document.getElementById("countrySelect").value;
		const those = that.closest("tr");
		const id = those.querySelector("[data-purpose=Id]");
		const value = those.querySelector("[data-purpose=Value]");
		const comment = those.querySelector("[data-purpose=Comment]");

		const dataTmp = {
			language: countrySelect,
			rowUpdate: {
				"Id": id.value,
				"Value": value.value,
				"Comment": comment.value
			}
		};

		AjaxPOSTAsync(urlControlActionUpdate, dataTmp).then((data) => {

			const DataAction = that.getAttribute("data-action");

			if (DataAction) {
				if (DataAction === "Save" || DataAction === "Insert") {

					if (data.hasOwnProperty("status") && !data.hasOwnProperty("error")) {

						that.disabled = true;

						let err = those.querySelector("[data-purpose=error]");
						if (err) {
							err.remove();
						}

						id.readOnly = true;
						$(that).parents("tr").find("th").first().append(`<div class="success">${data.status}</div >`);
					}

					// validation-error
					if (data.hasOwnProperty("status") && data.hasOwnProperty("error")) {
						that.disabled = false;

						Array.from(data.error).forEach((el) => {

							id.closest("th").appendChild(createElementWithAttr("div", {
								"class": "error",
								"textContent": el,
								"data-purpose": "error"
							}));

						});
					}

					if (!data.hasOwnProperty("status") && data.hasOwnProperty("error")) {
						alert(data.error);
					}
				}
			}

		}).catch((error) => {
			console.error(error);
		});
	});

}

$("#rootMainTable").on("click", ".deleteLineButton", null, e => {
	if (window.confirm("Delete?")) {
		const that = $(e.target);
		const [id, value, comment] = that.closest("tr").find("input, textarea");
		const tmp = {
			Id: id.value,
			Value: value.value,
			Comment: comment.value
		};
		const language = window.document.getElementById("countrySelect").value;
		$.ajax({
			type: "POST",
			url: urlControlActionDelete,
			data: {
				language: language,
				rowDelete: tmp
			},
			success: (data, textStatus) => {
				console.log(textStatus);
				if ($(data)) {
					that.closest("tr").empty();
				}
			},
			error: (xhr, ajaxOptions, thrownError) => {
				console.error(xhr);
				console.error(ajaxOptions);
				console.error(thrownError);
			}
		});
	}
});

function CountrySelectUpdate(lang, url, sort, filter, take, page) {
	const that = lang;
	const mainDataBodyTable = document.getElementById("mainDataBodyTable");
	const dataLG = {
		"language": that,
		"sort": sort,
		"filter": filter,
		"take": take,
		"page": page
	};
	const dataEN = {
		"language": "en",
		"sort": sort,
		"filter": filter,
		"take": take,
		"page": page
	};
	AjaxPOSTAsync(url, dataLG).then((data) => {
		if (data.error) {
			EmptyElement(mainDataBodyTable);
			let divError = document.createElement("div");
			divError.textContent = data.error;
			divError.className = "error";
			mainDataBodyTable.appendChild(divError);
			console.error(data.error);
		} else {
			EmptyElement(mainDataBodyTable);
			AjaxPOSTAsync(url, dataEN).then((datas) => {
				createTable(data, datas);
			}).catch((error) => {
				console.error(error);
			});
			localStorage.setItem("countrySelect", String(that));
		}

	}).catch((error) => {
		console.error(error);
	});
}

function CountrySelectUpdateSet(lang) {
	let sort = window.document.getElementById("select-sort-table").value;
	let filter = JSON.stringify(findTextAll(".inputSearch"));
	let take = window.document.getElementById("take").value;
	let page = window.document.getElementById("page").value;
	CountrySelectUpdate(lang, urlControlSwitchLanguage, sort, filter, take, page);
}

document.addEventListener("DOMContentLoaded", function () {
	try {
		const mainDataBodyTable = document.getElementById("mainDataBodyTable");

		if (GetCountrySet) {
			GetCountrySet();
		}

		const selectSortTable = window.document.getElementById("select-sort-table");
		if (selectSortTable) {
			window.document.getElementById("page").addEventListener("change", () => {
				GetCountrySet();
			});
			window.document.getElementById("take").addEventListener("change", () => {
				GetCountrySet();
			});
		}


		window.addEventListener("popstate", (event) => {

			console.log(event.state);

			window.localStorage.setItem("countrySelect", String(event.state));

			$("#countrySelect").val(event.state).trigger("change");

			CountrySelectUpdateSet(event.state);

		});

		const CountrySelect = document.getElementById("CountrySelect");
		if (CountrySelect !== null && typeof CountrySelect !== "undefined") {

			window.document.getElementById("countrySelectRefresh").addEventListener("click", () => {
				GetCountrySet();
			});

			CountrySelect.addEventListener("change", (event) => {
				if (event.target.nodeName === "SELECT") {
					EmptyElement(mainDataBodyTable);
					let lang = event.target.value || window.localStorage.getItem("countrySelect");
					CountrySelectUpdateSet(lang);

					window.history.pushState(event.target.value, event.target.value, urlControlRead);
				}
			});
		}

		const SelectSort = window.document.getElementById("select-sort-table");
		if (SelectSort !== null && typeof SelectSort !== "undefined") {

			SelectSort.addEventListener("change", () => {

				if (SelectSort.tagName === "SELECT") {

					const lang = document.getElementById("countrySelect").value;

					EmptyElement(mainDataBodyTable);

					CountrySelectUpdateSet(lang);
				}
			});
		}

		const mainDataHeadFilterTable = document.getElementById("mainDataHeadFilterTable");
		if (mainDataHeadFilterTable !== null && typeof mainDataHeadFilterTable !== "undefined") {
			mainDataHeadFilterTable.addEventListener("keyup", (event) => {

				if (event.target.tagName === "INPUT") {
					const lang = document.getElementById("countrySelect").value;

					EmptyElement(mainDataBodyTable);

					CountrySelectUpdateSet(lang);
				}

			});
		}


		const BtnClear = document.getElementById("BtnClear");
		if (BtnClear !== null && typeof BtnClear !== "undefined") {

			BtnClear.addEventListener("click", () => {

				const inputSearchAll = document.getElementById("mainDataHeadFilterTable").querySelectorAll(".inputSearch");
				const lang = document.getElementById("countrySelect").value;

				EmptyElement(document.getElementById("mainDataBodyTable"));

				inputSearchAll.forEach((element) => {
					element.value = "";
				});

				CountrySelectUpdateSet(lang);


			});
		}

		const addTableRow = document.getElementById("addTableRow");
		if (addTableRow !== null && typeof addTableRow !== "undefined") {
			addTableRow.addEventListener("click", () => {

				createTable({
					"Id": "",
					"Value": "",
					"Comment": ""
				}, {
						"Id": "",
						"Value": "",
						"Comment": ""
					});

			});
		}

		if (mainDataBodyTable !== null && typeof mainDataBodyTable !== "undefined") {
			mainDataBodyTable.addEventListener("change", (event) => {

				event.target.closest("tr").querySelector("button.saveLineButton").removeAttribute("disabled");

			});
		}

		const tmpTbl = (datas) => {
			if (typeof datas === "object") {
				let tmpString = `<td>>>></td>`;
				for (let item in datas) {
					if (datas.hasOwnProperty(item)) {
						tmpString += `<th>${item}</th><td>${datas[item]}</td>`;
					}
				}
				return tmpString;
			}
			return `<td>${datas}</td>`;
		};

		let genTable = (data) => {

			let rootLogText = "";

			rootLogText += "<table>";
			Array.from(data).forEach((items) => {
				if (items) {

					rootLogText += "<tbody>";

					for (let item in items) {
						if (items.hasOwnProperty(item)) {
							rootLogText += `<tr><th>${item}</th>${tmpTbl(items[item])}</tr>`;
						}
					}
					rootLogText += "</tbody>";
				}

			});
			rootLogText += "</table>";

			return rootLogText;
		};

		const refreshLog = document.getElementById("refreshLog");
		const rootLog = document.getElementById("rootLog");
		if (refreshLog !== null && typeof refreshLog !== "undefined") {
			refreshLog.addEventListener("click", () => {

				AjaxPOSTAsync(urlControlLogFile, null).then((data) => {
					// EmptyElement(rootLog);
					rootLog.innerHTML = genTable(data);

				}).catch((error) => {
					console.error(error);
				});

			});
		}

		const dropdown = window.document.querySelector(".dropdown");
		if (dropdown) {
			dropdown.addEventListener("click", (e) => {
				const that = e.target;
				const DataAction = that ? that.getAttribute("data-action") : null;
				if (DataAction && that) {
					if (DataAction === "fileUpload" || DataAction === "hide-all") {
						const colFileContainer = window.document.getElementById("colFileContainer");
						if (colFileContainer) {
							colFileContainer.classList.toggle("hide");
							that.classList.toggle("change");
						}
					}
					if (DataAction === "languageChange" || DataAction === "hide-all") {
						const colLanguageChange = window.document.getElementById("colLanguageChange");
						if (colLanguageChange) {
							colLanguageChange.classList.toggle("hide");
							that.classList.toggle("change");
						}
					}
					if (DataAction === "colSortFilter" || DataAction === "hide-all") {
						const colSortFilter = window.document.getElementById("colSortFilter");
						if (colSortFilter) {
							colSortFilter.classList.toggle("hide");
							that.classList.toggle("change");
						}
					}
					if (DataAction === "hide-all") {
						Array.from(document.querySelectorAll("a[data-action]")).forEach((element) => {
							element.classList.toggle("change");
						});
					}

				}
			}, false);
		}

		window.addEventListener("hashchange", (e) => {
			console.log(e.oldURL);
			console.log(e.newURL);
		}, false);

	} catch (e) {
		console.log(e);
	}
});

function EmptyElement(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

function findTextAll(el) {
	const inputSearchAll = window.document.querySelectorAll(el);
	const findTextAll = {};
	Array.from(inputSearchAll).forEach((element) => {
		findTextAll[element.name] = element.value;
	});
	return findTextAll;
}

function createElementWithAttr(object, options) {
	let element = window.document.createElement(object);
	for (const key in options) {
		switch (key) {
			case "textContent":
				element.textContent = options[key];
				break;
			case "readonly":

				if (typeof options[key] === "boolean") {
					element.readOnly = options[key];
				} else {
					console.error(options[key]);
				}
				break;
			default:
				element.setAttribute(key, options[key]);
				break;
		}
	}
	return element;
}
