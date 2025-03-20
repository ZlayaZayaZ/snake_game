//Возвращает случайное число.
function rand (min, max) {var k = Math.floor(Math.random() * (max - min) + min); return (Math.round( k / s) * s);}
//Функция для создания нового яблока.
function newA () {a = [rand(0, gP.width),rand(0, gP.height)];}
//Функция для создания тела змейки из одного элемента.
function newB () {sBody = [{x: 0,y: 0}];}

let gP = document.getElementById('game'), //Достаем canvas.
	//Получаем "контекст" (методы для рисования в canvas).
    g = gP.getContext('2d'), 
	sBody = null, //Тело змейки, мы потом его создадим.
	d = 1, //Направление змейки 1 - право, 2 - вниз 3 - влево, 4 - вверх.
	a = null, //Яблоко, массив, 0 элемент - x, 1 элемент - y.
	s = 30; newB(); newA(); //Создаем змейку.

gP.width = 1800; //Сохраняем четкость изображения, выставив полную ширину экрана.
gP.height = 1800;

const buttonAll = document.querySelector(".buttonAll");
let game = setInterval(gameFn, buttonAll.querySelector('.green').getAttribute('data-speed'));

function gameFn(){
	g.clearRect(0,0,gP.width,gP.height); //Очищаем старое.
	g.fillStyle = "red"; //Даем красный цвет для рисования "яблока".
	g.fillRect(...a, s, s); //Рисуем "яблоко" на холсте 30x30 с координатами a[0] и a[1].
	g.fillStyle = "#000"; //А теперь черный цвет для змейки.
    if (localStorage.getItem("record")) {
        document.getElementById("record").textContent = localStorage.getItem("record")
    }
    if (localStorage.getItem("count")) {
        document.getElementById("count").textContent = localStorage.getItem("count")
    }

    sBody.forEach(function(el, i){
   
        //Проверка на то, что яблоко ушло за границы окна, мы его не можем увидеть.
        if (a[0] + s >= gP.width || a[1] + s >= gP.height) newA();
    
        //Проверка на столкновение.
        var last = sBody.length - 1;
        if ( el.x == sBody[last].x && el.y == sBody[last].y && i < last) { 
            //сохраняем результ в localStorage и обновляем статистику 
            const nowCheck = Number(document.getElementById("check").textContent)
            if (localStorage.getItem("record")) {
                if (Number(localStorage.getItem("record")) < nowCheck) {
                    localStorage.setItem("record", nowCheck);
                    document.getElementById("record").textContent = nowCheck
                    localStorage.setItem("count", "1");
                } else {
                    localStorage.setItem("count", Number(localStorage.getItem("count")) + 1);
                }
            } else {
                localStorage.setItem("record", nowCheck)
                localStorage.setItem("count", "1");
            }
            // document.getElementById("count").textContent = Number(document.getElementById("count").textContent) + 1
            sBody.splice(0,last); //Стираем тело змейки.
            sBody = [{x:0,y:0}]; //Создаем его заново.
            document.getElementById("check").textContent = 0;
            d = 1;  //Меняем направление на правую сторону.
        }
    
    });
    
    //+
    // Сохраняем хвост и голову змейки.
    var m = sBody[0], f = {x: m.x,y: m.y}, l = sBody[sBody.length - 1];
    
    /*
    
        Далее мы создаем тот самый эффект движения.
        Напомню, что мы меняем координаты лишь хвоста, оставляя неподвижным 
        остальную часть тела. 
    
        Делается это путем проверки направления змейки (изначально -  это 1, - право), 
        а затем уже изменяем координаты. Соответственно, комментарии все описывают.
    
    */
    
    
    //Если направление вправо, то тогда сохраняем Y, но меняем X на + s.
    if (d == 1)  f.x = l.x + s, f.y = Math.round(l.y / s) * s;
    // Если направление вниз, то сохраняем X, но меняем Y на + s.
    if (d == 2) f.y = l.y + s, f.x = Math.round(l.x / s) * s;
    //Если направление влево, то сохраняем Y, но меняем X на -s.
    if (d == 3) f.x = l.x - s, f.y = Math.round(l.y / s) * s;
    //Если направление вверх, то сохраняем X, Но меняем Y на -s.
    if (d == 4) f.y = l.y - s, f.x = Math.round(l.x / s) * s;

    sBody.push(f); //Добавляем хвост после головы с новыми координатами.
sBody.splice(0,1); //Удаляем хвост.

//Отрисовываем каждый элемент змейки.
sBody.forEach(function(pob){
    //Если мы двигаемся вправо, то если позиция элемента по X больше, чем ширина экрана, то ее надо обнулить
    if (d == 1) if (pob.x > Math.round(gP.width / s) * s) pob.x = 0;
    //Если мы двигаемся вниз, то если позиция элемента по X больше, чем высота экрана, то ее надо обнулить.
    if (d == 2) if (pob.y > Math.round(gP.height / s) * s) pob.y = 0;
   //Если мы двигаемся влево, и позиция по X меньше нуля, то мы ставим элемент в самый конец экрана (его ширина).
    if (d == 3) if (pob.x < 0) pob.x = Math.round(gP.width / s) * s;
    //Если мы двигаемся вверх, и позиция по Y меньше нуля, то мы ставим элемент в самый низ экрана (его высоту).
    if (d == 4) if (pob.y < 0) pob.y = Math.round(gP.height / s) * s;
   
    //И тут же проверка на то, что змейка съела яблоко.
    if (pob.x == a[0] && pob.y == a[1]) {
        newA();
        sBody.unshift({x: f.x - s, y:l.y});
        // добавление нового результата в счет статистики
        document.getElementById("check").textContent = Number(document.getElementById("check").textContent) + 1;
        // check.textContent = Number(check.textContent) + 1;
    }
    
    //А теперь рисуем элемент змейки.
    g.fillRect(pob.x, pob.y, s, s);		
});
};

onkeydown = function (e) {
	let k = e.keyCode;
	if ([38,39,40,37].indexOf(k) >= 0) e.preventDefault();
	if (k == 39 && d != 3) d = 1; //Вправо
	if (k == 40 && d != 4) d = 2; //Вниз
	if (k == 37 && d != 1) d = 3; //Влево
	if (k == 38 && d != 2) d = 4; //Вверх
};

const buttonsArray = Array.from(buttonAll.children);
buttonsArray.forEach(function(button) {
    button.addEventListener('click', () => {
        if (button.classList.contains("red")) {
            const oldSpeed = buttonAll.querySelector(".green")
            oldSpeed.classList.remove("green");
            oldSpeed.classList.add("red");
            button.classList.remove("red");
            button.classList.add("green");
            clearInterval(game);
            game = setInterval(gameFn, buttonAll.querySelector('.green').getAttribute('data-speed'));
        }
    }, false)
});

const pause = document.querySelector(".pause");
const go = document.querySelector('.go');

pause.addEventListener('click', () => {
    clearInterval(game);
    pause.classList.add('hidden');
    go.classList.remove('hidden');
}, false)

go.addEventListener('click', () => {
    game = setInterval(gameFn, buttonAll.querySelector('.green').getAttribute('data-speed'));
    go.classList.add('hidden');
    pause.classList.remove('hidden');
}, false)

const recordReset = document.querySelector(".recordReset")
recordReset.addEventListener('click', () => {
    localStorage.clear()
    window.location.reload()
}, false)
