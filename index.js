const fs = require('fs');
const http = require('http');
// const { url } = require('inspector');
// const path = require('path');
// const { rawListeners } = require('process');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
const { toUnicode } = require('punycode');

/////////////////////////////////////////
// FILES

// //Blocking,synchronous, way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn); // Lenh ghi ra
// const textOut = "Day la nhung gi ta biet ve avocado: ${textIn}.\nDuoc dang vao ngay ${Date.now()}";
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File da ghi de');

//Non-blocking, synchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log('Loi');
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt','utf-8', (err,data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('file cua ban da duoc ghi de');
//             })
//         });
//     });
// });
// console.log('Se doc file!')

/////////////////////////////////////////
// SEVER

///////////////////////////////////////
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
//tên miền rút gọn bằng chữ, thay vì dùng id
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const sever = http.createServer((req, res) => {
  // const { query, pathname } = url.parse(req.url, true);

  //check xem cái gì đang diễn ra
  // console.log(req.url);
  // console.log(url.parse(req.url, true));
  //
  const { query, pathname } = url.parse(req.url, true);

  // const pathName = req.url; // routing

  //Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    // console.log(cardsHtml);
    res.end(output);

    //Product page
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    // res.writeHead(200, {'Content-type': 'text/html'});
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // dirname la vi tri dang chua thu muc code
    // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err,data) => {
    //     const productData = JSON.parse(data);
    //     res.writeHead(200, {'Content-type': 'application/json'});
    //     // console.log(productData);
    //     res.end(data);
    // })

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
      'hoa-dep-trai': '123',
    });
    res.end('<h1> Khong tim thay dia chi!</h1>');
  }
  // console.log(req);
  // res.end('Loi chao tu "Server anh iu" ne!');
});

sever.listen(8000, '127.0.0.1', () => {
  console.log('Dang lang nghe yeu cau tu cong chua Dieu');
});
