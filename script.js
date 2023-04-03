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
    icon.style.fontVariationSettings = `'FILL' 1, 'wght' 300` :
    icon.style.fontVariationSettings = `'FILL' 0, 'wght' 300`
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


function showToast(hex) {
    const toast = document.querySelector('.toast');
    toast.classList.add('active');
    toast.setAttribute('aria-hidden', 'false');
    toast.innerText = `Copied HEX code: ${hex}`;
    setTimeout(() => {
        toast.classList.remove('active');
        toast.setAttribute('aria-hidden', 'true');
        toast.innerText = '';
    }, 2000);
}


function copyPalette(palette) {
    const color = palette;
    navigator.clipboard.writeText(color)
    .then(() => showToast(color))
}


function closeDialog() {
    const body = document.body;
    const dialog = document.querySelector('dialog');
    body.style.overflow = 'auto';
    dialog.setAttribute('aria-hidden', 'true');
    dialog.classList.remove('expanded');
    dialog.querySelector('.dialog-container').innerHTML = '';
}


function openDialog(
    alt_description,
    color,
    created_at,
    height,
    likes,
    width,
    regular,
    raw,
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
    dialog.setAttribute('aria-hidden', 'false');
    dialog.classList.add('expanded');
    dialog.querySelector('.dialog-container').innerHTML += `
    <div class="dialog-header">
        <a href="${html}" target="_blank" aria-label="View portfolio">
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
            <div class="column">
                <button class="like-btn" onclick="toggleImageLike()" aria-label="Toggle image like">
                    <i class="material-symbols-rounded">favorite</i>
                </button>
            </div>
            <div class="column">
                <a href="${raw}" target="_blank" aria-label="Open image in new tab">
                    <i class="material-symbols-rounded">open_in_new</i>
                </a>
            </div>
            <div class="column">
                <button onclick="copyPalette('${color}')" aria-label="Copy HEX code">
                    <i class="material-symbols-rounded" style="color: ${color}">launcher_assistant_on</i>
                </button>
            </div>
            <div class="column">
                <button aria-label="Share image">
                    <i class="material-symbols-rounded">send</i>
                </button>
            </div>
            <div class="column">
                <button onclick="downloadImage('${regular}')" aria-label="Download image">
                    <i class="material-symbols-rounded">download</i>
                </button>
            </div>
        </div>
        <h3>Likes ${likes}</h3>
        <h4><strong>${username}</strong> ${alt_description}</h4>
        <h5>${created_at}</h5>
    </div>
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
            width,
            urls,
            user
        } = item;
        const {
            first_name,
            last_name,
            location,
            name,
            username,
            profile_image,
            links
        } = user;

        const { regular, raw } = urls;
        const { medium } = profile_image;
        const { html } = links;

        const formattedLikes = likes.toLocaleString('en-US');
        const formattedDate = new Date(created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const newLocation = location == null ? 'Austin, TX' : location;
        const newLastName = last_name == null ? '' : last_name;

        return `
        <li class="item" style="background-image: url('${regular}')" onclick="openDialog('${alt_description}', '${color}', '${formattedDate}', '${height}', '${formattedLikes}', '${width}', '${regular}', '${raw}', '${first_name}', '${newLastName}', '${newLocation}', '${name}', '${username}', '${medium}', '${html}')">
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
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 30) {
        showLoader();
    }
})