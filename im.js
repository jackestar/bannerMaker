svgTemplate = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg
       width="1024"
       height="1024"
       viewBox="0 0 1024 1024"
       version="1.1"
       xmlns="http://www.w3.org/2000/svg"
       xmlns:svg="http://www.w3.org/2000/svg">`

search.addEventListener("input", (e) => {
    if (tempInputEvent) tempInputEvent.removeEventListener('input',changeText,true)
    newword = e.target.value.replaceAll(" ", "-").toLowerCase();
    // Reset Selections
    if (resultbox) for (i=resultbox.childNodes.length;i>0;i--) {
        if (resultbox.childNodes[i]) {
            e = resultbox.childNodes[i]
            e.classList.remove('selected')
            e.classList.remove('complete')
            e.parentElement.classList.remove('hid')
        }
    }



    pos = 0;
    // for (obj in list["icons"]) list["icons"][obj]['tags']
    for (obj in list["icons"]) {
        // if (typeof(resultbox.childNodes[pos]) == "object" && obj == newword) resultbox.childNodes[pos].classList.add('match')
        if (resultbox.childNodes[pos]) resultbox.childNodes[pos].classList = 'elem'
        if (list["icons"][obj]['tags'].some(r=>r.includes(newword))) {
            if (obj === resultlist[pos]) {
                pos++;
                if (pos >= 8) break;
                continue;
            } else {
                card = template.content.cloneNode(true).children[0];
                card.querySelector("p").textContent = list["icons"][obj]['tags'].find(r=>r.includes(newword)).replaceAll("-", " ");
                svgraw = svgTemplate
                list["icons"][obj]['paths'].forEach(a=>svgraw+=`<path d="${a}" />`)
svgraw += `</svg>`
                card.querySelector(".img").innerHTML = svgraw;

                if (resultbox.childElementCount <= pos) {
                    resultbox.append(card);
                    resultlist.push(obj);
                } else {
                    resultbox.replaceChild(card, resultbox.childNodes[pos]);
                    resultlist[pos] = obj;
                }
                pos++;
            }
            if (pos >= 8) break;
        }

    }
    if (pos==1) resultbox.childNodes[0].classList.add('match')
    resultlist = resultlist.slice(0, pos);
    while (resultbox.childElementCount > pos) {
        resultbox.removeChild(resultbox.lastChild);
    }
});

fetch("icons-im.json")
    .then((resp) => resp.json())
    .then((data) => {
        list = data;
        pencilIcon = svgTemplate
        list["icons"]["5"]['paths'].forEach(a=>pencilIcon+=`<path d="${a}" />`)
        pencilIcon += "</svg>"
        copyIcon = svgTemplate
        list["icons"]["44"]['paths'].forEach(a=>copyIcon+=`<path d="${a}" />`)
        copyIcon += "</svg>"
        downloadIcon = svgTemplate
        list["icons"]["96"]['paths'].forEach(a=>downloadIcon+=`<path d="${a}" />`)
        downloadIcon += "</svg>"
    });