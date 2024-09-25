// Diketahui sebuah data array sebagai berikut:
// [2, 24, 32, 22, 31, 100, 56, 21, 99, 7, 5, 37, 97, 25, 13, 11]
// Buatlah sebuah function yang bertugas untuk menyusun array berikut
// menggunakan recursive bubble sort. Fungsi tersebut akan
// mengembalikan 3 output, yaitu array yang sudah tersusun dan bilangan
// yang ganjil dan genap.
// Contoh:
// Input: sortArray([2, 24, 32, 22, 31])

// Output:
// Array: 2, 22, 24, 31, 32
// Ganjil: 31
// Genap: 2, 22, 24, 32

function rekursifBubleSort(arr, n = arr.length) {
    if (n == 1) return arr;

    for (let i = 0; i < n; i++) {
        if (arr[i] > arr[i + 1]) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        }
    }

    return rekursifBubleSort(arr, n - 1);
}

function oddEvenArr(arr){
    let arrayGanjil = [];
    let arrayGenap= [];

    for (let i = 0; i < arr.length; i++){
        if (arr[i] % 2 === 1){
            arrayGanjil.push(arr[i]);
        } else {
            arrayGenap.push(arr[i]);
        }
    }

    return {arrayGanjil, arrayGenap};
}

function sortArray(arr){
    let sortedArray = rekursifBubleSort(arr);
    let {arrayGanjil, arrayGenap} = oddEvenArr(sortedArray);

    console.log("Array: " + sortedArray.join(", "));
    console.log("Ganjil: " + arrayGanjil.join(", "));
    console.log("Genap: " + arrayGenap.join(", "));
}

let array = [2, 24, 32, 22, 31, 100, 56, 21, 99, 7, 5, 37, 97, 25, 13, 11];

sortArray([2, 24, 32, 22, 31]);

