//@ts-check
/**
 * @type {HTMLElement | null}
 */
const tutBtn = document.querySelector('#showTuts');
const backBtn = document.querySelector('#backBtn');
const catUl = document.querySelector('#categories');
const catContainer = document.querySelector('#categories-container');

/**
 * @type {HTMLIFrameElement | null}
 */
const contentViewer = document.querySelector('#content-viewer');

/**
 * @type {number}
 */
let historyIndex = 0;

/**
 * @type {string[]}
 */
let urlHistory = [];

if (!catUl || !contentViewer || !catContainer || !tutBtn || !backBtn) {
  throw TypeError("Elements cannot be typeof null!");
}

// @ts-expect-error
helper.myList().then(list => {
  console.log(list)
  list.forEach(element => {
    const newLi = document.createElement('li')
    newLi.innerText = element.name
    catUl.appendChild(newLi)
    newLi.addEventListener('click', (event) => {
      contentViewer.src = `/${element.path.replace(/\\/g, '/')}`
      contentViewer.classList.toggle('hidden')
      catContainer.classList.toggle('hidden')
    console.log(urlHistory)
    })
    console.log(element)
    
  });
})

tutBtn.addEventListener('click', (event) => {
  catContainer.classList.toggle('hidden')
  contentViewer.classList.toggle('hidden')
})

backBtn.addEventListener('click', (event) => {
  historyIndex--;
  console.log(historyIndex);
  contentViewer.src = urlHistory[historyIndex]; 
  urlHistory.pop();
})

// TODO: History bug stemming from attempting to load external 
// sources. The external resource causes a delay in a triggering
// of the load event of the Iframe. This, in turn, causes a delay
// in adding the currently selected site to the urlHistory array.
contentViewer.addEventListener('load', (event) => {
  console.log('I loaded')
  if (!contentViewer.contentDocument){
    throw TypeError('Iframe Document is null');
  }
  urlHistory.push(contentViewer.contentDocument.location.href);
  historyIndex = urlHistory.length - 1
})