//const name:Harsh Kumar ; const date = 21 May 2024

window.addEventListener("DOMContentLoaded", getImage);
const url = "https://picsum.photos/v2/list";
const myKey = "harsh";
const savedArray = [];

function getImage() {
  caches
    .open(myKey)
    .then((cache) => {
      return cache.keys();
    })
    .then(async (data) => {
      data.forEach(async (item) => {
        const cachedResponse = await caches.match(item);
        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          const imageUrl = URL.createObjectURL(blob);
          displayImage(imageUrl);
        }
      });

      await fetchAndCacheImage();
    })
    .catch((err) => console.error(err));
}

function displayImage(link) {
  const img = document.createElement("img");
  img.src = link;
  document.body.append(img);
}

async function fetchAndCacheImage() {
  try {
    let response = await fetch(url);
    const toJson = await response.json();
    const cacheName = await caches.open(myKey);

    for (const item of toJson) {
      const cachedResponse = await caches.match(item.download_url);
      if (!cachedResponse) {
        let blobResponse = await fetch(item.download_url);
        const toBlob = await blobResponse.blob();
        await cacheName.put(item.download_url, new Response(toBlob));
        const imageUrl = URL.createObjectURL(toBlob);
        displayImage(imageUrl);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
