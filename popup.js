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
                    console.log(results);
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    } else {
                        let extractedData = results[0].result;
                        console.log(extractedData);
    
                        extractedData.forEach((dataItem, index) => {
                            let mappedData = {
                                "id": index + 1,
                                "crypto_id": 1,
                                "exchange_id": 1,
                                "country_id": 1,
                                "operator": dataItem.name,
                                "quantity": parseFloat(dataItem.quantity.replace(' USDT', '').replace(',', '')),
                                "price": parseFloat(dataItem.value),
                                "usdt": parseFloat(dataItem.quantity.replace(' USDT', '').replace(',', '')),
                                "fiat": 1,
                                "method": dataItem.paymentMethod,
                                "type": dataItem.buttonText,
                                "datetime": new Date().toISOString().split('T')[0] + " 00:00:00",
                                "created_at": new Date().toISOString(),
                                "updated_at": new Date().toISOString()
                            };
    
                            // Send data to an API endpoint (commented out)
                            // You would need to uncomment and provide the actual API endpoint details to send the data.
                        });
                    }
                });
        });
    });





    document.getElementById('extractPaxfulBtn').addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    function: extractPatchfulData,
                },
                function (results) {
                    console.log(results);
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError);
                    } else {
                        let extractedData = results[0].result;
                        console.log(extractedData);
    
                        extractedData.forEach((dataItem, index) => {
                            let mappedData = {
                                "id": index + 1,
                                "crypto_id": 1,
                                "exchange_id": 1,
                                "country_id": 1,
                                "operator": dataItem.name,
                                "quantity": parseFloat(dataItem.quantity.replace(' USDT', '').replace(',', '')),
                                "price": parseFloat(dataItem.value),
                                "usdt": parseFloat(dataItem.quantity.replace(' USDT', '').replace(',', '')),
                                "fiat": 1,
                                "method": dataItem.paymentMethod,
                                "type": dataItem.buttonText,
                                "datetime": new Date().toISOString().split('T')[0] + " 00:00:00",
                                "created_at": new Date().toISOString(),
                                "updated_at": new Date().toISOString()
                            };
    
                            // Send data to an API endpoint (commented out)
                            // You would need to uncomment and provide the actual API endpoint details to send the data.
                        });
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
        // const rows = document.querySelectorAll('tbody.tr.css-tjxdah');
        const data3=[]
        const rows3 = document.querySelectorAll('tbody tr.css-tjxdah');

        rows3.forEach(row => {
            const name3 = row.querySelector('td').innerText;
            data3.push({
                name3,
       
            });
        });
        console.log(data3);
      
        const data2 = [];
        const elements= document.querySelector('th.css-16tlf0q');
        const datas=elements.innerText
   
        const rows = document.querySelector('tbody tr.css-tjxdah');
        // console.log(rows)
        const data = [];
         
        // rows.forEach(row => {
            const name = rows.querySelector('td').innerText;
   

            data.push({
                name,
           
            });
        // });

            data2.push({
           
                datas
            });

        console.log('this is data',data)
        console.log('this is data2',data2)
        return data,data2;
    }
});



function extractPatchfulData() {

    const rows2 = document.querySelectorAll('div#p2pConverter div.react-app div div.row div div div');
    const rows3 = document.querySelector('div#p2pConverter div.react-app div div.row div div div');
    console.log('row3',rows3)
    const data2 = [];

    rows2.forEach(row => {
        const Btc = row.querySelector('div')?.innerText;
        const Amount = row.querySelector('div#react-select-2-group-1-heading')?.innerText;
        const Value= row.querySelector('div#react-select-2-option-0-0 span:nth-child(1)')?.innerText;
        const Value2= row.querySelector('div#react-select-2-option-0-0 span:nth-child(2)')?.innerText;
        const Value3= row.querySelector('div#react-select-2-option-1-1 span:nth-child(1)')?.innerText;
        const Value4= row.querySelector('div#react-select-2-option-1-1 span:nth-child(2)')?.innerText;
        const Value5= row.querySelector('div#react-select-2-option-1-2 span:nth-child(1)')?.innerText;
        const Value6= row.querySelector('div#react-select-2-option-1-2 span:nth-child(2)')?.innerText;
        const Value7= row.querySelector('div#react-select-2-option-1-3 span:nth-child(1)')?.innerText;
        const Value8= row.querySelector('div#react-select-2-option-1-3 span:nth-child(2)')?.innerText;
        const Value9= row.querySelector('div#react-select-2-option-1-4 span:nth-child(1)')?.innerText;
        const Value10= row.querySelector('div#react-select-2-option-1-4 span:nth-child(2)')?.innerText;
        const Value11= row.querySelector('div#react-select-2-option-1-5 span:nth-child(1)')?.innerText;
        const Value12= row.querySelector('div#react-select-2-option-1-5 span:nth-child(2)')?.innerText;
        const Value13= row.querySelector('div#react-select-2-option-1-6 span:nth-child(1)')?.innerText;
        const Value14= row.querySelector('div#react-select-2-option-1-6 span:nth-child(2)')?.innerText;
        const Value15= row.querySelector('div#react-select-2-option-1-7 span:nth-child(1)')?.innerText;
        const Value16= row.querySelector('div#react-select-2-option-1-7 span:nth-child(2)')?.innerText;
        const Value17= row.querySelector('div#react-select-2-option-1-8 span:nth-child(1)')?.innerText;
        const Value18= row.querySelector('div#react-select-2-option-1-8 span:nth-child(2)')?.innerText;
        const Value19= row.querySelector('div#react-select-2-option-1-9 span:nth-child(1)')?.innerText;
        const Value20= row.querySelector('div#react-select-2-option-1-9 span:nth-child(2)')?.innerText;
        const Value21= row.querySelector('div#react-select-2-option-1-10 span:nth-child(1)')?.innerText;
        const Value22= row.querySelector('div#react-select-2-option-1-10 span:nth-child(2)')?.innerText;
        const Value23= row.querySelector('div#react-select-2-option-1-11 span:nth-child(1)')?.innerText;
        const Value24= row.querySelector('div#react-select-2-option-1-11 span:nth-child(2)')?.innerText;
        const Value25= row.querySelector('div#react-select-2-option-1-12 span:nth-child(1)')?.innerText;
        const Value26= row.querySelector('div#react-select-2-option-1-12 span:nth-child(2)')?.innerText;
        const Value27= row.querySelector('div#react-select-2-option-1-13 span:nth-child(1)')?.innerText;
        const Value28= row.querySelector('div#react-select-2-option-1-13 span:nth-child(2)')?.innerText;
        const Value29= row.querySelector('div#react-select-2-option-1-14 span:nth-child(1)')?.innerText;
        const Value30= row.querySelector('div#react-select-2-option-1-14 span:nth-child(2)')?.innerText;
        const Value31= row.querySelector('div#react-select-2-option-1-15 span:nth-child(2)')?.innerText;
        const Value32= row.querySelector('div#react-select-2-option-1-15 span:nth-child(1)')?.innerText;
        const Value33= row.querySelector('div#react-select-2-option-1-16 span:nth-child(2)')?.innerText;
        const Value34= row.querySelector('div#react-select-2-option-1-16 span:nth-child(1)')?.innerText;
        const Value35= row.querySelector('div#react-select-2-option-1-17 span:nth-child(2)')?.innerText;
        const Value36= row.querySelector('div#react-select-2-option-1-17 span:nth-child(1)')?.innerText;
        const Value37= row.querySelector('div#react-select-2-option-1-18 span:nth-child(2)')?.innerText;
        const Value38= row.querySelector('div#react-select-2-option-1-18 span:nth-child(1)')?.innerText;
        const Value39= row.querySelector('div#react-select-2-option-1-19 span:nth-child(2)')?.innerText;
        const Value40= row.querySelector('div#react-select-2-option-1-19 span:nth-child(1)')?.innerText;
        const Value41= row.querySelector('div#react-select-2-option-1-20 span:nth-child(2)')?.innerText;
        const Value42= row.querySelector('div#react-select-2-option-1-20 span:nth-child(1)')?.innerText;
        const Value43= row.querySelector('div#react-select-2-option-1-21 span:nth-child(2)')?.innerText;
        const Value44= row.querySelector('div#react-select-2-option-1-21 span:nth-child(1)')?.innerText;
        const Value45= row.querySelector('div#react-select-2-option-1-22 span:nth-child(2)')?.innerText;
        const Value451= row.querySelector('div#react-select-2-option-1-22 span:nth-child(1)')?.innerText;
        const Value46= row.querySelector('div#react-select-2-option-1-23 span:nth-child(1)')?.innerText;
        const Value47= row.querySelector('div#react-select-2-option-1-23 span:nth-child(2)')?.innerText;
        const Value48= row.querySelector('div#react-select-2-option-1-24 span:nth-child(1)')?.innerText;
        const Value49= row.querySelector('div#react-select-2-option-1-24 span:nth-child(2)')?.innerText;
        const Value50= row.querySelector('div#react-select-2-option-1-25 span:nth-child(1)')?.innerText;
        const Value51= row.querySelector('div#react-select-2-option-1-25 span:nth-child(2)')?.innerText;
        const Value52= row.querySelector('div#react-select-2-option-1-26 span:nth-child(1)')?.innerText;
        const Value53= row.querySelector('div#react-select-2-option-1-26 span:nth-child(2)')?.innerText;
        const Value54= row.querySelector('div#react-select-2-option-1-27 span:nth-child(1)')?.innerText;
        const Value55= row.querySelector('div#react-select-2-option-1-27 span:nth-child(2)')?.innerText;
        const Value56= row.querySelector('div#react-select-2-option-1-28 span:nth-child(1)')?.innerText;
        const Value57= row.querySelector('div#react-select-2-option-1-28 span:nth-child(2)')?.innerText;
        const Value58= row.querySelector('div#react-select-2-option-1-29 span:nth-child(1)')?.innerText;
        const Value59= row.querySelector('div#react-select-2-option-1-29 span:nth-child(2)')?.innerText;
        const Value60= row.querySelector('div#react-select-2-option-1-30 span:nth-child(1)')?.innerText;
        const Value61= row.querySelector('div#react-select-2-option-1-30 span:nth-child(2)')?.innerText;
        const Value62= row.querySelector('div#react-select-2-option-1-31 span:nth-child(1)')?.innerText;
        const Value63= row.querySelector('div#react-select-2-option-1-31 span:nth-child(2)')?.innerText;
        const Value64= row.querySelector('div#react-select-2-option-1-32 span:nth-child(1)')?.innerText;
        const Value65= row.querySelector('div#react-select-2-option-1-32 span:nth-child(2)')?.innerText;
        const Value66= row.querySelector('div#react-select-2-option-1-33 span:nth-child(1)')?.innerText;
        const Value67= row.querySelector('div#react-select-2-option-1-33 span:nth-child(2)')?.innerText;
        const Value68= row.querySelector('div#react-select-2-option-1-34 span:nth-child(1)')?.innerText;
        const Value69= row.querySelector('div#react-select-2-option-1-34 span:nth-child(2)')?.innerText;
        const Value70= row.querySelector('div#react-select-2-option-1-35 span:nth-child(1)')?.innerText;
        const Value71= row.querySelector('div#react-select-2-option-1-35 span:nth-child(2)')?.innerText;
        const Value72= row.querySelector('div#react-select-2-option-1-36 span:nth-child(1)')?.innerText;
        const Value73= row.querySelector('div#react-select-2-option-1-36 span:nth-child(2)')?.innerText;
        const Value74= row.querySelector('div#react-select-2-option-1-37 span:nth-child(1)')?.innerText;
        const Value75= row.querySelector('div#react-select-2-option-1-37 span:nth-child(2)')?.innerText;
        const Value76= row.querySelector('div#react-select-2-option-1-38 span:nth-child(1)')?.innerText;
        const Value77= row.querySelector('div#react-select-2-option-1-38 span:nth-child(2)')?.innerText;
        const Value78= row.querySelector('div#react-select-2-option-1-39 span:nth-child(1)')?.innerText;
        const Value79= row.querySelector('div#react-select-2-option-1-39 span:nth-child(2)')?.innerText;
        const Value80= row.querySelector('div#react-select-2-option-1-40 span:nth-child(1)')?.innerText;
        const Value81= row.querySelector('div#react-select-2-option-1-40 span:nth-child(2)')?.innerText;
        const Value82= row.querySelector('div#react-select-2-option-1-41 span:nth-child(1)')?.innerText;
        const Value83= row.querySelector('div#react-select-2-option-1-41 span:nth-child(2)')?.innerText;
        const Value84= row.querySelector('div#react-select-2-option-1-42 span:nth-child(1)')?.innerText;
        const Value85= row.querySelector('div#react-select-2-option-1-42 span:nth-child(2)')?.innerText;
        const Value86= row.querySelector('div#react-select-2-option-1-43 span:nth-child(1)')?.innerText;
        const Value87= row.querySelector('div#react-select-2-option-1-43 span:nth-child(2)')?.innerText;
        const Value88= row.querySelector('div#react-select-2-option-1-44 span:nth-child(1)')?.innerText;
        const Value89= row.querySelector('div#react-select-2-option-1-44 span:nth-child(2)')?.innerText;
        const Value90= row.querySelector('div#react-select-2-option-1-45 span:nth-child(1)')?.innerText;
        const Value91= row.querySelector('div#react-select-2-option-1-45 span:nth-child(2)')?.innerText;
        const Value92= row.querySelector('div#react-select-2-option-1-46 span:nth-child(1)')?.innerText;
        const Value93= row.querySelector('div#react-select-2-option-1-46 span:nth-child(2)')?.innerText;
        const Value94= row.querySelector('div#react-select-2-option-1-47 span:nth-child(1)')?.innerText;
        const Value95= row.querySelector('div#react-select-2-option-1-47 span:nth-child(2)')?.innerText;
        const Value96= row.querySelector('div#react-select-2-option-1-48 span:nth-child(1)')?.innerText;
        const Value97= row.querySelector('div#react-select-2-option-1-48 span:nth-child(2)')?.innerText;
        const Value98= row.querySelector('div#react-select-2-option-1-49 span:nth-child(1)')?.innerText;
        const Value99= row.querySelector('div#react-select-2-option-1-49 span:nth-child(2)')?.innerText;
        const Value100= row.querySelector('div#react-select-2-option-1-50 span:nth-child(1)')?.innerText;
        const Value101= row.querySelector('div#react-select-2-option-1-50 span:nth-child(2)')?.innerText;
        const Value102= row.querySelector('div#react-select-2-option-1-51 span:nth-child(1)')?.innerText;
        const Value103= row.querySelector('div#react-select-2-option-1-51 span:nth-child(2)')?.innerText;
        const Value104= row.querySelector('div#react-select-2-option-1-52 span:nth-child(1)')?.innerText;
        const Value105= row.querySelector('div#react-select-2-option-1-52 span:nth-child(2)')?.innerText;
        const Value106= row.querySelector('div#react-select-2-option-1-53 span:nth-child(1)')?.innerText;
        const Value107= row.querySelector('div#react-select-2-option-1-53 span:nth-child(2)')?.innerText;
        const Value108= row.querySelector('div#react-select-2-option-1-54 span:nth-child(1)')?.innerText;
        const Value109= row.querySelector('div#react-select-2-option-1-54 span:nth-child(2)')?.innerText;
        const Value110= row.querySelector('div#react-select-2-option-1-55 span:nth-child(1)')?.innerText;
        const Value111= row.querySelector('div#react-select-2-option-1-55 span:nth-child(2)')?.innerText;
        const Value112= row.querySelector('div#react-select-2-option-1-56 span:nth-child(1)')?.innerText;
        const Value113= row.querySelector('div#react-select-2-option-1-56 span:nth-child(2)')?.innerText;
       //done



        data2.push({
            Btc,
            Amount,
            Value,
            Value2,
            Value3,
            Value4,
            Value5,
            Value6,
            Value7,
            Value8,
            Value9,
            Value10,
            Value11,
            Value12,
            Value13,
            Value14,
            Value15,
            Value16,
            Value17,
            Value18,
            Value19,
            Value20,
            Value21,
            Value22,
            Value23,
            Value24,
            Value25,
            Value26,
            Value27,
            Value28,
            Value29,
            Value30,
            Value31,
            Value32,
            Value33,
            Value34,
            Value35,
            Value36,
            Value37,
            Value38,
            Value39,
            Value40,
            Value41,
            Value42,
            Value43,
            Value44,
            Value45,
            Value451,
            Value46,
            Value47,
            Value48,
            Value49,
            Value50,
            Value51,
            Value52,
            Value53,
            Value54,
            Value55,
            Value56,
            Value57,
            Value58,
            Value59,
            Value60,
            Value61,
            Value62,
            Value63,
            Value64,
            Value65,
            Value67,
            Value68,
            Value69,
            Value70,
            Value71,
            Value72,
            Value73,
            Value74,
            Value75,
            Value76,
            Value77,
            Value78,
            Value79,
            Value80,
            Value81,
            Value82,
            Value83,
            Value84,
            Value85,
            Value86,
            Value87,
            Value88,
            Value89,
            Value90,
            Value91,
            Value92,
            Value93,
            Value94,
            Value95,
            Value96,
            Value97,
            Value98,
            Value99,
            Value100,
            Value101,
            Value102,
            Value103,
            Value104,
            Value105,
            Value106,
            Value107,
            Value108,
            Value109,
            Value110,
            Value111,
            Value112,
            Value113,
           
           

        });
    });

    console.log(data2);
    return data2;
}
