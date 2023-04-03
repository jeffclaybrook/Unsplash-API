function showLoader() {
    const loader = document.querySelector('.loader');
    loader.classList.add('visible');
    loader.innerHTML = `<div class="dots"></div>`;
    setTimeout(() => {
        loader.classList.remove('visible');
        loader.innerHTML = '';
        getMoreData();
    }, 2000);
}

function toggleImageLike() {
    const button = document.querySelector('.like-btn');
    const icon = button.querySelector('.material-symbols-rounded');
    button.classList.toggle('filled');
    button.classList.contains('filled') ?
    icon.style.fontVariationSettings = `'FILL' 1, 'wght' 300` :
    icon.style.fontVariationSettings = `'FILL' 0, 'wght' 300`
}

function downloadImage(j) {
    fetch(j)
    .then(res => res.blob())
    .then(blob => {
        const body = document.body;
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.download = new Date().getTime();
        body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    }).catch(() => console.log('Failed to download image'));
}

function showToast(k) {
    const toast = document.querySelector('.toast');
    toast.classList.add('active');
    toast.setAttribute('aria-hidden', 'false');
    toast.innerText = `Copied HEX code: ${k}`;
    setTimeout(() => {
        toast.classList.remove('active');
        toast.setAttribute('aria-hidden', 'true');
        toast.innerText = '';
    }, 2000);
}

function copyPalette(palette) {
    navigator.clipboard.writeText(palette)
    .then(() => showToast(palette))
}

function closeDialog() {
    const body = document.body;
    const dialog = document.querySelector('dialog');
    body.style.overflow = 'auto';
    dialog.setAttribute('aria-hidden', 'true');
    dialog.classList.remove('expanded');
    dialog.querySelector('.dialog-container').innerHTML = '';
}

function openDialog(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
    const body = document.body;
    const dialog = document.querySelector('dialog');
    body.style.overflow = 'hidden';
    dialog.setAttribute('aria-hidden', 'false');
    dialog.classList.add('expanded');
    dialog.querySelector('.dialog-container').innerHTML += `
    <div class="dialog-header">
        <a href="${o}" target="_blank" aria-label="View portfolio">
            <img src="${n}" alt="${l}">
            <div class="column">
                <h3>${i} ${j}</h3>
                <p>${k}</p>
            </div>
        </a>
        <button aria-label="Close image" onclick="closeDialog()">
            <i class="material-symbols-rounded">close</i>
        </button>
    </div>
    <div class="dialog-content">
        <img alt="${a}" style="aspect-ratio: ${f} / ${d}" src="${g}">
    </div>
    <div class="dialog-footer">
        <div class="row">
            <div class="column">
                <button class="like-btn" onclick="toggleImageLike()" aria-label="Toggle image like">
                    <i class="material-symbols-rounded">favorite</i>
                </button>
            </div>
            <div class="column">
                <a href="${h}" target="_blank" aria-label="Open image in new tab">
                    <i class="material-symbols-rounded">open_in_new</i>
                </a>
            </div>
            <div class="column">
                <button onclick="copyPalette('${b}')" aria-label="Copy HEX code">
                    <i class="material-symbols-rounded" style="color: ${b}">launcher_assistant_on</i>
                </button>
            </div>
            <div class="column">
                <button aria-label="Share image">
                    <i class="material-symbols-rounded">send</i>
                </button>
            </div>
            <div class="column">
                <button onclick="downloadImage('${g}')" aria-label="Download image">
                    <i class="material-symbols-rounded">download</i>
                </button>
            </div>
        </div>
        <h3>${e} likes</h3>
        <h4><strong>${m}</strong> ${a}</h4>
        <h5>${c}</h5>
    </div>
    `;
}

function createGalleryItems(data) {
    const items = data.map(item => {
        const { alt_description, color, created_at, height, likes, width, urls, user } = item;
        const { first_name, last_name, location, name, username, profile_image, links } = user;
        const { regular, raw } = urls;
        const { medium } = profile_image;
        const { html } = links;

        const formattedLikes = likes.toLocaleString('en-US');
        const formattedDate = new Date(created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const newLocation = location == null ? 'Austin, TX' : location;
        const newLastName = last_name == null ? '' : last_name;

        const a = alt_description;
        const b = color;
        const c = formattedDate;
        const d = height;
        const e = formattedLikes;
        const f = width;
        const g = regular;
        const h = raw;
        const i = first_name;
        const j = newLastName;
        const k = newLocation;
        const l = name;
        const m = username;
        const n = medium;
        const o = html;

        return `
        <li class="item" style="background-image: url('${g}')" onclick="openDialog('${a}', '${b}', '${c}', '${d}', '${e}', '${f}', '${g}', '${h}', '${i}', '${j}', '${k}', '${l}', '${m}', '${n}', '${o}')">
            <div class="item-footer">
                <div class="flex">
                    <img src="${n}" alt="${l}">
                    <div class="column">
                        <h3>${i} ${j}</h3>
                        <p>${m}</p>
                    </div>
                </div>
            </div>
        </li>
        `;
    }).join('');

    const gallery = document.querySelector('.gallery');
    gallery.innerHTML += `${items}`;
}

let query = 'skyscraper';
let page = 1;
const perPage = 15;
const accessKey = 'FdqySA3FQEWYn4fXMp_2hUfFpYH8vjw0y7mGHUHzAps';

async function getData(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        const items = data.results;
        createGalleryItems(items);
    } catch {
        console.log('Error fetching images');
    }
}

async function getMoreData() {
    page++;
    const url = `https://api.unsplash.com/search/photos/?client_id=${accessKey}&query=${query}&page=${page}&per_page=${perPage}`;
    getData(url);
}

getData(`https://api.unsplash.com/search/photos/?client_id=${accessKey}&query=${query}&page=${page}&per_page=${perPage}`)

window.addEventListener('scroll', () => {
    if (
        window.scrollY +
        window.innerHeight >=
        document.body.offsetHeight - 15.5
    ) {
        showLoader();
    }
})