export default class News {
  constructor(id, btn) {
    this.id = id;
    this.btn = btn;
    this.produceCommentsHtml = this.produceCommentsHtml.bind(this);
    this.produceNewsHtml = this.produceNewsHtml.bind(this);
    this.timeFormat = this.timeFormat.bind(this);
    this.setInnerHtml = this.setInnerHtml.bind(this);
    this.listenCommentBtnClick = this.listenCommentBtnClick.bind(this);
    this.Math = Math;
  }

  produceCommentsHtml({ comments, kids, by }) {
    return comments
      .filter(({ id }) => (kids ?? []).slice(0, 4).includes(id))
      .reduce(
        (ac, { text, time }) => ` ${ac}
        <li class="generic-list__item">
           <article class="comment">
             <p class="comment__info">
               <span>${by}</span>
               <span>${this.timeFormat(time)}</span>
             </p>
             <div>${text}</div>
            </article>
         </li>`,
        ''
      );
  }

  timeFormat(time) {
    const currentTimeMS = new Date().getTime();
    const currentTimesSec = currentTimeMS / 1000;
    const timeDifferenceMS = currentTimesSec - time;
    const timeDifferenceRoundMin = this.Math.round(timeDifferenceMS / 60);
    const timeDifferenceRoundHour = this.Math.round(timeDifferenceMS / 60 / 60);
    const timeDifferenceRoundDay = this.Math.round(
      timeDifferenceMS / 60 / 60 / 24
    );
    if (timeDifferenceRoundMin < 60) {
      return `${timeDifferenceRoundMin} min ago`;
    }
    if (timeDifferenceRoundHour >= 1 && timeDifferenceRoundHour < 24) {
      return `${timeDifferenceRoundHour} hour ago`;
    }
    return `${timeDifferenceRoundDay} days ago`;
  }

  produceNewsHtml({ news, comments }) {
    return news.reduce((acc, event) => {
      const {
        by,
        descendants,
        time: newsTime,
        title: newsTitle,
        score,
        url,
        kids,
      } = event;
      const commentsHtml = this.produceCommentsHtml({ comments, kids, by });
      const newsUrl = url ? new URL(url) : {};
      const { hostname = null } = newsUrl;
      const headingWithLink = `<a href="${url}">${newsTitle}</a>`;
      const source = url && hostname ? `<a href="${url}">${hostname}</a>` : '';

      return `${acc}
        <li class="generic-list__item">
          <article class="news">
            <header class="news__header">
              <h2  class="news__title">${
                hostname ? headingWithLink : newsTitle
              }</h2>
              ${source}
            </header>
            <footer>
              <span>${descendants}</span> points by
              <span>${by}</span>
              <span>${this.timeFormat(
                newsTime
              )}</span> | <!-- timestamp to readable date -->
              <button class="show-comments">${score} comments</button>
            </footer>
          </article>
          <ul class="generic-list generic-list--hidden comments-list">${commentsHtml}</ul>
             </li>`;
    }, '');
  }

  setInnerHtml(html) {
    const newsList = document.getElementById(this.id);
    newsList.innerHTML = html;
  }

  listenCommentBtnClick() {
    const commentsButtons = document.getElementsByClassName(this.btn);
    Array.from(commentsButtons).forEach((button) => {
      button.addEventListener('click', () => {
        const li = button.closest('.generic-list__item');
        const [ul] = Array.from(li.getElementsByClassName('comments-list'));
        ul.classList.toggle('generic-list--hidden');
      });
    });
  }
}
