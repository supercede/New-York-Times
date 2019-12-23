function getArticle() {
  let api =
    "https://api.nytimes.com/svc/topstories/v2/science.json?api-key=feSlwCkqBfeYPN0b9NlV4GAargTv5bZn";
  fetch(api)
    .then(response => response.json())
    .then(data => {
      try {
        const { results } = data;
        // console.log(results);
        displayArticle(results);
        formatLead();
      } catch (err) {
        console.error(err);
        const error = document.getElementById("error");
        error.style.display = "block";
      }
    });
}

function displayArticle(params) {
  let articles = shuffleArticles(params);
  articles = articles.slice(0, 16);
  let html = "";
  articles.forEach((article, i) => {
    // if (article.multimedia[article.multimedia.length - 1] !== undefined) {
    if (article.multimedia.length > 0) {
      if (i === 0) {
        img = article.multimedia[article.multimedia.length - 1];
      } else {
        img = article.multimedia[3];
      }
      url = img.url;
      caption = img.caption;
    } else {
      img = "";
      url = "../images/nyt_logo.png";
      caption = "";
    }
    // console.log(img);
    html += `<section class="news-item">
      <a href='${article.url}' rel="noopener noreferrer" target='_blank'>
      <figure>
        <img src="${url}" alt='${caption}' title='${caption}'/>
       
      </figure>
      <div class="para">
        <h2>
          ${article.title}
            </h2></a>
        <p class="info">
          <span class="author">${article.byline} </span> |
          <span class="section">${article.section}</span>
        </p>
        <p> ${article.abstract} </p>
      </div>
    </section>`;
  });
  document.getElementById("content").innerHTML = html;
}

function shuffleArticles(articles) {
  let curr = articles.length;
  let temp;
  let random;

  for (curr = articles.length - 1; curr > 0; curr--) {
    random = Math.floor(Math.random() * (curr + 1));
    temp = articles[curr];
    articles[curr] = articles[random];
    articles[random] = temp;
  }
  return articles;
}

function formatLead() {
  let lead = document.querySelector(".news-item");
  let fig = lead.querySelector("figure");
  let para = lead.querySelector(".para");
  lead.classList.remove("news-item");
  lead.setAttribute("id", "lead-content");

  fig.setAttribute("id", "lead-image");
  para.setAttribute("id", "lead-para");
}

getArticle();
