/**
 * ============================================================================
 * MESIN E-COMMERCE & KALKULATOR GROSIR AL-KAUTSAR BUMINDO (toko/toko.js)
 * ============================================================================
 */

// 1. KONFIGURASI UTAMA
// Tempelkan link Google Sheets Anda (format /edit?usp=sharing) di dalam tanda kutip di bawah ini:
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1agFOJb55H9IF1i7Cqn7Bbj4tMTcTNgrR7b3sHtpVJQM/edit?usp=sharing";
const NOMOR_WA_ADMIN = "6281211108724";
const STORAGE_KEY_CART = "alkautsar_keranjang_v1";

// 2. DATA CONTOH (FALLBACK DATA)
// Digunakan otomatis jika link Google Sheets belum ditempel atau koneksi internet sedang terputus
const fallbackData = [
    {
        id: "BRG-001",
        nama: "Tutup Galon Biru",
        kategori: "Tutup Galon",
        satuan: "Pcs",
        terlaris: true,
        hargaEcer: 100000,
        minGrosir1: 6,
        hargaGrosir1: 95000,
        minGrosir2: 12,
        hargaGrosir2: 90000
    },
    {
        id: "BRG-022",
        nama: "Filter Pendek 0,1 (Cartridge Spun)",
        kategori: "Filter",
        satuan: "Pcs",
        terlaris: true,
        hargaEcer: 12000,
        minGrosir1: 50,
        hargaGrosir1: 10000,
        minGrosir2: 100,
        hargaGrosir2: 9000
    },
    {
        id: "BRG-028",
        nama: "CTO (Carbon Block Filter 10 Inch)",
        kategori: "Filter",
        satuan: "Pcs",
        terlaris: true,
        hargaEcer: 30000,
        minGrosir1: 0,
        hargaGrosir1: 0,
        minGrosir2: 0,
        hargaGrosir2: 0
    },
    {
        id: "BRG-029",
        nama: "GAC (Granular Activated Carbon 10 Inch)",
        kategori: "Filter",
        satuan: "Pcs",
        terlaris: true,
        hargaEcer: 35000,
        minGrosir1: 0,
        hargaGrosir1: 0,
        minGrosir2: 0,
        hargaGrosir2: 0
    },
    {
        id: "BRG-104",
        nama: "Pasir Silika 50 Kg",
        kategori: "Pasir",
        satuan: "Sak",
        terlaris: true,
        hargaEcer: 250000,
        minGrosir1: 0,
        hargaGrosir1: 0,
        minGrosir2: 0,
        hargaGrosir2: 0
    },
    {
        id: "BRG-067",
        nama: "Carbon Aktif (Karbon Media Filter)",
        kategori: "Pasir",
        satuan: "Sak",
        terlaris: true,
        hargaEcer: 1100000,
        minGrosir1: 0,
        hargaGrosir1: 0,
        minGrosir2: 0,
        hargaGrosir2: 0
    },
    {
        id: "BRG-065",
        nama: "Tabung Media FRP 1054",
        kategori: "Umum",
        satuan: "Pcs",
        terlaris: true,
        hargaEcer: 975000,
        minGrosir1: 0,
        hargaGrosir1: 0,
        minGrosir2: 0,
        hargaGrosir2: 0
    },
    {
        id: "BRG-062",
        nama: "Housing Filter Biru 10 Inch",
        kategori: "Housing",
        satuan: "Pcs",
        terlaris: false,
        hargaEcer: 150000,
        minGrosir1: 0,
        hargaGrosir1: 0,
        minGrosir2: 0,
        hargaGrosir2: 0
    }
];

// 3. STATE APLIKASI
let daftarProduk = [];
let kategoriAktif = "terlaris";
let kataKunciCari = "";
let urutanAktif = "default";
let produkModalAktif = null;
let keranjang = [];

// Pemetaan Ikon Kategori Otomatis sesuai kategori di Google Sheets
const petaIkonKategori = {
    "Tutup Galon": "fa-bottle-water",
    "Galon": "fa-jar",
    "Filter": "fa-filter",
    "Segel": "fa-Certificate",
    "Kran": "fa-faucet-drip",
    "UV": "fa-lightbulb",
    "Housing": "fa-capsules",
    "Mesin": "fa-gears",
    "Pasir": "fa-mound",
    "RO": "fa-droplet",
    "Umum": "fa-screwdriver-wrench"
};

function dapatkanIkonKategori(kategori) {
    if (!kategori) return "fa-box";
    for (const [kunci, ikon] of Object.entries(petaIkonKategori)) {
        if (kategori.toLowerCase().includes(kunci.toLowerCase())) {
            return ikon;
        }
    }
    return "fa-box-open";
}

// Format Angka ke Rupiah
function formatRupiah(angka) {
    const nilai = Number(angka) || 0;
    return "Rp " + nilai.toLocaleString("id-ID");
}

// ============================================================================
// 4. LOGIKA HARGA GROSIR BERTINGKAT
// ============================================================================
function hitungHargaSatuan(produk, qty) {
    const jumlah = Math.max(1, parseInt(qty, 10) || 1);
    let hargaAktif = produk.hargaEcer;
    let levelGrosir = 0; // 0 = Ecer, 1 = Grosir 1, 2 = Grosir 2

    if (produk.minGrosir2 > 0 && produk.hargaGrosir2 > 0 && jumlah >= produk.minGrosir2) {
        hargaAktif = produk.hargaGrosir2;
        levelGrosir = 2;
    } else if (produk.minGrosir1 > 0 && produk.hargaGrosir1 > 0 && jumlah >= produk.minGrosir1) {
        hargaAktif = produk.hargaGrosir1;
        levelGrosir = 1;
    }

    const subtotal = hargaAktif * jumlah;
    const totalNormal = produk.hargaEcer * jumlah;
    const totalHemat = Math.max(0, totalNormal - subtotal);

    return {
        qty: jumlah,
        hargaAktif,
        levelGrosir,
        subtotal,
        totalHemat
    };
}

function punyaHargaGrosir(produk) {
    return (produk.minGrosir1 > 0 && produk.hargaGrosir1 > 0) ||
           (produk.minGrosir2 > 0 && produk.hargaGrosir2 > 0);
}

// ============================================================================
// 5. INTEGRASI & PARSER CSV GOOGLE SHEETS
// ============================================================================
function konversiKeUrlCsv(url) {
    if (!url || url === "TEMPEL_LINK_GOOGLE_SHEETS_ANDA_DISINI") return "";
    // Jika sudah berupa link export CSV / gviz
    if (url.includes("tqx=out:csv") || url.includes("output=csv")) return url;

    // Ekstrak ID dari link Google Sheets standar (/spreadsheets/d/{ID}/...)
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
        return `https://docs.google.com/spreadsheets/d/${match[1]}/gviz/tq?tqx=out:csv&sheet=Sheet1`;
    }
    return "";
}

// Parser baris CSV yang aman terhadap tanda kutip dan koma di dalam teks
function uraiBarisCsv(baris) {
    const hasil = [];
    let nilaiSaatIni = "";
    let dalamKutip = false;

    for (let i = 0; i < baris.length; i++) {
        const karakter = baris[i];
        const karakterBerikut = baris[i + 1];

        if (karakter === '"' && dalamKutip && karakterBerikut === '"') {
            nilaiSaatIni += '"';
            i++;
        } else if (karakter === '"') {
            dalamKutip = !dalamKutip;
        } else if (karakter === ',' && !dalamKutip) {
            hasil.push(nilaiSaatIni.trim());
            nilaiSaatIni = "";
        } else {
            nilaiSaatIni += karakter;
        }
    }
    hasil.push(nilaiSaatIni.trim());
    return hasil;
}

function bersihkanAngka(teks) {
    if (!teks) return 0;
    const hanyaAngka = String(teks).replace(/[^0-9]/g, "");
    return parseInt(hanyaAngka, 10) || 0;
}

async function muatDataProduk() {
    const elLoading = document.getElementById("loading-produk");
    const elSumber = document.getElementById("status-sumber-data");
    const csvUrl = konversiKeUrlCsv(GOOGLE_SHEET_URL);

    if (!csvUrl) {
        daftarProduk = [...fallbackData];
        if (elLoading) elLoading.style.display = "none";
        if (elSumber) elSumber.textContent = "Mode Demo (8 Produk Contoh)";
        inisialisasiTampilanToko();
        return;
    }

    try {
        const respons = await fetch(csvUrl);
        if (!respons.ok) throw new Error("Gagal mengunduh CSV Google Sheets");
        const teksCsv = await respons.text();

        const barisList = teksCsv.split(/\r?\n/).filter(b => b.trim() !== "");
        const produkTerurai = [];

        // Mulai dari indeks 1 (melewati baris judul/header A1:J1)
        for (let i = 1; i < barisList.length; i++) {
            const kolom = uraiBarisCsv(barisList[i]);
            if (kolom.length < 6) continue;

            const id = kolom[0] || `BRG-${i}`;
            const nama = kolom[1] || "";
            const kategori = kolom[2] || "Umum";
            const satuan = kolom[3] || "Pcs";
            const teksTerlaris = (kolom[4] || "").toLowerCase();
            const terlaris = teksTerlaris === "iya" || teksTerlaris === "ya" || teksTerlaris === "true" || teksTerlaris === "1";
            const hargaEcer = bersihkanAngka(kolom[5]);
            const minGrosir1 = bersihkanAngka(kolom[6]);
            const hargaGrosir1 = bersihkanAngka(kolom[7]);
            const minGrosir2 = bersihkanAngka(kolom[8]);
            const hargaGrosir2 = bersihkanAngka(kolom[9]);

            if (nama && hargaEcer > 0) {
                produkTerurai.push({
                    id,
                    nama,
                    kategori,
                    satuan,
                    terlaris,
                    hargaEcer,
                    minGrosir1,
                    hargaGrosir1,
                    minGrosir2,
                    hargaGrosir2
                });
            }
        }

        if (produkTerurai.length > 0) {
            daftarProduk = produkTerurai;
            if (elSumber) elSumber.textContent = "Live Data Google Sheets";
        } else {
            throw new Error("Data CSV kosong");
        }
    } catch (err) {
        console.warn("Menggunakan fallbackData karena Google Sheets belum dapat diakses:", err);
        daftarProduk = [...fallbackData];
        if (elSumber) elSumber.textContent = "Data Cadangan (Offline)";
    } finally {
        if (elLoading) elLoading.style.display = "none";
        inisialisasiTampilanToko();
    }
}

// ============================================================================
// 6. RENDER KATEGORI, PENCARIAN URL, & KARTU PRODUK
// ============================================================================
function inisialisasiTampilanToko() {
    renderTombolKategori();
    bacaParameterUrl();
    renderDaftarProduk();
}

function renderTombolKategori() {
    const container = document.getElementById("kategori-container");
    if (!container) return;

    // Ambil daftar kategori unik dari data produk
    const kategoriUnik = [...new Set(daftarProduk.map(p => p.kategori.trim()).filter(Boolean))];

    let html = `
        <button class="kat-pill ${kategoriAktif === 'terlaris' ? 'active' : ''}" data-kategori="terlaris">
            🔥 Paling Banyak Dipesan
        </button>
        <button class="kat-pill ${kategoriAktif === 'semua' ? 'active' : ''}" data-kategori="semua">
            📦 Semua Produk (${daftarProduk.length})
        </button>
    `;

    kategoriUnik.forEach(kat => {
        const ikon = dapatkanIkonKategori(kat);
        const isActive = kategoriAktif.toLowerCase() === kat.toLowerCase() ? "active" : "";
        html += `
            <button class="kat-pill ${isActive}" data-kategori="${kat}">
                <i class="fas ${ikon}"></i> ${kat}
            </button>
        `;
    });

    container.innerHTML = html;

    // Pasang event listener pada setiap tombol kategori
    const pills = container.querySelectorAll(".kat-pill");
    pills.forEach(pill => {
        pill.addEventListener("click", function() {
            pills.forEach(p => p.classList.remove("active"));
            this.classList.add("active");
            kategoriAktif = this.getAttribute("data-kategori");
            renderDaftarProduk();
        });
    });
}

function bacaParameterUrl() {
    const params = new URLSearchParams(window.location.search);
    const paramCari = params.get("cari");
    const paramKat = params.get("kategori");

    if (paramCari) {
        kataKunciCari = paramCari.trim();
        kategoriAktif = "semua"; // Buka semua produk saat mencari dari halaman utama
        const inputCari = document.getElementById("input-cari-produk");
        const btnReset = document.getElementById("btn-reset-cari");
        if (inputCari) inputCari.value = kataKunciCari;
        if (btnReset) btnReset.style.display = "flex";
    } else if (paramKat) {
        kategoriAktif = paramKat.trim();
    }

    // Sinkronkan tampilan tombol aktif
    const pills = document.querySelectorAll("#kategori-container .kat-pill");
    if (pills.length > 0) {
        pills.forEach(p => {
            if (p.getAttribute("data-kategori").toLowerCase() === kategoriAktif.toLowerCase()) {
                pills.forEach(item => item.classList.remove("active"));
                p.classList.add("active");
            }
        });
    }
}

function renderDaftarProduk() {
    const grid = document.getElementById("produk-grid");
    const stateKosong = document.getElementById("produk-kosong");
    const elCounter = document.getElementById("jumlah-produk-tampil");
    if (!grid) return;

    // 1. Filter berdasarkan Kategori & Kata Kunci Pencarian
    let hasilFilter = daftarProduk.filter(produk => {
        const cocokKataKunci = kataKunciCari === "" ||
            produk.nama.toLowerCase().includes(kataKunciCari.toLowerCase()) ||
            produk.kategori.toLowerCase().includes(kataKunciCari.toLowerCase()) ||
            produk.id.toLowerCase().includes(kataKunciCari.toLowerCase());

        if (!cocokKataKunci) return false;

        if (kategoriAktif === "terlaris") {
            return produk.terlaris === true;
        } else if (kategoriAktif === "semua") {
            return true;
        } else {
            return produk.kategori.toLowerCase() === kategoriAktif.toLowerCase();
        }
    });

    // 2. Urutkan Produk
    if (urutanAktif === "termurah") {
        hasilFilter.sort((a, b) => a.hargaEcer - b.hargaEcer);
    } else if (urutanAktif === "termahal") {
        hasilFilter.sort((a, b) => b.hargaEcer - a.hargaEcer);
    } else if (urutanAktif === "nama-az") {
        hasilFilter.sort((a, b) => a.nama.localeCompare(b.nama, "id"));
    } else {
        // Default: dahulukan produk Terlaris
        hasilFilter.sort((a, b) => (b.terlaris === true) - (a.terlaris === true));
    }

    if (elCounter) elCounter.textContent = hasilFilter.length;

    // 3. Tampilkan pesan jika kosong
    if (hasilFilter.length === 0) {
        grid.innerHTML = "";
        if (stateKosong) stateKosong.style.display = "block";
        return;
    }

    if (stateKosong) stateKosong.style.display = "none";

    // 4. Render Kartu Produk
    grid.innerHTML = hasilFilter.map(produk => {
        const ikon = dapatkanIkonKategori(produk.kategori);
        const adaGrosir = punyaHargaGrosir(produk);
        const hargaTermurah = produk.hargaGrosir2 > 0 ? produk.hargaGrosir2 : produk.hargaGrosir1;
        const minAwal = produk.minGrosir1 > 0 ? produk.minGrosir1 : produk.minGrosir2;

        return `
            <article class="produk-card" data-id="${produk.id}">
                <div>
                    <div class="card-top-meta">
                        <span class="card-kat-tag">
                            <i class="fas ${ikon}"></i> ${produk.kategori}
                        </span>
                        ${produk.terlaris ? `<span class="card-hot-tag">🔥 Terlaris</span>` : ""}
                    </div>

                    <h3 class="card-title">${produk.nama}</h3>
                    <p class="card-unit">Satuan: <strong>${produk.satuan}</strong> &bull; Kode: ${produk.id}</p>
                </div>

                <div>
                    <div class="card-price-box">
                        <span class="price-ecer-label">Harga Eceran:</span>
                        <div class="price-ecer-val">
                            ${formatRupiah(produk.hargaEcer)} <small>/ ${produk.satuan}</small>
                        </div>
                        ${adaGrosir ? `
                            <div class="grosir-preview-tag">
                                <i class="fas fa-tags"></i> Grosir mulai ${formatRupiah(hargaTermurah)} (Min.${minAwal})
                            </div>
                        ` : `
                            <div class="no-grosir-tag">
                                Harga terbaik siap kirim
                            </div>
                        `}
                    </div>

                    <button type="button" class="btn-pilih-produk">
                        <i class="fas fa-cart-plus"></i> ${adaGrosir ? "Lihat Grosir & Beli" : "+ Pilih Barang"}
                    </button>
                </div>
            </article>
        `;
    }).join("");

    // Event klik pada setiap kartu produk untuk membuka Pop-up Modal (Opsi A)
    grid.querySelectorAll(".produk-card").forEach(card => {
        card.addEventListener("click", function() {
            const idProduk = this.getAttribute("data-id");
            const produk = daftarProduk.find(p => p.id === idProduk);
            if (produk) bukaModalProduk(produk);
        });
    });
}

// ============================================================================
// 7. POP-UP MODAL DETAIL & KALKULATOR GROSIR (OPSI A)
// ============================================================================
function bukaModalProduk(produk) {
    produkModalAktif = produk;

    const overlay = document.getElementById("modal-produk-overlay");
    const elKat = document.getElementById("modal-kategori");
    const elHot = document.getElementById("modal-badge-terlaris");
    const elNama = document.getElementById("modal-nama-produk");
    const elSatuan = document.getElementById("modal-satuan");
    const elSatuanQty = document.getElementById("modal-qty-satuan-label");
    const inputQty = document.getElementById("modal-input-qty");

    if (elKat) elKat.textContent = produk.kategori;
    if (elHot) elHot.style.display = produk.terlaris ? "inline-block" : "none";
    if (elNama) elNama.textContent = produk.nama;
    if (elSatuan) elSatuan.textContent = produk.satuan;
    if (elSatuanQty) elSatuanQty.textContent = produk.satuan;

    // Cek apakah produk ini sudah ada di keranjang, jika ada gunakan qty tersebut
    const itemDiKeranjang = keranjang.find(item => item.id === produk.id);
    const qtyAwal = itemDiKeranjang ? itemDiKeranjang.qty : 1;
    if (inputQty) inputQty.value = qtyAwal;

    renderKotakTierModal(produk, qtyAwal);
    renderTombolCepatQty(produk);
    perbaruiKalkulasiModal(qtyAwal);

    if (overlay) overlay.classList.add("active");
}

function tutupModalProduk() {
    const overlay = document.getElementById("modal-produk-overlay");
    if (overlay) overlay.classList.remove("active");
    produkModalAktif = null;
}

function renderKotakTierModal(produk, qtySaatIni) {
    const tierGrid = document.getElementById("modal-tier-grid");
    if (!tierGrid) return;

    const infoHarga = hitungHargaSatuan(produk, qtySaatIni);
    let html = "";

    // Tier 0: Harga Eceran
    const batasEcer = produk.minGrosir1 > 1 ? `1 - ${produk.minGrosir1 - 1} ${produk.satuan}` : `Mulai 1 ${produk.satuan}`;
    html += `
        <div class="tier-card ${infoHarga.levelGrosir === 0 ? 'active' : ''}" data-min="1">
            <span class="tier-qty-range">${batasEcer}</span>
            <div class="tier-price-val">${formatRupiah(produk.hargaEcer)}</div>
            <span class="tier-label-tag">Harga Eceran</span>
        </div>
    `;

    // Tier 1: Grosir 1 (Jika ada)
    if (produk.minGrosir1 > 0 && produk.hargaGrosir1 > 0) {
        const batasGrosir1 = (produk.minGrosir2 > produk.minGrosir1)
            ? `${produk.minGrosir1} - ${produk.minGrosir2 - 1} ${produk.satuan}`
            : `Min. ${produk.minGrosir1} ${produk.satuan}`;

        html += `
            <div class="tier-card ${infoHarga.levelGrosir === 1 ? 'active' : ''}" data-min="${produk.minGrosir1}">
                <span class="tier-qty-range">${batasGrosir1}</span>
                <div class="tier-price-val">${formatRupiah(produk.hargaGrosir1)}</div>
                <span class="tier-label-tag">Grosir Tahap 1</span>
            </div>
        `;
    }

    // Tier 2: Grosir 2 / Partai Besar (Jika ada)
    if (produk.minGrosir2 > 0 && produk.hargaGrosir2 > 0) {
        html += `
            <div class="tier-card ${infoHarga.levelGrosir === 2 ? 'active' : ''}" data-min="${produk.minGrosir2}">
                <span class="tier-qty-range">&ge; ${produk.minGrosir2} ${produk.satuan}</span>
                <div class="tier-price-val">${formatRupiah(produk.hargaGrosir2)}</div>
                <span class="tier-label-tag">Grosir Partai / Qoly</span>
            </div>
        `;
    }

    tierGrid.innerHTML = html;

    // Klik pada kotak tier langsung mengubah jumlah input ke minimal tier tersebut
    tierGrid.querySelectorAll(".tier-card").forEach(card => {
        card.addEventListener("click", function() {
            const minQty = parseInt(this.getAttribute("data-min"), 10) || 1;
            const inputQty = document.getElementById("modal-input-qty");
            if (inputQty) inputQty.value = minQty;
            perbaruiKalkulasiModal(minQty);
        });
    });
}

function renderTombolCepatQty(produk) {
    const quickWrap = document.getElementById("modal-quick-qty");
    if (!quickWrap) return;

    const pilihanQty = [1];
    if (produk.minGrosir1 > 1) pilihanQty.push(produk.minGrosir1);
    if (produk.minGrosir2 > 1) pilihanQty.push(produk.minGrosir2);
    if (!punyaHargaGrosir(produk)) {
        pilihanQty.push(5, 10);
    }

    quickWrap.innerHTML = pilihanQty.map(angka => `
        <button type="button" class="btn-quick-qty" data-qty="${angka}">
            ${angka} ${produk.satuan}
        </button>
    `).join("");

    quickWrap.querySelectorAll(".btn-quick-qty").forEach(btn => {
        btn.addEventListener("click", function() {
            const qtyPilih = parseInt(this.getAttribute("data-qty"), 10) || 1;
            const inputQty = document.getElementById("modal-input-qty");
            if (inputQty) inputQty.value = qtyPilih;
            perbaruiKalkulasiModal(qtyPilih);
        });
    });
}

function perbaruiKalkulasiModal(qtyInput) {
    if (!produkModalAktif) return;

    const hasil = hitungHargaSatuan(produkModalAktif, qtyInput);
    const elHargaAktif = document.getElementById("modal-harga-aktif");
    const elSubtotal = document.getElementById("modal-subtotal");
    const elHematBadge = document.getElementById("modal-hemat-badge");
    const elNominalHemat = document.getElementById("modal-nominal-hemat");

    if (elHargaAktif) {
        elHargaAktif.textContent = `${formatRupiah(hasil.hargaAktif)} / ${produkModalAktif.satuan}`;
    }
    if (elSubtotal) {
        elSubtotal.textContent = formatRupiah(hasil.subtotal);
    }

    if (elHematBadge && elNominalHemat) {
        if (hasil.totalHemat > 0) {
            elNominalHemat.textContent = formatRupiah(hasil.totalHemat);
            elHematBadge.style.display = "block";
        } else {
            elHematBadge.style.display = "none";
        }
    }

    // Perbarui highlight kotak tier
    renderKotakTierModal(produkModalAktif, hasil.qty);
}

// ============================================================================
// 8. MANAJEMEN KERANJANG BELANJA (LOCALSTORAGE) & CHECKOUT WA
// ============================================================================
function muatKeranjangDariStorage() {
    try {
        const tersimpan = localStorage.getItem(STORAGE_KEY_CART);
        keranjang = tersimpan ? JSON.parse(tersimpan) : [];
    } catch (e) {
        keranjang = [];
    }
    perbaruiTampilanKeranjang();
}

function simpanKeranjangKeStorage() {
    try {
        localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(keranjang));
    } catch (e) {
        console.error("Gagal menyimpan ke localStorage:", e);
    }
    perbaruiTampilanKeranjang();
}

function tambahKeKeranjang(produk, qtyTambah) {
    const jumlah = Math.max(1, parseInt(qtyTambah, 10) || 1);
    const indeksAda = keranjang.findIndex(item => item.id === produk.id);

    if (indeksAda > -1) {
        keranjang[indeksAda].qty = jumlah;
    } else {
        keranjang.push({
            id: produk.id,
            nama: produk.nama,
            kategori: produk.kategori,
            satuan: produk.satuan,
            hargaEcer: produk.hargaEcer,
            minGrosir1: produk.minGrosir1,
            hargaGrosir1: produk.hargaGrosir1,
            minGrosir2: produk.minGrosir2,
            hargaGrosir2: produk.hargaGrosir2,
            qty: jumlah
        });
    }

    simpanKeranjangKeStorage();
    tampilkanToast(`✓ ${produk.nama} (${jumlah} ${produk.satuan}) masuk keranjang!`);
}

function ubahQtyKeranjang(idProduk, qtyBaru) {
    const indeks = keranjang.findIndex(item => item.id === idProduk);
    if (indeks === -1) return;

    const angka = parseInt(qtyBaru, 10);
    if (isNaN(angka) || angka <= 0) {
        keranjang.splice(indeks, 1);
    } else {
        keranjang[indeks].qty = angka;
    }
    simpanKeranjangKeStorage();
}

function hapusItemKeranjang(idProduk) {
    keranjang = keranjang.filter(item => item.id !== idProduk);
    simpanKeranjangKeStorage();
}

function perbaruiTampilanKeranjang() {
    const badgeCount = document.getElementById("cart-count-badge");
    const drawerCount = document.getElementById("drawer-cart-count");
    const floatTotal = document.getElementById("cart-total-float");
    const listContainer = document.getElementById("cart-items-list");
    const emptyState = document.getElementById("cart-empty-state");
    const clearWrap = document.getElementById("cart-clear-wrap");
    const checkoutForm = document.getElementById("cart-checkout-form");
    const drawerFooter = document.getElementById("cart-drawer-footer");
    const rowHemat = document.getElementById("drawer-row-hemat");
    const elTotalHemat = document.getElementById("drawer-total-hemat");
    const elGrandTotal = document.getElementById("drawer-grand-total");

    let grandTotal = 0;
    let totalHematSemua = 0;
    const totalJenisBarang = keranjang.length;

    keranjang.forEach(item => {
        const kalkulasi = hitungHargaSatuan(item, item.qty);
        grandTotal += kalkulasi.subtotal;
        totalHematSemua += kalkulasi.totalHemat;
    });

    if (badgeCount) badgeCount.textContent = totalJenisBarang;
    if (drawerCount) drawerCount.textContent = totalJenisBarang;
    if (floatTotal) floatTotal.textContent = formatRupiah(grandTotal);
    if (elGrandTotal) elGrandTotal.textContent = formatRupiah(grandTotal);

    if (rowHemat && elTotalHemat) {
        if (totalHematSemua > 0) {
            rowHemat.style.display = "flex";
            elTotalHemat.textContent = `- ${formatRupiah(totalHematSemua)}`;
        } else {
            rowHemat.style.display = "none";
        }
    }

    if (!listContainer) return;

    if (keranjang.length === 0) {
        listContainer.innerHTML = "";
        if (emptyState) emptyState.style.display = "block";
        if (clearWrap) clearWrap.style.display = "none";
        if (checkoutForm) checkoutForm.style.display = "none";
        if (drawerFooter) drawerFooter.style.display = "none";
        return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (clearWrap) clearWrap.style.display = "block";
    if (checkoutForm) checkoutForm.style.display = "block";
    if (drawerFooter) drawerFooter.style.display = "block";

    listContainer.innerHTML = keranjang.map(item => {
        const info = hitungHargaSatuan(item, item.qty);
        const labelGrosir = info.levelGrosir > 0
            ? `<span class="badge-grosir-aktif">Grosir Aktif!</span>`
            : "";

        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-top">
                    <span class="cart-item-title">${item.nama}</span>
                    <button type="button" class="btn-hapus-item" data-id="${item.id}" title="Hapus barang">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-pricing">
                    ${formatRupiah(info.hargaAktif)} / ${item.satuan} ${labelGrosir}
                </div>
                <div class="cart-item-bottom">
                    <div class="cart-qty-mini">
                        <button type="button" class="btn-cart-minus" data-id="${item.id}">-</button>
                        <input type="number" class="input-cart-qty" data-id="${item.id}" value="${item.qty}" min="1">
                        <button type="button" class="btn-cart-plus" data-id="${item.id}">+</button>
                    </div>
                    <span class="cart-item-subtotal">${formatRupiah(info.subtotal)}</span>
                </div>
            </div>
        `;
    }).join("");

    // Event listener tombol hapus, tambah, dan kurang di dalam keranjang
    listContainer.querySelectorAll(".btn-hapus-item").forEach(btn => {
        btn.addEventListener("click", function() {
            hapusItemKeranjang(this.getAttribute("data-id"));
        });
    });

    listContainer.querySelectorAll(".btn-cart-minus").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const item = keranjang.find(i => i.id === id);
            if (item) ubahQtyKeranjang(id, item.qty - 1);
        });
    });

    listContainer.querySelectorAll(".btn-cart-plus").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            const item = keranjang.find(i => i.id === id);
            if (item) ubahQtyKeranjang(id, item.qty + 1);
        });
    });

    listContainer.querySelectorAll(".input-cart-qty").forEach(input => {
        input.addEventListener("change", function() {
            const id = this.getAttribute("data-id");
            ubahQtyKeranjang(id, this.value);
        });
    });
}

function tampilkanToast(pesan) {
    const toast = document.getElementById("toast-notif");
    const teks = document.getElementById("toast-teks");
    if (!toast || !teks) return;

    teks.textContent = pesan;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

function kirimPesananKeWhatsApp() {
    if (keranjang.length === 0) return;

    const inputNama = document.getElementById("checkout-nama");
    const selectMetode = document.getElementById("checkout-metode");
    const inputAlamat = document.getElementById("checkout-alamat");
    const inputCatatan = document.getElementById("checkout-catatan");

    const nama = inputNama ? inputNama.value.trim() : "";
    const metode = selectMetode ? selectMetode.value : "Kirim ke Alamat";
    const alamat = inputAlamat ? inputAlamat.value.trim() : "";
    const catatan = inputCatatan ? inputCatatan.value.trim() : "";

    if (!nama) {
        alert("Mohon isi Nama Pemesan / Nama Depot terlebih dahulu.");
        if (inputNama) inputNama.focus();
        return;
    }

    if (metode === "Kirim ke Alamat" && !alamat) {
        alert("Mohon isi Alamat Lengkap pengiriman Anda.");
        if (inputAlamat) inputAlamat.focus();
        return;
    }

    let pesan = `Halo Admin *Al-Kautsar Filter Air Bumindo*, saya ingin memesan produk dari Katalog Toko Website:\n\n`;
    pesan += `*DATA PEMESAN:*\n`;
    pesan += `• Nama: ${nama}\n`;
    pesan += `• Metode: ${metode}\n`;
    if (metode === "Kirim ke Alamat") {
        pesan += `• Alamat: ${alamat}\n`;
    }
    if (catatan) {
        pesan += `• Catatan: ${catatan}\n`;
    }

    pesan += `\n*RINCIAN PESANAN:*\n`;
    let grandTotal = 0;
    let totalHemat = 0;

    keranjang.forEach((item, index) => {
        const info = hitungHargaSatuan(item, item.qty);
        grandTotal += info.subtotal;
        totalHemat += info.totalHemat;
        const ketHarga = info.levelGrosir > 0 ? `(Harga Grosir)` : `(Harga Ecer)`;

        pesan += `${index + 1}. *${item.nama}*\n`;
        pesan += `   ${item.qty} ${item.satuan} x ${formatRupiah(info.hargaAktif)} ${ketHarga} = *${formatRupiah(info.subtotal)}*\n`;
    });

    pesan += `\n----------------------------------\n`;
    if (totalHemat > 0) {
        pesan += `Total Hemat Grosir: *- ${formatRupiah(totalHemat)}*\n`;
    }
    pesan += `*TOTAL ESTIMASI BELANJA: ${formatRupiah(grandTotal)}*\n`;
    pesan += `----------------------------------\n\n`;
    pesan += `Mohon info ketersediaan stok dan rincian pembayarannya. Terima kasih!`;

    const waUrl = `https://wa.me/${NOMOR_WA_ADMIN}?text=${encodeURIComponent(pesan)}`;
    window.open(waUrl, "_blank");
}

// ============================================================================
// 9. INISIALISASI EVENT LISTENER DOM
// ============================================================================
document.addEventListener("DOMContentLoaded", function() {
    muatKeranjangDariStorage();
    muatDataProduk();

    // Live Search Input
    const inputCari = document.getElementById("input-cari-produk");
    const btnResetCari = document.getElementById("btn-reset-cari");

    if (inputCari) {
        inputCari.addEventListener("input", function() {
            kataKunciCari = this.value.trim();
            if (btnResetCari) {
                btnResetCari.style.display = kataKunciCari.length > 0 ? "flex" : "none";
            }
            renderDaftarProduk();
        });
    }

    if (btnResetCari) {
        btnResetCari.addEventListener("click", function() {
            kataKunciCari = "";
            if (inputCari) inputCari.value = "";
            this.style.display = "none";
            renderDaftarProduk();
        });
    }

    // Tombol Tampilkan Semua saat Pencarian Kosong
    const btnTampilSemua = document.getElementById("btn-tampil-semua");
    if (btnTampilSemua) {
        btnTampilSemua.addEventListener("click", function() {
            kataKunciCari = "";
            kategoriAktif = "semua";
            if (inputCari) inputCari.value = "";
            if (btnResetCari) btnResetCari.style.display = "none";
            renderTombolKategori();
            renderDaftarProduk();
        });
    }

    // Dropdown Urutkan
    const selectUrutkan = document.getElementById("select-urutkan");
    if (selectUrutkan) {
        selectUrutkan.addEventListener("change", function() {
            urutanAktif = this.value;
            renderDaftarProduk();
        });
    }

    // Kontrol di dalam Pop-up Modal
    const btnTutupModal = document.getElementById("btn-tutup-modal");
    const modalOverlay = document.getElementById("modal-produk-overlay");
    const btnMinusModal = document.getElementById("btn-modal-minus");
    const btnPlusModal = document.getElementById("btn-modal-plus");
    const inputQtyModal = document.getElementById("modal-input-qty");
    const btnMasukKeranjang = document.getElementById("btn-masukkan-keranjang");

    if (btnTutupModal) btnTutupModal.addEventListener("click", tutupModalProduk);
    if (modalOverlay) {
        modalOverlay.addEventListener("click", function(e) {
            if (e.target === modalOverlay) tutupModalProduk();
        });
    }

    if (btnMinusModal && inputQtyModal) {
        btnMinusModal.addEventListener("click", function() {
            const saatIni = parseInt(inputQtyModal.value, 10) || 1;
            const baru = Math.max(1, saatIni - 1);
            inputQtyModal.value = baru;
            perbaruiKalkulasiModal(baru);
        });
    }

    if (btnPlusModal && inputQtyModal) {
        btnPlusModal.addEventListener("click", function() {
            const saatIni = parseInt(inputQtyModal.value, 10) || 1;
            const baru = saatIni + 1;
            inputQtyModal.value = baru;
            perbaruiKalkulasiModal(baru);
        });
    }

    if (inputQtyModal) {
        inputQtyModal.addEventListener("input", function() {
            const angka = Math.max(1, parseInt(this.value, 10) || 1);
            perbaruiKalkulasiModal(angka);
        });
    }

    if (btnMasukKeranjang && inputQtyModal) {
        btnMasukKeranjang.addEventListener("click", function() {
            if (produkModalAktif) {
                const qty = Math.max(1, parseInt(inputQtyModal.value, 10) || 1);
                tambahKeKeranjang(produkModalAktif, qty);
                tutupModalProduk();
            }
        });
    }

    // Kontrol Buka/Tutup Slide-out Cart Drawer
    const btnBukaCart = document.getElementById("btn-buka-keranjang");
    const btnTutupCart = document.getElementById("btn-tutup-keranjang");
    const cartOverlay = document.getElementById("cart-drawer-overlay");
    const cartDrawer = document.getElementById("cart-drawer");
    const btnKosongkan = document.getElementById("btn-kosongkan-keranjang");
    const selectMetode = document.getElementById("checkout-metode");
    const grupAlamat = document.getElementById("grup-alamat-kirim");
    const btnCheckoutWa = document.getElementById("btn-checkout-wa");

    function bukaDrawerKeranjang() {
        if (cartOverlay) cartOverlay.classList.add("active");
        if (cartDrawer) cartDrawer.classList.add("active");
    }

    function tutupDrawerKeranjang() {
        if (cartOverlay) cartOverlay.classList.remove("active");
        if (cartDrawer) cartDrawer.classList.remove("active");
    }

    if (btnBukaCart) btnBukaCart.addEventListener("click", bukaDrawerKeranjang);
    if (btnTutupCart) btnTutupCart.addEventListener("click", tutupDrawerKeranjang);
    if (cartOverlay) cartOverlay.addEventListener("click", tutupDrawerKeranjang);

    if (btnKosongkan) {
        btnKosongkan.addEventListener("click", function() {
            if (confirm("Kosongkan semua barang di keranjang belanja?")) {
                keranjang = [];
                simpanKeranjangKeStorage();
            }
        });
    }

    if (selectMetode && grupAlamat) {
        selectMetode.addEventListener("change", function() {
            grupAlamat.style.display = this.value === "Kirim ke Alamat" ? "block" : "none";
        });
    }

    if (btnCheckoutWa) {
        btnCheckoutWa.addEventListener("click", kirimPesananKeWhatsApp);
    }
});