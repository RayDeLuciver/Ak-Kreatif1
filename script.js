const slides = [
  "foto1.jpg",
  "foto2.jpg",
  "foto3.jpg"
];

let index = 0;
let intervalID;

function tampilkanSlide(i) {
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.backgroundImage = `url('img/img/${slides[i]}')`;
  }
}

function mulaiSlideOtomatis() {
  intervalID = setInterval(() => {
    index = (index + 1) % slides.length;
    tampilkanSlide(index);
  }, 5000);
}

function slideSebelumnya() {
  index = (index - 1 + slides.length) % slides.length;
  tampilkanSlide(index);
  resetInterval();
}

function slideSelanjutnya() {
  index = (index + 1) % slides.length;
  tampilkanSlide(index);
  resetInterval();
}

function resetInterval() {
  clearInterval(intervalID);
  mulaiSlideOtomatis();
}

window.addEventListener("load", () => {
  tampilkanSlide(index);
  mulaiSlideOtomatis();
  tampilkanGaleriDariStorage();
});

function tampilkanGaleriDariStorage() {
  const container = document.getElementById("uploadGaleri");
  if (!container) return;

  const data = JSON.parse(localStorage.getItem("galeri-data")) || [];
  container.innerHTML = "";

  data.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = `galeri-item ${item.hashtag}`;
    div.innerHTML = `
      <img src="${item.url}" alt="Foto" onclick="toggleInfo(this)" />
      <div class="info-foto" style="display:none">
        ${item.nama} <br>#${item.hashtag} <br>Tanggal: ${item.tanggal} <br>
        <button onclick="hapusFoto(${idx})">Hapus</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function toggleInfo(imgElement) {
  const info = imgElement.nextElementSibling;
  info.style.display = info.style.display === "none" ? "block" : "none";
}

function handleUpload(event) {
  event.preventDefault();

  const fileInput = document.getElementById("fileInput");
  const namaInput = document.getElementById("namaInput");
  const hashtagInput = document.getElementById("hashtagInput");

  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const url = reader.result;
    const nama = namaInput.value.trim() || "Tidak diketahui";
    const hashtag = hashtagInput.value.trim() || "umum";
    const tanggal = new Date().toLocaleDateString("id-ID", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    const data = JSON.parse(localStorage.getItem("galeri-data")) || [];
    data.push({ url, nama, hashtag, tanggal });
    localStorage.setItem("galeri-data", JSON.stringify(data));

    alert("Foto berhasil diupload!");
    window.location.href = "index.html#galeri";
  };

  reader.readAsDataURL(file);
}

function hapusFoto(index) {
  const data = JSON.parse(localStorage.getItem("galeri-data")) || [];
  data.splice(index, 1);
  localStorage.setItem("galeri-data", JSON.stringify(data));
  tampilkanGaleriDariStorage();
}
