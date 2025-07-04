const slides = [
  "img/fto1.jpg",
  "img/fto2.jpg",
  "img/fto3.jpg"
];

let index = 0;
let intervalID;

function tampilkanSlide(i) {
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.backgroundImage = `url('${slides[i]}')`;
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
  tampilkanUserGaleri();
});

function handleUserUpload(event) {
  event.preventDefault();

  const fileInput = document.getElementById("userFileInput");
  const namaInput = document.getElementById("userNamaInput");
  const hashtagInput = document.getElementById("userHashtagInput");

  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const url = reader.result;
    const nama = namaInput.value.trim();
    const hashtag = hashtagInput.value.trim();
    const tanggal = new Date().toLocaleDateString("id-ID", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    const data = JSON.parse(localStorage.getItem("galeri-user")) || [];
    data.push({ url, nama, hashtag, tanggal });
    localStorage.setItem("galeri-user", JSON.stringify(data));

    alert("Foto berhasil di-upload!");
    event.target.reset();
  };

  reader.readAsDataURL(file);
}

function tampilkanUserGaleri() {
  const container = document.getElementById("userGaleri");
  if (!container) return;
  const data = JSON.parse(localStorage.getItem("galeri-user")) || [];
  container.innerHTML = "";

  data.forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = `galeri-item ${item.hashtag}`;
    div.innerHTML = `
      <img src="${item.url}" alt="Foto" onclick="toggleInfo(this)" />
      <div class="info-foto">
        ${item.nama} <br>#${item.hashtag} <br>${item.tanggal} <br>
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

function hapusFoto(index) {
  const data = JSON.parse(localStorage.getItem("galeri-user")) || [];
  data.splice(index, 1);
  localStorage.setItem("galeri-user", JSON.stringify(data));
  tampilkanUserGaleri();
}
