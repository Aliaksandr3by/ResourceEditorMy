
export const BestMatch = (elMain = window.document) => {
    //"https://www.thomann.de/gb/search.html?bf=harley_benton&gf=electric_guitars&ls=100&oa=pra"

    let tmpCount: Array<number> = [];
    let tmpEL: Array<Element> = [];
    elMain.querySelectorAll(".rs-search-dir.rs-search-list .rs-rating-stars > span.count").forEach((el) => {
        let count: number = Number(el.textContent);

        if (count > 0) {
            tmpCount.push(count);
            tmpEL.push(el);
        } else {
            let elTmp = el.closest("div.extensible-article.list-view.compare.parent");
            if (elTmp) {
                elTmp.remove();
            }
        }

        tmpCount.sort((a, b) => {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });

        tmpEL.sort((a, b) => {
            if ((a && a.textContent) && (b && b.textContent)) {
                if (a.textContent < b.textContent) {
                    return -1;
                }
                if (a.textContent > b.textContent) {
                    return 1;
                }
                return 0;
            } else {
                throw "error 01";
            }
        });
    });

    const getAverage = (arr: Array<number>) => arr.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0) / arr.length;
    const getAverageResult = Math.round(getAverage(tmpCount));
    console.log(getAverageResult);

    tmpEL.forEach((el) => {
        if (Number(el.textContent) < getAverageResult) {
            const elTmp = el.closest("div.extensible-article.list-view.compare.parent");
            if (elTmp) elTmp.remove()
        }
    });

    console.log(tmpCount);
    console.log(tmpEL);

    console.log(tmpEL.length);
    console.log("tmpEL.length");
};

