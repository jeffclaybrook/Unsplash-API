function showLoader() {
    const loader = document.querySelector('.loader');
    loader.classList.add('visible');
    loader.innerHTML = `<div class="dots"></div>`;
    setTimeout(() => {
        loader.classList.remove('visible');
        loader.innerHTML = '';
        getMoreData();
    }, 2500);
}


function toggleImageLike() {
    const button = document.querySelector('.like-btn');
    const icon = button.querySelector('.material-symbols-rounded');
    button.classList.toggle('filled');
    button.classList.contains('filled') ?
    icon.style.fontVariationSettings = `'FILL' 1` :
    icon.style.fontVariationSettings = `'FILL' 0`
}


function downloadImage(image) {
    fetch(image)
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


function showToast(color) {
    const toast = document.querySelector('.toast');
    toast.classList.add('visible');
    toast.setAttribute('aria-hidden', false);
    toast.innerText = `Copied ${color}`;
    setTimeout(() => {
        toast.classList.remove('visible');
        toast.setAttribute('aria-hidden', true);
        toast.innerText = '';
    }, 2000);
}


function copyColor(color) {
    const clipboard = navigator.clipboard;
    clipboard.writeText(color)
    .then(() => showToast(color));
}


function closeDialog() {
    const body = document.body;
    const dialog = document.querySelector('dialog');
    body.style.overflow = 'auto';
    dialog.setAttribute('aria-hidden', true);
    dialog.classList.remove('expanded');
    dialog.innerHTML = '';
}


function openDialog(
    alt_description,
    color,
    created_at,
    height,
    likes,
    width,
    regular,
    first_name,
    last_name,
    location,
    name,
    username,
    medium,
    html
) {
    const body = document.body;
    const dialog = document.querySelector('dialog');
    body.style.overflow = 'hidden';
    dialog.setAttribute('aria-hidden', false);
    dialog.classList.add('expanded');
    dialog.innerHTML = `
    <div class="dialog-scrim"></div>
    <div class="dialog-container">
        <div class="dialog-header">
            <a href="${html}" target="_blank">
                <img src="${medium}" alt="${name}">
                <div class="column">
                    <h3>${first_name} ${last_name}</h3>
                    <p>${location}</p>
                </div>
            </a>
            <button aria-label="Close image" onclick="closeDialog()">
                <i class="material-symbols-rounded">close</i>
            </button>
        </div>
        <div class="dialog-content">
            <img alt="${alt_description}" style="aspect-ratio: ${width} / ${height}" src="${regular}">
        </div>
        <div class="dialog-footer">
            <div class="row">
                <button class="like-btn" onclick="toggleImageLike()">
                    <i class="material-symbols-rounded">favorite</i>
                </button>
                <button>
                    <i class="material-symbols-rounded">open_in_new</i>
                </button>
                <button onclick="copyColor('${color}')">
                    <i class="material-symbols-rounded" style="color: ${color}">launcher_assistant_on</i>
                </button>
                <button>
                    <i class="material-symbols-rounded">send</i>
                </button>
                <button onclick="downloadImage('${regular}')">
                    <i class="material-symbols-rounded">download</i>
                </button>
            </div>
            <h3>Likes ${likes}</h3>
            <h4><strong>${username}</strong> ${alt_description}</h4>
            <h5>${created_at}</h5>
        </div>
    </div>
    <div class="toast" aria-hidden="true"></div>
    `;
}


function createGalleryItems(data) {
    const items = data.map(item => {
        const {
            alt_description,
            color,
            created_at,
            height,
            likes,
            width
        } = item;
        const { regular } = item.urls;
        const {
            first_name,
            last_name,
            location,
            name,
            username,
            profile_image,
            links
        } = item.user;
        const { medium } = profile_image;
        const { html } = links;

        const formattedLikes = likes.toLocaleString('en-US');
        const formattedDate = new Date(created_at).toLocaleTimeString('en-US');
        const newLocation = location == null ? 'Austin, TX' : location;
        const newLastName = last_name == null ? '' : last_name;

        return `
        <li class="item" style="background-image: url('${regular}')" onclick="openDialog('${alt_description}', '${color}', '${formattedDate}', '${height}', '${formattedLikes}', '${width}', '${regular}', '${first_name}', '${newLastName}', '${newLocation}', '${name}', '${username}', '${medium}', '${html}')">
            <div class="item-footer">
                <div class="flex">
                    <img src="${medium}" alt="${name}">
                    <div class="column">
                        <h3>${first_name} ${newLastName}</h3>
                        <p>${username}</p>
                    </div>
                </div>
            </div>
        </li>
        `;
    }).join('');

    const gallery = document.querySelector('.gallery');
    gallery.innerHTML += `${items}`;
}


let query = 'dogs';
let page = 1;
const perPage = 15;
const accessKey = 'FdqySA3FQEWYn4fXMp_2hUfFpYH8vjw0y7mGHUHzAps';


async function getData(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        createGalleryItems(data.results);
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
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 15) {
        showLoader();
    }
})