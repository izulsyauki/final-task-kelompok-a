// Buatlah sebuah function sederhana untuk menghitung potongan harga,
// biaya yang harus dibayar, dan total kembalian pada sistem voucher
// DumbWays Klontong , ketentuan :
// Voucher :
// a. DumbWaysJos, potongan 21,1%, minimal uang belanja 50000,
// Maksimal diskon 20000
// b. DumbWaysMantap, potongan 30%, minimal uang belanja 80000,
// maksimal diskon 40000
// Clue : maka jika function dijalankan:
// ● hitungVoucher(DumbWaysJos, 100000)
// output : - Uang yang harus dibayar : 80000
// - Diskon : 20000
// - Kembalian : 20000

// dumbjos pot 21.1% min belanja 50k, maks disk 20k
// dumbtaps pot 30% min belanja 80k, maks disk 40k

let totalBeli = 100000;

function hitungVoucher(voucher, uangBayar) {
    let minimalBeli = 0;
    let potonganPersen = 0;
    let maksPotongan = 0;

    if (voucher === "DumbWaysJos") {
        minimalBeli = 50000;
        potonganPersen = 21.1;
        maksPotongan = 20000
    } else if (voucher === "DumbWaysMantap") {
        minimalBeli = 80000;
        potonganPersen = 30;
        maksPotongan = 40000;
    } else {
        return console.log("voucher yang digunakan tidak valid"); 
    }

    if (totalBeli < minimalBeli) return console.log (`Total pembelian tidak memenuhi syarat pembelian yaitu sebesar: ${minimalBeli}`);

    let potongan = (potonganPersen / 100) * totalBeli;

    let potonganFinal;
    if (potongan > maksPotongan){
        potonganFinal = maksPotongan;
    } else {
        potonganFinal = potongan
    }

    let totalHarga = totalBeli - potonganFinal;

    let kembalian = uangBayar - totalHarga;

    let output = `- Uang yang harus dibayar : ${totalHarga} \n- Diskon : ${potonganFinal} \n- Kembalian : ${kembalian}`;

    return console.log(output);
}

hitungVoucher("DumbWaysMantap", 100000);