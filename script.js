/*
====================================================
KONFIGURASI
====================================================

Setelah Google Apps Script selesai dibuat,
masukkan URL Web App di bawah ini.

Contoh:
const API_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
*/

const API_URL = "https://script.google.com/macros/s/AKfycbyz1Dau9GWQnOgwG3xGI5cJ1Ih6Di1_EzwdvHQjgaV9KMV_DfRIqZl-94AnwsYpQhbS/exec";


/*
====================================================
VARIABEL
====================================================
*/

let inventoryData = [];


/*
====================================================
SAAT HALAMAN DIBUKA
====================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    loadData();

    document
        .getElementById("inventoryForm")
        .addEventListener("submit", submitForm);

});


/*
====================================================
LOAD DATA DARI GOOGLE SHEETS
====================================================
*/

async function loadData() {

    const tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = `
        <tr>
            <td colspan="9" class="loading">
                <i class="bi bi-arrow-repeat"></i>
                Memuat data...
            </td>
        </tr>
    `;

    if (API_URL === "MASUKKAN_URL_WEB_APP_DISINI") {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="loading">
                    Masukkan URL Google Apps Script
                    terlebih dahulu di script.js
                </td>
            </tr>
        `;

        return;
    }


    try {

        const response = await fetch(API_URL + "?action=get");

        const result = await response.json();

        if (result.success) {

            inventoryData = result.data || [];

            renderTable(inventoryData);

            updateDashboard(inventoryData);

        } else {

            showToast(
                result.message || "Gagal mengambil data.",
                true
            );

        }

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="loading">
                    Gagal terhubung ke Google Sheets.
                </td>
            </tr>
        `;

        showToast(
            "Gagal terhubung ke server.",
            true
        );
    }
}


/*
====================================================
TAMPILKAN DATA KE TABLE
====================================================
*/

function renderTable(data) {

    const tableBody = document.getElementById("tableBody");

    if (!data || data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="loading">
                    Belum ada data inventaris.
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML = data.map(function (item, index) {

        let badgeClass = "badge-baik";

        if (item.kondisi === "Rusak Ringan") {
            badgeClass = "badge-ringan";
        }

        if (item.kondisi === "Rusak Berat") {
            badgeClass = "badge-berat";
        }


        return `
            <tr>

                <td>${index + 1}</td>

                <td>
                    <strong>${escapeHTML(item.kode)}</strong>
                </td>

                <td>
                    ${escapeHTML(item.nama)}
                </td>

                <td>
                    ${escapeHTML(item.kategori)}
                </td>

                <td>
                    ${escapeHTML(item.jumlah)}
                </td>

                <td>
                    <span class="badge ${badgeClass}">
                        ${escapeHTML(item.kondisi)}
                    </span>
                </td>

                <td>
                    ${escapeHTML(item.lokasi)}
                </td>

                <td>
                    ${escapeHTML(item.tahun)}
                </td>

                <td>

                    <div class="action-buttons">

                        <button
                            class="edit-btn"
                            onclick="editData('${item.id}')"
                            title="Edit"
                        >
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button
