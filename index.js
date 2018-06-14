const express = require('express')
const app = express()
var request = require('request');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));

const session = require('express-session');
app.use(session({
    secret: 'SAJDASD$qwE23E89QDKAJSDKASDASD2ASD523e',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 55000
    }
}));

app.get('/', (req, res) => {
    // res.json('Hello World!')
    const { tinh, huyen, xa } = req.session;
    const session_temp = { tinh, huyen, xa };
    console.log(session_temp);
    request('https://thongtindoanhnghiep.co/api/city', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body)
            res.render('index', {data : data.LtsItem, session_temp : session_temp});
        }
    })
});

app.get('/lay-huyen-cua-tinh/:id_tinh/:tinh', (req, res)=>{
    const  { id_tinh, tinh } = req.params;
    req.session.tinh = { 
        id_tinh, tinh
    }; 
    request(`https://thongtindoanhnghiep.co/api/city/${id_tinh}/district`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body)
            res.json({
                error: false,
                data : data
            });
        }
    })
});


app.get('/lay-xa-cua-tinh-huyen/:id_huyen/:huyen', (req, res)=>{
    const  { id_huyen, huyen } = req.params;
    req.session.huyen = {
        id_huyen, huyen
    };
    request(`https://thongtindoanhnghiep.co/api/district/${id_huyen}/ward`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body)
            res.json({
                error: false,
                data : data
            });
        }
    })
});

app.get('/xa-api/:id_xa/:xa', (req, res)=>{
    const  { id_xa, xa } = req.params;
    req.session.xa = {
        id_xa, xa
    };
    res.json({
        error: false,
        message: success
    })
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))