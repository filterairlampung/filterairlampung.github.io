document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. INJEKSI HEADER & FOOTER OTOMATIS
    // ==========================================
    const siteHeader = document.querySelector(".site-header");
    const siteFooter = document.querySelector(".site-footer");

    // Tentukan jalur relatif (apakah berada di folder utama atau di dalam subfolder seperti damiu/ & filter-air/)
    const isInSubfolder = window.location.pathname.includes('/damiu/') || 
                      window.location.pathname.includes('/filter-air/') || 
                      window.location.pathname.includes('/toko/') || 
                      window.location.pathname.includes('/tangki/') ||
                      window.location.pathname.includes('/info/');
    const basePath = isInSubfolder ? "../" : "";

    if (siteHeader) {
        siteHeader.innerHTML = `
            <div class="header-container">
                <div class="menu-toggle" id="mobile-menu">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>

                <a href="${basePath}index.html" class="logo-link">
                    <img src="${basePath}images/logo-alkautsar.png" alt="Logo Al-Kautsar Bumindo" class="logo-img">
                </a>

                <nav class="main-nav">
                    <div class="sidebar-header-text">
                        Al-Kautsar Filter Air Bumindo
                    </div>
                    <ul class="nav-menu">
                        <li><a href="${basePath}index.html">Beranda</a></li>
                        
                        <!-- MENU 1: INSTALASI DAMIU -->
                        <li class="has-dropdown">
                            <a href="#">Instalasi DAMIU <span class="arrow">▼</span></a>
                            <ul class="dropdown-menu">
                                <li><a href="${basePath}damiu/katalog.html"><strong>📋 Lihat Semua Katalog DAMIU</strong></a></li>
                                <li class="has-sub-dropdown">
                                    <a href="${basePath}damiu/katalog.html#mineral">Paket DAMIU Mineral <span class="sub-arrow">▸</span></a>
                                    <ul class="sub-dropdown-menu">
                                        <li><a href="${basePath}damiu/detail-mineral-ekonomis.html">Paket Mineral Ekonomis</a></li>
                                        <li><a href="${basePath}damiu/detail-mineral-premium.html">Paket Mineral Premium</a></li>
                                        <li><a href="${basePath}damiu/detail-mineral-sultan.html">Paket Mineral Sultan</a></li>
                                    </ul>
                                </li>
                                <li class="has-sub-dropdown">
                                    <a href="${basePath}damiu/katalog.html#kombinasi">Paket Kombinasi (Mineral + RO) <span class="sub-arrow">▸</span></a>
                                    <ul class="sub-dropdown-menu">
                                        <li><a href="${basePath}damiu/detail-kombinasi-200.html">Kombinasi RO 200 GPD</a></li>
                                        <li><a href="${basePath}damiu/detail-kombinasi-500.html">Kombinasi RO 500 GPD</a></li>
                                        <li><a href="${basePath}damiu/detail-kombinasi-1000.html">Kombinasi RO 1000 GPD</a></li>
                                    </ul>
                                </li>
                                <li class="has-sub-dropdown">
                                    <a href="${basePath}damiu/katalog.html#ro">Mesin Khusus RO <span class="sub-arrow">▸</span></a>
                                    <ul class="sub-dropdown-menu">
                                        <li><a href="${basePath}damiu/detail-ro-200.html">Khusus RO 200 GPD</a></li>
                                        <li><a href="${basePath}damiu/detail-ro-500.html">Khusus RO 500 GPD</a></li>
                                        <li><a href="${basePath}damiu/detail-ro-1000.html">Khusus RO 1000 GPD</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                        <!-- MENU 2: INSTALASI FILTER AIR -->
                        <li class="has-dropdown">
                            <a href="#">Instalasi Filter Air <span class="arrow">▼</span></a>
                            <ul class="dropdown-menu">
                                <li><a href="${basePath}filter-air/katalog.html"><strong>📋 Lihat Semua Katalog Filter</strong></a></li>
                                <li class="has-sub-dropdown">
                                    <a href="${basePath}filter-air/katalog.html#rumah-tangga">Filter Air Rumah Tangga <span class="sub-arrow">▸</span></a>
                                    <ul class="sub-dropdown-menu">
                                        <li><a href="${basePath}filter-air/detail-basic.html">Paket Basic (Air Keruh)</a></li>
                                        <li><a href="${basePath}filter-air/detail-premium.html">Paket Premium (Air Kuning)</a></li>
                                        <li><a href="${basePath}filter-air/detail-eksklusif.html">Paket Eksklusif (Keruh & Bau)</a></li>
                                        <li><a href="${basePath}filter-air/detail-sultan.html">Paket Sultan (Garansi Tuntas)</a></li>
                                    </ul>
                                </li>
                                <li><a href="${basePath}filter-air/katalog.html#wtp">Filter Air Industri (WTP)</a></li>
                                <li><a href="${basePath}filter-air/katalog.html#ganti-media">Jasa Penggantian Media</a></li>
                            </ul>
                        </li>

                        <!-- MENU 3: PRODUK (DINAMIS DARI GOOGLE SHEETS) -->
                        <li class="has-dropdown">
                            <a href="${basePath}toko/katalog.html">Produk <span class="arrow">▼</span></a>
                            <ul class="dropdown-menu" id="nav-kategori-produk">
                                <li><a href="${basePath}toko/katalog.html"><strong>🔥 Paling Banyak Dipesan</strong></a></li>
                                <li><a href="${basePath}toko/katalog.html?kategori=semua"><strong>📦 Semua Produk</strong></a></li>
                            </ul>
                        </li>

                        <!-- MENU PESAN AIR TANGKI -->
                        <li><a href="${basePath}tangki/katalog.html">Pesan Air Tangki</a></li>

                        <!-- MENU 4: INFO -->
                        <li class="has-dropdown">
                            <a href="#">Info <span class="arrow">▼</span></a>
                            <ul class="dropdown-menu">
                                <li><a href="${basePath}info/info.html">Profil Perusahaan</a></li>
                                <li><a href="${basePath}info/portofolio.html">Portofolio Pemasangan</a></li>
                                <li><a href="${basePath}info/testimoni.html">Testimoni Pelanggan</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>

                <a href="https://wa.me/6281211108724" class="btn-hubungi" target="_blank">Hubungi Kami</a>
            </div>
        `;
    }

    if (siteFooter) {
        siteFooter.innerHTML = `
            <div class="footer-main">
                <div class="footer-brand">
                    <img src="${basePath}images/logo-alkautsar.png" alt="Logo Al-Kautsar Bumindo" class="footer-logo">
                    <p>Spesialis jasa pemasangan depot air minum, water treatment, dan instalasi filter tabung FRP se-Provinsi Lampung. Solusi pasti untuk air jernih dan sehat.</p>
                </div>
                <div class="social-links">
                    <!-- Logo Facebook -->
                    <a href="#" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); return false;" title="Facebook Al-Kautsar" aria-label="Facebook">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 320 512" fill="currentColor">
                            <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                        </svg>
                    </a>

                    <!-- Logo TikTok -->
                    <a href="#" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); return false;" title="TikTok Al-Kautsar" aria-label="TikTok">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 448 512" fill="currentColor">
                            <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                        </svg>
                    </a>

                    <!-- Logo Instagram -->
                    <a href="#" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); return false;" title="Instagram Al-Kautsar" aria-label="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 448 512" fill="currentColor">
                            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                        </svg>
                    </a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Al-Kautsar Filter Air Bumindo. All Rights Reserved.</p>
                <a href="#" class="scroll-top" title="Kembali ke atas">↑</a>
            </div>
        `;
    }

    // ==========================================
    // 2. LOGIKA INTERAKSI MENU (HAMBURGER & DROPDOWN)
    // ==========================================
    const mobileMenu = document.getElementById('mobile-menu');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenu && mainNav) {
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
            this.classList.toggle('is-active');
        });

        document.addEventListener('click', function(e) {
            if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !mobileMenu.contains(e.target)) {
                mainNav.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenu.classList.remove('is-active');
            }
        });
    }

    // Dropdown Tingkat 1 (Mobile)
    const dropdowns = document.querySelectorAll('.has-dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector(':scope > a');
        if (link) {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                    e.preventDefault();
                }
                dropdown.classList.toggle('active');
                const arrow = this.querySelector('.arrow');
                if (arrow) {
                    arrow.innerHTML = dropdown.classList.contains('active') ? '▲' : '▼';
                }
            });
        }
    });

    // Sub-Dropdown Tingkat 2 (Mobile)
    const subDropdowns = document.querySelectorAll('.has-sub-dropdown');
    subDropdowns.forEach(subDropdown => {
        const subLink = subDropdown.querySelector(':scope > a');
        if (subLink) {
            subLink.addEventListener('click', function(e) {
                e.stopPropagation();
                if (this.getAttribute('href') === '#' || this.getAttribute('href') === '') {
                    e.preventDefault();
                }
                subDropdown.classList.toggle('active');
                const subArrow = this.querySelector('.sub-arrow');
                if (subArrow) {
                    subArrow.innerHTML = subDropdown.classList.contains('active') ? '▾' : '▸';
                }
            });
        }
    });
    // ==========================================
    // 3. FITUR PENCARIAN DI BERANDA (MENGARAH KE TOKO)
    // ==========================================
    const inputCariUtama = document.getElementById("input-pencarian-utama");
    const btnCariUtama = document.getElementById("btn-cari-utama");

    function arahkanKeToko() {
        if (inputCariUtama && inputCariUtama.value.trim() !== "") {
            const kataKunci = encodeURIComponent(inputCariUtama.value.trim());
            // Gunakan basePath agar aman jika kolom search ini suatu saat dipasang di halaman lain
            window.location.href = `${basePath}toko/katalog.html?cari=${kataKunci}`;
        }
    }

    if (btnCariUtama) {
        btnCariUtama.addEventListener("click", arahkanKeToko);
    }

    if (inputCariUtama) {
        inputCariUtama.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                arahkanKeToko();
            }
        });
    }
});// ==========================================
// 4. LOGIKA FORM KONSULTASI & PENGINGAT (INDEX.HTML)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const formKonsultasi = document.getElementById("form-konsultasi-utama");
    
    // URL Web App Google Apps Script Anda (Ganti dengan URL hasil Deploy di Langkah 2)
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyvCrVdW96MpZRwurjSVUo5BN6K4nRbkMqLqFE7I3_WmYwieNhsSdHqh_PoYfUSLw4o/exec"; 
    const NOMOR_WA_ADMIN = "6281211108724";

    if (formKonsultasi) {
        formKonsultasi.addEventListener("submit", function(e) {
            e.preventDefault();

            const nama = document.getElementById("reg-nama").value.trim();
            const sumber = document.getElementById("reg-sumber").value;
            const wa = document.getElementById("reg-wa").value.trim();
            const email = document.getElementById("reg-email").value.trim();
            const kota = document.getElementById("reg-kota").value;
            const kebutuhan = document.getElementById("reg-kebutuhan").value;
            const catatan = document.getElementById("reg-catatan").value.trim();

            if (!nama || !sumber || !wa || !kota || !kebutuhan || !catatan) {
                alert("Mohon lengkapi semua kolom bertanda bintang (*).");
                return;
            }

            const dataPayload = { nama, sumber, wa, email, kota, kebutuhan, catatan };

            // 1. Kirim data ke Google Sheets di balik layar (Background Fetch)
            if (WEB_APP_URL && WEB_APP_URL !== "https://script.google.com/macros/s/AKfycbyWB1q-8Y_jFzD-Jq_2r_SVtXdwtwC47IkQ-n1FCO5F_W_QEjFErAsfiT7AjZ3b1dA4/exec") {
                fetch(WEB_APP_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataPayload)
                }).catch(err => console.log("Catatan sinkronisasi sheets:", err));
            }

            // 2. Rangkai pesan rapi untuk langsung membuka WhatsApp Admin
            let pesanWA = `Halo Admin *Al-Kautsar Bumindo*, saya ingin berkonsultasi mengenai masalah air dan mendaftar layanan pengingat:\n\n`;
            pesanWA += `*DATA KONSULTASI & PENGINGAT:*\n`;
            pesanWA += `• *Nama:* ${nama}\n`;
            pesanWA += `• *WhatsApp:* ${wa}\n`;
            pesanWA += `• *Email:* ${email ? email : '-'}\n`;
            pesanWA += `• *Domisili:* ${kota} (Lampung)\n`;
            pesanWA += `• *Info Dari:* ${sumber}\n`;
            pesanWA += `• *Kebutuhan:* ${kebutuhan}\n`;
            pesanWA += `• *Detail Masalah Air / Catatan:* ${catatan}\n\n`;
            pesanWA += `Mohon bantuannya untuk konsultasi lebih lanjut. Terima kasih!`;

            const urlWA = `https://wa.me/${NOMOR_WA_ADMIN}?text=${encodeURIComponent(pesanWA)}`;
            
            // Berikan sedikit jeda sukses lalu buka WhatsApp
            alert("Terima kasih! Data Anda telah tercatat dan pengingat aktif. Anda akan diarahkan ke WhatsApp Admin.");
            window.open(urlWA, "_blank");
            
            // Reset form
            formKonsultasi.reset();
        });
    }
});
// ==========================================
// 5. SINKRONISASI KATEGORI HEADER DARI GOOGLE SHEETS
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Tempelkan link Google Sheets katalog-produk Anda di sini:
    const SHEET_KATALOG_URL = "https://docs.google.com/spreadsheets/d/1agFOJb55H9IF1i7Cqn7Bbj4tMTcTNgrR7b3sHtpVJQM/edit?usp=sharing";
    const navDropdown = document.getElementById("nav-kategori-produk");
    if (!navDropdown) return;

    // Deteksi apakah halaman saat ini berada di dalam subfolder
    const inSub = window.location.pathname.includes('/damiu/') || 
                  window.location.pathname.includes('/filter-air/') || 
                  window.location.pathname.includes('/toko/') || 
                  window.location.pathname.includes('/tangki/') || 
                  window.location.pathname.includes('/info/');
    const prefixPath = inSub ? "../" : "";

    // Kategori cadangan jika link belum diisi atau internet pengguna sedang lambat
    const kategoriCadangan = [
        "Tutup Galon", "Galon", "Filter", "Segel", 
        "Kran", "UV", "Umum", "Housing", "Mesin", "Pasir", "RO"
    ];

    function renderMenuKategori(daftarKategori) {
        let html = `
            <li><a href="${prefixPath}toko/katalog.html"><strong>🔥 Paling Banyak Dipesan</strong></a></li>
            <li><a href="${prefixPath}toko/katalog.html?kategori=semua"><strong>📦 Semua Produk</strong></a></li>
            <li class="nav-divider"></li>
        `;

        daftarKategori.forEach(kat => {
            const urlKategori = `${prefixPath}toko/katalog.html?kategori=${encodeURIComponent(kat)}`;
            html += `<li><a href="${urlKategori}">${kat}</a></li>`;
        });

        navDropdown.innerHTML = html;
    }

    // Tampilkan dari memori sementara (sessionStorage) terlebih dahulu agar instan saat pindah halaman
    const cacheKategori = sessionStorage.getItem("alkautsar_kategori_nav");
    if (cacheKategori) {
        try {
            renderMenuKategori(JSON.parse(cacheKategori));
        } catch (e) {
            renderMenuKategori(kategoriCadangan);
        }
    } else {
        renderMenuKategori(kategoriCadangan);
    }

    // Tarik data terbaru dari Google Sheets di balik layar
    const matchId = SHEET_KATALOG_URL.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (matchId && matchId[1]) {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${matchId[1]}/gviz/tq?tqx=out:csv&sheet=Sheet1`;

        fetch(csvUrl)
            .then(res => res.text())
            .then(csvText => {
                const baris = csvText.split(/\r?\n/).filter(b => b.trim() !== "");
                const kumpulanKategori = [];

                // Lewati baris pertama (Header A1:J1), ambil Kolom C (indeks ke-2 = Kategori)
                for (let i = 1; i < baris.length; i++) {
                    const kolom = baris[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                    if (kolom.length >= 3) {
                        const namaKat = kolom[2].replace(/^"|"$/g, "").trim();
                        if (namaKat && !kumpulanKategori.includes(namaKat)) {
                            kumpulanKategori.push(namaKat);
                        }
                    }
                }

                if (kumpulanKategori.length > 0) {
                    sessionStorage.setItem("alkautsar_kategori_nav", JSON.stringify(kumpulanKategori));
                    renderMenuKategori(kumpulanKategori);
                }
            })
            .catch(err => console.warn("Menggunakan daftar kategori cadangan di navigasi:", err));
    }
});
// ==========================================
// 6. MESIN KOMENTAR & BALASAN ADMIN OTOMATIS (GOOGLE SHEETS)
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const komentarSection = document.querySelector(".komentar-section");
    if (!komentarSection) return;

    // Gunakan URL Web App Google Apps Script yang sama dengan Form Konsultasi
    const KOMENTAR_APP_URL = "https://script.google.com/macros/s/AKfycbyvCrVdW96MpZRwurjSVUo5BN6K4nRbkMqLqFE7I3_WmYwieNhsSdHqh_PoYfUSLw4o/exec";

    // Deteksi nama file halaman secara otomatis (contoh: detail-kombinasi-200.html)
    const pathParts = window.location.pathname.split("/");
    const halamanId = pathParts[pathParts.length - 1] || "detail-paket";

    // Bangun tampilan Form & Daftar Komentar sesuai class di detail.css Anda
    komentarSection.innerHTML = `
        <h3>💬 Diskusi & Pertanyaan</h3>
        <form id="form-diskusi-paket" class="form-komentar">
            <input type="text" id="komen-nama" class="input-nama" placeholder="Nama Anda (Contoh: Pak Hendra - Pahoman)" required>
            <textarea id="komen-teks" class="input-teks" placeholder="Tulis pertanyaan atau pengalaman Anda mengenai paket ini..." required></textarea>
            <button type="submit" id="btn-submit-komen" class="btn-kirim-komentar">Kirim Pertanyaan / Ulasan</button>
        </form>
        <div id="daftar-komentar-container">
            <p style="color:#888; font-size:0.9rem;">Memuat diskusi...</p>
        </div>
    `;

    const listContainer = document.getElementById("daftar-komentar-container");
    const formDiskusi = document.getElementById("form-diskusi-paket");
    const btnSubmit = document.getElementById("btn-submit-komen");

    // Fungsi pengaman teks HTML
    function escapeHTML(str) {
        return String(str || "").replace(/[&<>"']/g, function(m) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m];
        });
    }

    // Fungsi merender daftar komentar & balasan Admin
    function renderKomentar(dataList) {
        if (!dataList || dataList.length === 0) {
            listContainer.innerHTML = `<p style="color:#888; font-size:0.92rem; font-style:italic;">Belum ada diskusi di paket ini. Jadilah yang pertama bertanya!</p>`;
            return;
        }

        let html = "";
        dataList.forEach(item => {
            const inisial = (item.nama || "P").trim().charAt(0).toUpperCase();
            html += `
                <div class="komentar-item">
                    <div class="komentar-avatar">${escapeHTML(inisial)}</div>
                    <div class="komentar-konten">
                        <div class="komentar-header">
                            <strong>${escapeHTML(item.nama)}</strong>
                            <span class="komentar-waktu">• ${escapeHTML(item.waktu)}</span>
                        </div>
                        <p>${escapeHTML(item.komentar)}</p>
                    </div>
                </div>
            `;

            // Jika kolom Balasan Admin di Google Sheets sudah diisi, tampilkan di bawahnya!
            if (item.balasan && item.balasan.trim() !== "") {
                html += `
                    <div class="komentar-item admin-reply">
                        <div class="komentar-avatar admin-avatar">A</div>
                        <div class="komentar-konten">
                            <div class="komentar-header">
                                <strong>Admin Al-Kautsar Bumindo</strong>
                                <span class="badge-admin">Official ✓</span>
                            </div>
                            <p>${escapeHTML(item.balasan)}</p>
                        </div>
                    </div>
                `;
            }
        });

        listContainer.innerHTML = html;
    }

    // 1. Tarik daftar komentar dari Google Sheets
    function muatKomentar() {
        if (!KOMENTAR_APP_URL || KOMENTAR_APP_URL === "https://script.google.com/macros/s/AKfycbyvCrVdW96MpZRwurjSVUo5BN6K4nRbkMqLqFE7I3_WmYwieNhsSdHqh_PoYfUSLw4o/exec") {
            renderKomentar([]);
            return;
        }
        fetch(`${KOMENTAR_APP_URL}?halaman=${encodeURIComponent(halamanId)}`)
            .then(res => res.json())
            .then(data => renderKomentar(data))
            .catch(() => {
                listContainer.innerHTML = `<p style="color:#888; font-size:0.9rem;">Belum ada komentar.</p>`;
            });
    }

    muatKomentar();

    // 2. Kirim komentar baru saat tombol diklik
    formDiskusi.addEventListener("submit", function(e) {
        e.preventDefault();
        const nama = document.getElementById("komen-nama").value.trim();
        const komentar = document.getElementById("komen-teks").value.trim();
        if (!nama || !komentar) return;

        btnSubmit.disabled = true;
        btnSubmit.textContent = "Mengirim...";

        const payload = {
            action: "kirim_komentar",
            halaman: halamanId,
            nama: nama,
            komentar: komentar
        };

        fetch(KOMENTAR_APP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        }).then(() => {
            formDiskusi.reset();
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Kirim Pertanyaan / Ulasan";
            // Muat ulang daftar komentar setelah 1,5 detik
            setTimeout(muatKomentar, 1500);
        }).catch(() => {
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Kirim Pertanyaan / Ulasan";
        });
    });
});