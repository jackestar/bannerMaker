template = document.querySelector("[search-result]");
resultbox = document.querySelector(".resul");
objform = document.querySelector('div.style div.img')
pencilIcon = ''
copyIcon = ''
downloadIcon = ''
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

document.querySelector('[color]').addEventListener('input',e => {
    document.querySelector(':root').style.setProperty('--text-bg',e.target.value)
    document.querySelector(':root').style.setProperty('--text-color',hexToL(e.target.value)>.5?'#000':'#fff')
})

list = 0;

elementFocus = async a => {
    setTimeout(() => {
        show(a)
    }, 200); // dom loaded
    e = a.parentElement
    e.classList.toggle('selected')
    e.querySelector('.penc').innerHTML = pencilIcon
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

// Hex Color to Luminance Value
function hexToL(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      r = parseInt(result[1], 16);
      g = parseInt(result[2], 16);
      b = parseInt(result[3], 16);
      r /= 255, g /= 255, b /= 255;
      (0.299*r + 0.587*g + 0.114*b)
    return (0.299*r + 0.587*g + 0.114*b)
  }

show = async (e) => {
    try {
        a = e.parentElement
        a.querySelector('.copy').innerHTML = copyIcon + `<i>Copiar el portapapeles</i>`
        a.querySelector('.down').innerHTML = downloadIcon + `<i>Descargar imagen</i>`
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
        await navigator.clipboard.write([item]);
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
    objform.parentElement.querySelector('.tab').classList.add('appear')
    window.addEventListener('click',outsideEvent,true)
})

outsideEvent = e => {
        if (objform.parentElement.contains(e.target)) {
            if (e.target.classList.contains('v')) {
                resultbox.classList.add('v')
                resultbox.classList.remove('h2')
                objform.innerHTML = `<img src="./svg/vertical.svg" />`
            }
            else if (e.target.classList.contains('h2')) {
                resultbox.classList.add('h2')
                resultbox.classList.remove('v')
                objform.innerHTML = `<img src="./svg/horizontal2.svg" />`
                }
        } else {
            window.removeEventListener('click',outsideEvent,true)
        }
        objform.parentElement.querySelector('.tab').classList.remove('appear')
    }