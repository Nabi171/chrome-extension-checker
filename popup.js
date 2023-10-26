document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('extractBtn').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    function: extractTableData,
                },
                function (results) {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    } else {
                        let extractedData = results[0].result;
                        console.log(extractedData);

                        extractedData.forEach((dataItem, index) => {
                            let mappedData = {
                                "id": index + 1,  // Ajusta este valor si es necesario
                                "crypto_id": 1,  // Ajusta este valor si es necesario
                                "exchange_id": 1,  // Ajusta este valor si es necesario
                                "country_id": 1,  // Ajusta este valor si es necesario
                                "operator": dataItem.name,
                                "quantity": parseFloat(dataItem.quantity.replace(' USDT', '').replace(',', '')),
                                "price": parseFloat(dataItem.value),
                                "usdt": parseFloat(dataItem.quantity.replace(' USDT', '').replace(',', '')),
                                "fiat": 1,  // Ajusta este valor si es necesario
                                "method": dataItem.paymentMethod,
                                "type": dataItem.buttonText,
                                "datetime": new Date().toISOString().split('T')[0] + " 00:00:00",
                                "created_at": new Date().toISOString(),
                                "updated_at": new Date().toISOString()
                            };

                            // Enviamos la solicitud POST para cada objeto
                            fetch('https://p2p.elsazonrestaurant.com/api/crypto-prices', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(mappedData)
                            }).then(response => response.json())
                                .then(data => {
                                    console.log('Success:', data);

                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                });

                            // New node.js post API
                            fetch('http://localhost:5000/binance-post/', {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(mappedData)
                            }).then(response => response.json())
                                .then(data => {
                                    console.log('Success: done', data);
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                });
                        });
                    }
                });
        });
    });
    document.getElementById('extractKuCoinBtn').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    function: extractKucoinTableData,
                },
                function (results) {
                    console.log(results)
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    } else {
                        let extractedData = results[0].result;
                        console.log(extractedData);

                        // extractedData.forEach((dataItem, index) => {
                        //     let mappedData = {
                        //         "id": index + 1,  // Ajusta este valor si es necesario
                        //         "crypto_id": 1,  // Ajusta este valor si es necesario
                        //         "exchange_id": 1,  // Ajusta este valor si es necesario
                        //         "country_id": 1,  // Ajusta este valor si es necesario
                        //         "operator": dataItem.name,
                        //         "quantity": parseFloat(dataItem.quantity.replace(' USDT', '').replace(',', '')),
                        //         "price": parseFloat(dataItem.value),
                        //         "usdt": parseFloat(dataItem.quantity.replace(' USDT', '').replace(',', '')),
                        //         "fiat": 1,  // Ajusta este valor si es necesario
                        //         "method": dataItem.paymentMethod,
                        //         "type": dataItem.buttonText,
                        //         "datetime": new Date().toISOString().split('T')[0] + " 00:00:00",
                        //         "created_at": new Date().toISOString(),
                        //         "updated_at": new Date().toISOString()
                        //     };

                        //     // Enviamos la solicitud POST para cada objeto
                        //     // fetch('https://p2p.elsazonrestaurant.com/api/crypto-prices', {
                        //     //     method: 'POST',
                        //     //     headers: {
                        //     //         'Content-Type': 'application/json',
                        //     //     },
                        //     //     body: JSON.stringify(mappedData)
                        //     // }).then(response => response.json())
                        //     //     .then(data => {
                        //     //         console.log('Success:', data);

                        //     //     })
                        //     //     .catch((error) => {
                        //     //         console.error('Error:', error);
                        //     //     });

                        //     // New node.js post API
                        //     // fetch('http://localhost:5000/binance-post/', {
                        //     //     method: 'PUT',
                        //     //     headers: {
                        //     //         'Content-Type': 'application/json',
                        //     //     },
                        //     //     body: JSON.stringify(mappedData)
                        //     // }).then(response => response.json())
                        //     //     .then(data => {
                        //     //         console.log('Success: done', data);
                        //     //     })
                        //     //     .catch((error) => {
                        //     //         console.error('Error:', error);
                        //     //     });
                        // });
                    }
                });
        });
    });



    function extractTableData() {
        const rows = document.querySelectorAll('tr.bn-table-row');
        const data = [];

        rows.forEach(row => {
            const name = row.querySelector('td:nth-child(1) a').innerText;
            const valueInfo = row.querySelector('td:nth-child(2) div.css-1kj0ifu');
            const value = valueInfo.querySelector('div.css-onyc9z').innerText;
            const currency = valueInfo.querySelector('div.css-1cjl26j').innerText;
            const quantity = row.querySelector('td:nth-child(3) div.css-1f978ju').innerText;
            const paymentMethod = row.querySelector('td:nth-child(4) div.PaymentMethodItem__text').innerText;
            const buttonText = row.querySelector('td:nth-child(5) button').innerText;

            data.push({
                name,
                value,
                currency,
                quantity,
                paymentMethod,
                buttonText
            });
        });

        console.log(data);
        return data;
    }
    function extractKucoinTableData() {
        const rows = document.querySelectorAll('tbody.tr.css-tjxdah');
        const data = [];

        rows.forEach(row => {
            const name = row.querySelector('td:nth-child(0) name_RErOG').innerText;
            // const valueInfo = row.querySelector('td:nth-child(2) div.css-1kj0ifu');
            // const value = valueInfo.querySelector('div.css-onyc9z').innerText;
            // const currency = valueInfo.querySelector('div.css-1cjl26j').innerText;
            // const quantity = row.querySelector('td:nth-child(3) div.css-1f978ju').innerText;
            // const paymentMethod = row.querySelector('td:nth-child(4) div.PaymentMethodItem__text').innerText;
            // const buttonText = row.querySelector('td:nth-child(5) button').innerText;

            data.push({
                name,
                // value,
                // currency,
                // quantity,
                // paymentMethod,
                // buttonText
            });
        });

        console.log(data);
        return data;
    }
});

// 
