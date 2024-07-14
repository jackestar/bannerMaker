template = document.querySelector("[search-result]");
resultbox = document.querySelector(".resul");
objform = document.querySelector('div.style div.img')
resultlist = [];
word = "";
tempInputEvent = ''
style = 0;
// 0 vertical
// 1 horizontal 1
// 2 horizontal 2
// 3 horizontal 3


// clean
search = document.querySelector("[search]")
search.value = ''

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

document.querySelector('[color]').addEventListener('change',e => {
    document.querySelector(':root').style.setProperty('--text-bg',e.target.value)
    console.log(hexToL(e.target.value)>.5?'#000':'#fff')
    document.querySelector(':root').style.setProperty('--text-color',hexToL(e.target.value)>.5?'#000':'#fff')
})

list = 0;

fetch("icons.json")
    .then((resp) => resp.json())
    .then((data) => {
        list = data;
    });

elementFocus = async a => {
    setTimeout(() => {
        show(a)
    }, 200); // dom loaded
    e = a.parentElement
    e.classList.toggle('selected')
    e.querySelector('.penc').innerHTML = list['pencil'].svg.solid.raw
    inp = e.querySelector('input')
    inp.focus()
    inp.placeholder = e.querySelector('p').innerText
    inp.addEventListener('input',changeText,true)
    e.parentElement.classList.toggle('hid')
}

changeText = a => {
    tempInputEvent = a.target
    tempInputEvent.parentElement.parentElement.querySelector('p').innerText = tempInputEvent.value
}

function hexToL(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      r = parseInt(result[1], 16);
      g = parseInt(result[2], 16);
      b = parseInt(result[3], 16);
      r /= 255, g /= 255, b /= 255;
      (0.299*r + 0.587*g + 0.114*b)
      // var max = Math.max(r, g, b), min = Math.min(r, g, b);
      // var h, s, l = (max + min) / 2;
    return (0.299*r + 0.587*g + 0.114*b)
  }


  show = async (e) => {
    try {
        a = e.parentElement
        a.querySelector('.copy').innerHTML = list['copy'].svg['regular'].raw + `<i>Copiar el portapapeles</i>`
        a.querySelector('.down').innerHTML = list['download'].svg['solid'].raw + `<i>Descargar imagen</i>`
        const dataUrl = await htmlToImage.toPng(e);
        e.parentElement.querySelector('a').href = dataUrl;
        e.parentElement.querySelector('.copy').addEventListener('click', () => copyImageToClipboard(dataUrl,a), true);
    } catch (error) {
        console.error('image not downloaded!', error);
    }
};

copyImageToClipboard = async (base64Image,a) => {
    try {
        const response = await fetch(base64Image);
        const blob = await response.blob();
        const item = new ClipboardItem({ "image/png": blob });
        // const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        // console.log(a.querySelector('.copy'))
        a.querySelector('.copy').classList.add('already')
        setTimeout(() => {
            a.querySelector('.copy').classList.remove('already')
        }, 550);
        // alert("Imagen copiada al portapapeles");
    } catch (err) {
        console.error("Error copiando la imagen al portapapeles: ", err);
    }
};

// For default image
objform.innerHTML = `<img src="./svg/vertical.svg" />`
objform.addEventListener('click',a => {
    // console.log(objform.parentElement.querySelector('.tab'))
    objform.parentElement.querySelector('.tab').classList.add('appear')
    window.addEventListener('click',outsideEvent,true)
})

outsideEvent = e => {
        if (objform.parentElement.contains(e.target)) {
            if (e.target.classList.contains('v')) {
                console.log(e.target)
                resultbox.classList.add('v')
                resultbox.classList.remove('h2')
                objform.innerHTML = `<img src="./svg/vertical.svg" />`
            }
            else if (e.target.classList.contains('h2')) {
                console.log(e.target)
                resultbox.classList.add('h2')
                resultbox.classList.remove('v')
                objform.innerHTML = `<img src="./svg/horizontal2.svg" />`
                }
        } else {
            window.removeEventListener('click',outsideEvent,true)
        }
        objform.parentElement.querySelector('.tab').classList.remove('appear')
    }