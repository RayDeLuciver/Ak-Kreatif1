document.addEventListener('DOMContentLoaded', () => {
   
    const backgrounds = [
        'linear-gradient(to right, #8360c3, #2ebf91)',
        'linear-gradient(to right,rgb(159, 218, 227),rgb(223, 156, 206))',
        'linear-gradient(to right,rgb(160, 205, 235), #185a9d)',
        'linear-gradient(to right,rgb(185, 227, 165),rgb(218, 156, 221))'
    ];
    let current = 0;
    setInterval(() => {
        document.body.style.background = backgrounds[current];
        current = (current + 1) % backgrounds.length;
    }, 5000);

    
    const uploadInput = document.getElementById('uploadInput');
    const usernameInput = document.getElementById('usernameInput');
    const hashtagInput = document.getElementById('hashtagInput');
    const uploadButton = document.getElementById('uploadButton');
    const gallery = document.getElementById('gallery');

    
    const now = new Date().toLocaleString('id-ID');
    document.querySelectorAll('.time').forEach(el => {
        el.textContent = 'Upload: ' + now;
    });

    
    uploadButton.addEventListener('click', () => {
        const files = uploadInput.files;
        const username = usernameInput.value.trim();
        const hashtagsRaw = hashtagInput.value.trim();

        if (files.length === 0) {
            alert('Pilih gambar terlebih dahulu.');
            return;
        }
        if (!username) {
            alert('Masukkan nama pengguna.');
            return;
        }
        if (!hashtagsRaw) {
            alert('Masukkan hashtag.');
            return;
        }

        const hashtags = hashtagsRaw.split(',')
            .map(tag => '#' + tag.trim().replace(/^#/, ''))
            .join(' ');

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const card = document.createElement('div');
                card.className = 'card';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Uploaded Image';

                const cardContent = document.createElement('div');
                cardContent.className = 'card-content';

                const title = document.createElement('div');
                title.className = 'title';
                title.textContent = username;

                const desc = document.createElement('div');
                desc.className = 'desc';
                desc.textContent = 'Foto yang baru diunggah.';

                const hashtagsDiv = document.createElement('div');
                hashtagsDiv.className = 'hashtags';
                hashtagsDiv.textContent = hashtags;

                const timeDiv = document.createElement('div');
                timeDiv.className = 'time';
                timeDiv.textContent = 'Upload: ' + new Date().toLocaleString('id-ID');

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.textContent = 'Hapus';
                deleteButton.addEventListener('click', () => {
                    gallery.removeChild(card);
                });

                cardContent.appendChild(title);
                cardContent.appendChild(desc);
                cardContent.appendChild(hashtagsDiv);
                cardContent.appendChild(timeDiv);
                cardContent.appendChild(deleteButton);

                card.appendChild(img);
                card.appendChild(cardContent);

                gallery.prepend(card);
            };
            reader.readAsDataURL(file);
        });

        
        uploadInput.value = '';
        usernameInput.value = '';
        hashtagInput.value = '';
    });
});