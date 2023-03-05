let bookContainer = document.querySelector(".search");
let searchBooks = document.getElementById("search-box");

/** @start 添加元素 */
[
  { id: "dev-snippets", title: "Dev Snippets | 代码片段", icon: "" },
  { id: "fe-kits", title: "FE Kits | 大前端与 Web", icon: "" },
  { id: "be-kits", title: "BE Kits | 服务端架构", icon: "" },
  { id: "ai-kits", title: "AI Kits | 智能算法", icon: "" },
].forEach(({ id, title, icon }) => {
  document.addEventListener("DOMContentLoaded", () => {
    drawChartBook(id);
  });

  document.querySelector("#foryou").innerHTML =
    document.querySelector("#foryou").innerHTML +
    `
      <section id=${id} class="results">
        <div class="flex">
          <h1 class="section-title">${title}</h1>
          <div>
            <button id="${id}-prev" class="pagination prev" onclick="prev('${id}')">◀</button>
            <button id="${id}-next" class="pagination next" onclick="next('${id}')">▶</button>
          </div>
        </div>
        <div class="list-book ${id} categories">
          <div class='prompt'>
            <div class="loader"></div>
          </div>
        </div>
        <div class="fade left"></div>
        <div class="fade right"></div>
      </section>
  `;
});

/** @end 添加元素 */

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/** 执行书籍抓取 */
const getProjects = async (book) => {
  let data = [];

  switch (book) {
    case "dev-snippets": {
      data = [
        // Dev Snippets
        { user: "wx-chevalier", repo: "algorithm-snippets" },
        { user: "wx-chevalier", repo: "js-snippets" },
        { user: "wx-chevalier", repo: "design-pattern-snippets" },
        { user: "wx-chevalier", repo: "java-snippets" },
        { user: "wx-chevalier", repo: "go-snippets" },
        { user: "wx-chevalier", repo: "shell-scripts" },
        { user: "wx-chevalier", repo: "schema-hub-ts" },
        { user: "wx-chevalier", repo: "python-snippets" },
        { user: "wx-chevalier", repo: "data-vis-snippets" },
        { user: "wx-chevalier", repo: "coding-snippets" },
        { user: "wx-chevalier", repo: "plt-snippets" },
        { user: "wx-chevalier", repo: "vscode-snippets" },
        { user: "wx-chevalier", repo: "vscode-google-java-format-provider" },
      ];
      break;
    }
    case "fe-kits": {
      data = [
        // FE Kits
        { user: "wx-chevalier", repo: "fe-boilerplates" },
        { user: "wx-chevalier", repo: "legoble" },
        { user: "wx-chevalier", repo: "fractal-components" },
        { user: "wx-chevalier", repo: "m-fe-taro" },
        { user: "wx-chevalier", repo: "m-fe-configs" },
        { user: "wx-chevalier", repo: "m-fe-vtw" },
        { user: "wx-chevalier", repo: "m-fe-scaffold" },
        { user: "wx-chevalier", repo: "m-fe-rtw" },
        { user: "wx-chevalier", repo: "m-fe-libs" },
        { user: "wx-chevalier", repo: "m-fe-ssr" },
        { user: "wx-chevalier", repo: "m-fe-rm" },
        { user: "wx-chevalier", repo: "ueact" },
        { user: "wx-chevalier", repo: "ueme" },
        { user: "wx-chevalier", repo: "ueme-replay" },
        { user: "wx-chevalier", repo: "web-whiteboard" },
        { user: "wx-chevalier", repo: "uvc-live" },
        { user: "wx-chevalier", repo: "react-examples" },
        { user: "wx-chevalier", repo: "web-examples" },
        { user: "wx-chevalier", repo: "vue-examples" },
        { user: "wx-chevalier", repo: "node-examples" },
        { user: "wx-chevalier", repo: "nest-realworld-app" },
        { user: "wx-chevalier", repo: "redux-middlewares" },
        { user: "wx-chevalier", repo: "stl-tools" },
        { user: "wx-chevalier", repo: "xiddler" },
        { user: "wx-chevalier", repo: "AJER" },
        { user: "wx-chevalier", repo: "iotable" },
      ];
      break;
    }
    case "be-kits": {
      data = [
        { user: "wx-chevalier", repo: "horus-monitor" },
        { user: "wx-chevalier", repo: "k8s-examples" },
        { user: "wx-chevalier", repo: "sql-examples" },
        { user: "wx-chevalier", repo: "ioredisson" },
        { user: "wx-chevalier", repo: "Reinvent-Cloud-Native-Mall" },
        { user: "wx-chevalier", repo: "spring-examples" },
        { user: "wx-chevalier", repo: "grpc-examples" },
        { user: "wx-chevalier", repo: "devops-scripts" },
        { user: "wx-chevalier", repo: "Reinvent-DB" },
        { user: "wx-chevalier", repo: "UDLA" },
        { user: "wx-chevalier", repo: "Backend-Boilerplates" },
        { user: "wx-chevalier", repo: "mushi-chat" },
        { user: "wx-chevalier", repo: "xe-crawler" },
        { user: "wx-chevalier", repo: "Data-Fabric" },
        { user: "wx-chevalier", repo: "MEMI-Schema" },
        { user: "wx-chevalier", repo: "Cendertron" },
        { user: "wx-chevalier", repo: "Chaos-Scanner" },
        { user: "wx-chevalier", repo: "go-utils" },
        { user: "wx-chevalier", repo: "Reinvent-SSO" },
        { user: "wx-chevalier", repo: "Reinvent-RPC" },
        { user: "wx-chevalier", repo: "Reinvent-MQ" },
        { user: "wx-chevalier", repo: "SparkChain" },
        { user: "wx-chevalier", repo: "MEMI-I18n" },
        { user: "wx-chevalier", repo: "Focker" },
        { user: "wx-chevalier", repo: "winter-boot" },
      ];
      break;
    }
    case "ai-kits": {
      data = [];
      break;
    }
  }

  return { totalItems: data.length, items: data };
};

const drawChartBook = async (subject, startIndex = 0) => {
  let cbookContainer = document.querySelector(`.${subject}`);

  cbookContainer.innerHTML = `<div class='prompt'><div class="loader"></div></div>`;

  const cdata = await getProjects(subject);

  cbookContainer.innerHTML = cdata.items;
  cbookContainer.innerHTML = cdata.items
    .map(
      ({ user, repo }) =>
        `<div class="repo"><a href="https://github.com/${user}/${repo}"><img src="https://gh-card.dev/repos/${user}/${repo}.svg"></a></div>`
    )
    .join("");

  if (window.drawWidgets) {
    window.drawWidgets(document);
  }
};

const drawListBook = async () => {
  if (searchBooks.value != "") {
    bookContainer.style.display = "flex";
    bookContainer.innerHTML = `<div class='prompt'><div class="loader"></div></div>`;
    const data = await getProjects(`${searchBooks.value}&maxResults=6`);
    if (data.error) {
      bookContainer.innerHTML = `<div class='prompt'>ツ Limit exceeded! Try after some time</div>`;
    } else if (data.totalItems == 0) {
      bookContainer.innerHTML = `<div class='prompt'>ツ No results, try a different term!</div>`;
    } else if (data.totalItems == undefined) {
      bookContainer.innerHTML = `<div class='prompt'>ツ Network problem!</div>`;
    } else {
      bookContainer.innerHTML = data.items
        .map(
          ({ volumeInfo }) =>
            `<div class='book' style='background: linear-gradient(` +
            getRandomColor() +
            `, rgba(0, 0, 0, 0));'><a href='${volumeInfo.previewLink}' target='_blank'><img class='thumbnail' src='` +
            (volumeInfo.imageLinks.thumbnail === undefined
              ? "icons/logo.svg"
              : volumeInfo.imageLinks.thumbnail.replace(
                  "http://",
                  "https://"
                )) +
            `' alt='cover'></a><div class='book-info'><h3 class='book-title'><a href='${volumeInfo.previewLink}' target='_blank'>${volumeInfo.title}</a></h3><div class='book-authors' onclick='updateFilter(this,"author");'>${volumeInfo.authors}</div><div class='info' onclick='updateFilter(this,"subject");' style='background-color: ` +
            getRandomColor() +
            `;'>` +
            (volumeInfo.categories === undefined
              ? "Others"
              : volumeInfo.categories) +
            `</div></div></div>`
        )
        .join("");
    }
  } else {
    bookContainer.style.display = "none";
  }
};
const updateFilter = ({ innerHTML }, f) => {
  document.getElementById("main").scrollIntoView({
    behavior: "smooth",
  });
  let m;
  switch (f) {
    case "author":
      m = "inauthor:";
      break;
    case "subject":
      m = "subject:";
      break;
  }
  searchBooks.value = m + innerHTML;
  debounce(drawListBook, 1000);
};
const debounce = (fn, time, to = 0) => {
  to ? clearTimeout(to) : (to = setTimeout(drawListBook, time));
};
searchBooks.addEventListener("input", () => debounce(drawListBook, 1000));

let mainNavLinks = document.querySelectorAll(".scrolltoview");
window.addEventListener("scroll", (event) => {
  let fromTop = window.scrollY + 64;
  mainNavLinks.forEach(({ hash, classList }) => {
    if (!hash) {
      return;
    }

    let section = document.querySelector(hash);

    if (
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop
    ) {
      classList.add("current");
    } else {
      classList.remove("current");
    }
  });
});
const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}40`;
const toggleSwitch = document.querySelector(
  '.theme-switch input[type="checkbox"]'
);
if (localStorage.getItem("marcdownTheme") == "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
  document
    .querySelector("meta[name=theme-color]")
    .setAttribute("content", "#090b28");
  toggleSwitch.checked = true;
  localStorage.setItem("marcdownTheme", "dark");
} else {
  document.documentElement.setAttribute("data-theme", "light");
  document
    .querySelector("meta[name=theme-color]")
    .setAttribute("content", "#ffffff");
  toggleSwitch.checked = false;
  localStorage.setItem("marcdownTheme", "light");
}
const switchTheme = ({ target }) => {
  if (target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    document
      .querySelector("meta[name=theme-color]")
      .setAttribute("content", "#090b28");
    localStorage.setItem("marcdownTheme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    document
      .querySelector("meta[name=theme-color]")
      .setAttribute("content", "#ffffff");
    localStorage.setItem("marcdownTheme", "light");
  }
};
toggleSwitch.addEventListener("change", switchTheme, false);
let startIndex = 0;
const next = (subject) => {
  startIndex += 6;
  if (startIndex >= 0) {
    document.getElementById(`${subject}-prev`).style.display = "inline-flex";
    drawChartBook(subject, startIndex);
  } else {
    document.getElementById(`${subject}-prev`).style.display = "none";
  }
};
const prev = (subject) => {
  startIndex -= 6;
  if (startIndex <= 0) {
    startIndex = 0;
    drawChartBook(subject, startIndex);
    document.getElementById(`${subject}-prev`).style.display = "none";
  } else {
    document.getElementById(`${subject}-prev`).style.display = "inline-flex";
    drawChartBook(subject, startIndex);
  }
};

let pwaInstalled = localStorage.getItem("pwaInstalled") == "yes";
if (window.matchMedia("(display-mode: standalone)").matches) {
  localStorage.setItem("pwaInstalled", "yes");
  pwaInstalled = true;
}
if (window.navigator.standalone === true) {
  localStorage.setItem("pwaInstalled", "yes");
  pwaInstalled = true;
}
if (pwaInstalled) {
  document.getElementById("installPWA").style.display = "none";
} else {
  document.getElementById("installPWA").style.display = "inline-flex";
}
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  deferredPrompt = e;
});
async function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(({ outcome }) => {
      if (outcome === "accepted") {
        console.log("Your PWA has been installed");
      } else {
        console.log("User chose to not install your PWA");
      }
      deferredPrompt = null;
    });
  }
}
window.addEventListener("appinstalled", (evt) => {
  localStorage.setItem("pwaInstalled", "yes");
  pwaInstalled = true;
  document.getElementById("installPWA").style.display = "none";
});
