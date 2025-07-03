// Jam upload otomatis
const now = new Date();
const timeString = now.toLocaleString('id-ID');
document.getElementById('time1').textContent = 'Upload: ' + timeString;
document.getElementById('time2').textContent = 'Upload: ' + timeString;
document.getElementById('time3').textContent = 'Upload: ' + timeString;
document.getElementById('time4').textContent = 'Upload: ' + timeString;

// Background otomatis berganti
const backgrounds = [
    'linear-gradient(to right, #8360c3, #2ebf91)',
    'linear-gradient(to right,rgb(159, 218, 227),rgb(223, 156, 206))',
    'linear-gradient(to right, #43cea2, #185a9d)',
    'linear-gradient(to right,rgb(185, 227, 165),rgb(183, 171, 118))'
];
let current = 0;
setInterval(() => {
    document.body.style.background = backgrounds[current];
    current = (current + 1) % backgrounds.length;
}, 5000);