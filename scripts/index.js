import {formUser} from './modules/form.js';
// import {News} from './modules/news';

for ykir generil li
i dlya kojnogo li yogo innerHtml = news
formUser();
// News();
  fetch('https://hacker-news.firebaseio.com/v0/item/8863.json?print=pretty')
  .then(response => response.json())
  .then( data => {
     document.getElementById('newsTitle').innerText = data.title;
    document.getElementById('url').innerText = data.url;
    document.getElementById('points').innerText = data.score;
    document.getElementById('time').innerText = data.time;
    document.getElementById('commentsCount').innerText = data.descendants;
    document.getElementById('name').innerText = data.by; 
 
    const title = 'tut''
    const metaInfo ='....';

    cost news = <article><header><h2>title</h2><p>metaInfo</p></header></article>
5 фетч в масив .і передати його в промісол. поверне масиви


 /* const detailEl = document.createElement('p');
    detailEl.setAttribute('id', 'details');
    detailEl.classList = "news__row main-text__subtitle"
    const newsEl = document.getElementById('news');
    newsEl.appendChild(detailEl);

    const box = document.getElementById('details');

    const nameEl = document.createElement('span');
    nameEl.setAttribute('id', 'name');
    box.appendChild(nameEl);
    document.getElementById('name').innerText = data.by;


    const titleEl = document.createElement('span');
    titleEl.setAttribute('id', 'newsTitle');
    box.appendChild(titleEl);
    document.getElementById('newsTitle').innerText = data.title;
        
    const pointeEl = document.createElement('span');
    pointeEl.setAttribute('id', 'points');
    box.appendChild(pointeEl);
    document.getElementById('points').innerText = data.score;

    const timeeEl = document.createElement('span');
    timeeEl.setAttribute('id', 'time');
    box.appendChild(timeeEl);
    document.getElementById('time').innerText = data.time;

    const commentsEl = document.createElement('span');
    commentsEl.setAttribute('id', 'commentsCount');
    box.appendChild(commentsEl);
    document.getElementById('commentsCount').innerText = data.descendants;

  */
    }
)
 