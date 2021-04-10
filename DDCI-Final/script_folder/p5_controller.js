// Object Declare
class Round{
    constructor(color){
        this.name = color;
        this.fillColor = "#FF0000";
        this.outlineColor = null;
        this.xPos = 0;
        this.yPos = 150;
        this.size = 100;
    }

    getConfig(){
        return `This is ${this.name} , position at ${this.xPos}, ${this.yPos}`
    }

    animationTest(){
        this.xPos += 2;
        this.yPos += 0.5;
    }
}

class Point extends Round {
    constructor(lati, long, name, weather, injuries, reason,location){
        super(name);
        this.lati = lati;
        this.long = long;
        this.weather = weather;
        this.injuries = injuries;
        this.reason = reason;
        this.location = location;
    }
    getConfig(){
        return `This is ${this.name} , position at ${this.lati}, ${this.long}`
    }
    translateDetails(){
        this.xPos = parseFloat(this.lati);
        this.yPos = parseFloat(this.long);
        switch (this.reason) {
            case '未注意車前狀態':
            case '未保持行車安全距離':
            case '上下車輛未注意安全':
            case '未保持行車安全間隔':
            case '未待乘客安全上下開車':
            case '未靠右行駛':
            case '在道路上嬉戲或奔走不定':
                this.reason = 'attention';
                break;
            case '未依規定讓車':
            case '未依規定減速':
            case '未依規定使用燈光':
            case '未依規定行走行人穿越道、地下道、天橋而穿越道路':
            case '右轉彎未依規定':
            case '左轉彎未依規定':
            case '違反號誌管制或指揮':
            case '違反特定標誌(線)禁制':
            case '違規超車':
            case '違規停車或暫停不當而肇事':
                this.reason = 'rules';
                break;
            case '方向操縱系統故障':
            case '交通管制設施失靈或損毀':
            case '其他引起事故之故障':
            case '其他引起事故之疏失或行為':
            case '其他引起事故之違規或不當行為':
                this.reason = 'out of control';
                break;
            default:
                this.reason = 'others';
                break;
        }
    }

    changeColor(condition){
        if (condition == "weather") {
            var tmpWeather = this.weather;
            switch (tmpWeather) {
                case '晴':
                    this.fillColor = "#FFFF66";
                    break;
                case '雨':
                    this.fillColor = "#FF0000";
                    break;
                case '暴雨':
                    this.fillColor = "#FF0000";
                    break;
                case '陰':
                    this.fillColor = "#804000";
                    break;
                default:
                    this.fillColor = "#FFFFFF";
                    break;
            }
        }
        if (condition == "reason") {
            switch (this.reason) {
                case 'attention':
                    this.fillColor = "#FFE66D";
                    break;
                case 'rules':
                    this.fillColor = "#FF6B6B";
                    break;
                case 'out of control':
                    this.fillColor = "#7899D4";
                    break;
                case 'others':
                    this.fillColor = "#1A535C";
                default:
                    break;
            }
        }
    }
}

// const redRound = new Round("Red");
// console.log(redRound.getConfig());

// Drawing Wrapper
function wrapper_circle(object){
    if (object.outlineColor == null) {
        noStroke();
    }else{
        stroke(object.outlineColor);
    }
    if (object.fillColor == null) {
        noFill();
    }else{
        fill(object.fillColor);
    }
    circle(object.xPos,object.yPos,object.size);
}

// Data Loader
var dataTable, latitude, longtitude, idList, weather, roadTypeList, injuriesList, accidentList, locationList;
var pointObjects = [];
function wrappper_loader(){
    return loadTable("./script_folder/109accident.csv", "csv", "header");
}
function dataInitial(){
    // console.log(dataTable.getRowCount()); 
    idList = dataTable.getColumn("案件編號");
    latitude = dataTable.getColumn(" GPS緯度");
    longtitude = dataTable.getColumn(" GPS經度");
    locationList = dataTable.getColumn("發生縣市名稱");
    weather = dataTable.getColumn(" 天候名稱");
    roadTypeList = dataTable.getColumn(" 道路型態大類別名稱");
    injuriesList = dataTable.getColumn(" 受傷人數");
    accidentList = dataTable.getColumn(" 肇因研判子類別名稱-主要");
    // console.log(latitude.length);
}
function addPointObjects(){
    var tmpObject;
    for (let index = 0; index < idList.length; index++) {
        tmpObject = new Point (latitude[index], longtitude[index], idList[index], weather[index], parseInt(injuriesList[index]), accidentList[index], locationList[index]);
        tmpObject.translateDetails();
        tmpObject.changeColor("reason");
        pointObjects.push(tmpObject);
    }
}

// parsing road-related data
var counterRoadObject = {};
var counterSectionObject = {};
var roadNameList = ["小東路", "東寧路", "東寧路西段", "勝利路", "育樂街", "民族路一段", "大學路西段", "大學路", "東豐路", "前鋒路", "長榮路三段", "林森路二段"];
var roadLanLonList = [
    [[23.001702, 120.213020], [23.001223, 120.215900], [23.000507, 120.225665], [22.998729, 120.231791], [22.998408, 120.234710], [22.998493, 120.239972]],  // 小東路
    [[22.992336, 120.217852], [22.992045, 120.221500], [22.988455, 120.233114]], // 東寧路
    [[22.992336, 120.217852], [22.992656, 120.214578], [22.994029, 120.213332]], // 東寧路西段
    [[22.987355, 120.217436], [22.996250, 120.218168], [23.003284, 120.218745], [23.005148, 120.218874],[23.005832, 120.218777],[23.006622, 120.218477]], // 勝利路
    [[22.991392, 120.214459], [22.995757, 120.214794], [22.995392, 120.218080]], // 育樂街
    [[22.994483, 120.211813], [22.994276, 120.215530]], // 民族路一段
    [[22.996885, 120.213565], [22.996271, 120.218100]], // 大學路西段
    [[22.996271, 120.218100], [22.995822, 120.223972]], // 大學路
    [[23.003986, 120.214258], [23.003295, 120.218704], [23.002762, 120.222456], [23.002455, 120.224702], [23.002001, 120.227111]], // 東豐路
    [[23.003872, 120.215077], [23.001433, 120.214626], [22.996865, 120.213594], [22.994445, 120.213181]], // 前鋒路
    [[23.000710, 120.222290], [22.998345, 120.222098], [22.995986, 120.221894], [22.992022, 120.221534]], // 長榮路三段
    [[23.000537, 120.224576], [22.998444, 120.224332], [22.995815, 120.224092], [22.993570, 120.223930], [22.991938, 120.223816], [22.991145, 120.224448]], // 林森路三段
];
function countEvents(status){
    switch (status) {
        case 'road':
            roadNameList.forEach(item => {
                counterRoadObject[item] = 0;
            });
            for (let index = 0; index < pointObjects.length; index++) {
                const element = pointObjects[index];
                var locationStr = element.location;
                for (let time = 0; time < roadNameList.length; time++) {
                    const currentRoad = roadNameList[time];
                    if (locationStr.indexOf(currentRoad) > 0) {
                        counterRoadObject[currentRoad] += 1;   
                    }   
                }
            }
            break;
        case 'section':
            roadLanLonList.forEach(item => {
                counterSectionObject[item] = 0;
            });
            break;
        default:
            break;
    }   
}

function trendColor(status,name) {
    let red;
    switch (status) {
        case 'road':
            let number = counterRoadObject[name];
            red = map(number, 0, 450, 10, 255);
            break;
        case 'section':
            break;
        default:
            break;
    }
    return red
}

// mappa.js
let canvas, maper;
const websiteSize= {
    w : window.innerWidth,
    h : window.innerHeight - 70
};
const printSize= {
    w : 7016,
    h : 4961
};

const mapStyle =[
    'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
];
const optionsSingle = {
    lat: 23.15,
    lng: 120.3,
    zoom: 11    ,
    style: mapStyle[2]
}

const optionsTrend = {
    lat: 22.994276,
    lng: 120.215530,
    zoom: 16    ,
    style: mapStyle[2]
}

const mappa = new Mappa('Leaflet');

// p5js
function preload(){
    dataTable = wrappper_loader();
}

var drawMode = "trend";
function setup(){
    dataInitial();
    addPointObjects();
    countEvents('road');
    countEvents('section');

    // canvas = createCanvas(printSize.w, printSize.h);
    canvas = createCanvas(websiteSize.w, websiteSize.h);
    if (drawMode == "trend") {
        maper = mappa.tileMap(optionsTrend);
    }else if (drawMode == "single") {
        maper = mappa.tileMap(optionsSingle);
    }
    maper.overlay(canvas);
    maper.onChange(drawPoints);
}

function drawPoints() {
    clear();

    switch (drawMode) {
        case 'single':
            for (let i = 0; i < pointObjects.length; i++) {
                var currenObject = pointObjects[i];
                if (maper.map.getBounds().contains({lat: currenObject.lati, lng: currenObject.long})) {
                    const pos = maper.latLngToPixel(currenObject.lati, currenObject.long);
                    noStroke();
                    fill(currenObject.fillColor);
                    size = map(currenObject.injuries, 0, 10, 1, 35);
                    ellipse(pos.x, pos.y, size, size);
                }
            }
            // 
            break;
        case 'trend':
            for (let i = 0; i < roadLanLonList.length; i++) {
                var currenObject = roadLanLonList[i];
                var currenName = roadNameList[i];
                stroke(trendColor('road',currenName),0,0);
                strokeWeight(7);
                for (let index = 0; index < currenObject.length -1; index++) {
                    const element = currenObject[index];
                    const elementNext = currenObject[index+1];
                    const pos_start = maper.latLngToPixel(element[0], element[1]);
                    const pos_end = maper.latLngToPixel(elementNext[0], elementNext[1]);
                    line(pos_start.x, pos_start.y, pos_end.x, pos_end.y);
                }
            }
            // maper = mappa.tileMap(optionsTrend);
            break;
        default:
            break;
    }
    wrapper_legends();
}

function clickFromHTML(status){
    switch (status) {
        case 'weather':
            for (let index = 0; index < pointObjects.length; index++) {
                const element = pointObjects[index];
                element.changeColor("weather");
            }
            break;
        case 'reason':
            for (let index = 0; index < pointObjects.length; index++) {
                const element = pointObjects[index];
                element.changeColor("reason");
            }
            break;
        case 'trend':
            drawMode = "trend";
            break;
        case 'single':
            // maper = mappa.tileMap(optionsSingle);
            drawMode = "single";
            break;
        default:
            break;
    }
    drawPoints();
}

var legends = {
    title : "Legends",
    trendScaleStart : "0",
    trendScaleEnd : "450",
    trendScaleUnit : "Unit : Cases",
    singleRoundScaleStart : "0",
    singleRoundScaleEnd : "10",
    singleRoundScaleUnit : "Unit : Injuries / Death",
    singleColor : ["#FFE66D", "#FF6B6B", "#7899D4", "#1A535C"],
    singleColorName : ['attention', 'rules', 'out of control','others']
};
function wrapper_legends() {
    let w = websiteSize.w;
    let h = websiteSize.h;
    switch (drawMode) {
        case 'single':
            noStroke();
            fill(255);
            rect(w - 170, h - 190, 160, 180, 5);
            fill(0);
            text(legends["title"], w - 150,  h - 170);
            text(legends["singleRoundScaleStart"], w - 150,  h - 120);
            text(legends["singleRoundScaleEnd"], w - 50,  h - 120);
            text(legends["singleRoundScaleUnit"], w - 130,  h - 100);
            for (let index = 0; index <  legends.singleColorName.length; index++) {
                const element =  legends.singleColorName[index];
                text(element, w - 150 + 30 * index,  h - 40);
            }
            strokeWeight(5);
            for (let i = 0; i < 10; i++) {
                stroke(0);
                fill(255);
                let xpos = w-150;
                let ypos = h-150;
                circle(xpos + 12 * i , ypos, 1 + 3.4*i);
            }
            for (let index = 0; index < legends.singleColor.length; index++) {
                const element = legends.singleColor[index];
                noStroke();
                fill(element);
                let xpos = w-135;
                let ypos = h-60;
                circle(xpos + 30 * index , ypos, 15);
            }
            break;
        case 'trend':
            noStroke();
            rect(w - 170, h - 100, 160, 90, 5);
            text(legends["title"], w - 150,  h - 80);
            text(legends["trendScaleStart"], w - 150,  h - 40);
            text(legends["trendScaleEnd"], w - 50,  h - 40);
            text(legends["trendScaleUnit"], w - 90,  h - 20);
            strokeWeight(5);
            for (let i = 0; i < 255; i++) {
                stroke(i,0,0);
                let xpos = w-150;
                let ypos = h-60
                let scale = 120 / 255;
                let next = i + 1
                line(xpos + i*scale, ypos, xpos + next*scale, ypos);
            }
            break;
        default:
            break;
    }
}

function keyPressed(){
    if (keyCode == 83){
        saveCanvas(canvas, 'myCanvas', 'png');
    }
}

// function mousePressed(){
//     saveCanvas(canvas, 'myCanvas', 'jpg');
// }

//道路類型 + 時間區間 = 傷亡人數 > 了解趨勢
//小東路跟北門路，交通號誌有問題
// GIS 資料欄位