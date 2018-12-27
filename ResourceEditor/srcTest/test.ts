
import { BestMatch }  from "./test_BestMatch";

function AjaxPOSTAsync(url: string, object: any) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.setRequestHeader("Content-Type", "text/html;charset=UTF-8");
        xhr.onload = (e) => {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                resolve(xhr.response);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        if (object) {
            xhr.send(JSON.stringify(object));
        } else {
            xhr.send();
        }
    });
}

AjaxPOSTAsync(`https://www.thomann.de/gb/search.html?gf=electric_guitars&bf=harley_benton&pg=1&ls=100&oa=pra`, null).then((data: Object) => {

    let htmlObject = document.createElement("div");
    htmlObject.innerHTML = data.toString();

    let asd1: Element | null = document.querySelector(".rs-pagination");
    let asd2: Element | null = asd1 ? asd1.querySelector(".page.active") : null;
    let page: number | null = asd2 ? Number(asd2.textContent) : null;

    console.log(page);

    const tt: Element | null = htmlObject.querySelector("div.rs-search-dir.rs-search-list");
    const body: Element | null = document.querySelector("body");
    if (tt && body) {
        body.innerHTML = "";
        body.appendChild(tt);
    }

    BestMatch();

}).catch((error: any) => {
    console.error(error);
});
BestMatch();

console.log("qwe");