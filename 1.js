// Buatlah function untuk mencetak pattern segitiga siku-siku terbalik dengan ketentuan sebagai berikut:
// Input user berupa panjang alas dan tinggi segitiga (alas dan tingginya sama) dengan ketentuan :
// 0 < Alas/Tinggi < 10
// Segitiga dibentuk dengan deret angka prima yang terus berlanjut meskipun barisnya berganti.
// Input:
// drawSikuSiku(7):

function bilanganPrima(n) {
    for (let i = 2; i < n; i++) {
        if (n % i === 0) {
            return false;
        }
    }
    return true;
}

console.log(bilanganPrima(17));

function drawSikuSiku(panjang) {
    if ( panjang < 0 || 10 < panjang ) return console.log("nilai panjang harus diantara 1 sampai 9");
    let bilangan = 2;

    for (let x = 1; x <= panjang; x++) {
        let hasil = "";
        for (let y = 0; y < x; y++) {
            while (!bilanganPrima(bilangan)) {
                bilangan++;
            }
            hasil += bilangan + " ";
            bilangan++;

        }
        console.log(hasil.trim());
    }
}

drawSikuSiku(7);
console.log("\n =============================== \n");
drawSikuSiku(9);