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
    for (obj in list) {
        if (typeof(resultbox.childNodes[pos]) == "object" && obj == newword) resultbox.childNodes[pos].classList.add('match')
        else if (resultbox.childNodes[pos]) resultbox.childNodes[pos].classList = 'elem'
        if (obj.includes(newword)) {
            if (obj === resultlist[pos]) {
                pos++;
                if (pos >= 5) break;
                continue;
            } else {
                card = template.content.cloneNode(true).children[0];
                card.querySelector("p").textContent = obj.replaceAll("-", " ");
                svgraw = "";
                if (list[obj].svg.solid) svgraw = list[obj].svg.solid.raw;
                else if (list[obj].svg.brands) svgraw = list[obj].svg.brands.raw;
                else if (list[obj].svg.regular) svgraw = list[obj].svg.regular.raw;
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
            // console.log(obj,newword,resultbox.childNodes[pos-1])
            
            if (pos >= 5) break;
        }

    }
    if (pos==1) resultbox.childNodes[0].classList.add('match')
    resultlist = resultlist.slice(0, pos);
    while (resultbox.childElementCount > pos) {
        resultbox.removeChild(resultbox.lastChild);
    }
});

fetch("icons-fa.json")
    .then((resp) => resp.json())
    .then((data) => {
        list = data;
        pencilIcon = list['pencil'].svg.solid.raw
        copyIcon = list['copy'].svg['regular'].raw
        downloadIcon = list['download'].svg['solid'].raw
    });