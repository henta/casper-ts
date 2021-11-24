const CodaSDK = require("@o1labs/client-sdk");


let keys = CodaSDK.genKeys();
console.info(keys);
keys = {
    privateKey: 'EKDooRz9qDc2CwmHszsZeV8WDu3qkBZBB8wazijNgTFAdKMxjcni',
    publicKey: 'B62qmdbSZaY7ZwLgKqG3xPLgeQp5D9fbzH1ysQXjwrN24CjSwJXS4Ra'
}

// 交易签名
//    to: "B62qivmihYxCUNR6RA1Wbd7hWNZMEaENXcbhQ4tD3TXixfxKhLEyFit",
//     memo: "102133"

// B62qm9kVztkhqvGwyyXt29xCcQGgKDzmEfLCZ9gEjygAwMzycR9NyjZ
let signedPayment = CodaSDK.signPayment({
    from: "B62qrY2ADDat3EXnabYfJUVbFcPpj3Hiw9nEVTdHid8ggwHxGEzT8pZ",
    amount: 1000000000 * 270.303,
    fee: 1000000,
    nonce: 6,
    // to: "B62qm7vP2JPj1d8XDmGUiv3GtwAfzuaxrdNsiXdWmZ7QqXZtzpVyGPG",
    // memo: "002abae02c4e4b93"
    to: "B62qivmihYxCUNR6RA1Wbd7hWNZMEaENXcbhQ4tD3TXixfxKhLEyFit",
    memo: "102535"

}, keys);

console.info(JSON.stringify(signedPayment, null, 2))

// 私钥生成地址
let publicKey = CodaSDK.derivePublicKey("");
console.info(publicKey)