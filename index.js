// 전역변수 관리하는 width, height
// *사용자가 중간에 화면을 줄인다면 어떻게 할 것인가
const width = window.innerWidth;
const height = window.innerHeight;

addWave();
drawBackgroundStar();
drawMainStar();
drawFish();
animateStarFalling();
animateFishMoving();
animateNightToDay();

//document.querySelector("#fish-canvas").addEventListener("animationstart", nightToDay, false);
function getWaveNum(){
	return width/300 > 5 ? Math.round(width/300) : 5;
}
function getWaveWidth(){
	return Math.round(width/getWaveNum());
}
function addWave(){
	
	const waveWrappers = document.getElementsByClassName('wave-wrapper');
	const waveWrapperNum = waveWrappers.length;
	
	// *화면 크기에 따른 파도 크기 설정
	const waveNum = getWaveNum();
	const waveWidth = getWaveWidth();
	const waveHeight = waveWidth*1.2;
	
	// wave의 수직 위치 정하기
	for(let i=0; i<waveWrapperNum; i++){
		waveWrappers[i].style.top = `calc(100vh - ${(waveWrapperNum-i)*0.5*waveHeight}px)`;
	}
	
	const hierarchy = [{
		type: "div",
		child: []
	}];
	const style = `width: ${waveWidth}px; height: ${waveHeight}px`;
	for(let i=0; i<waveNum+1; i++){
		hierarchy[0].child.push({
			type: "div",
			attrs: {class: "wave", style: style},
		});
	}
	
	// dom element를 만든 후
	getEle(hierarchy);
	// dom tree를 만든다
	makeEleTree(hierarchy);
	
	for(let i=0; i<waveWrapperNum; i++){
		waveWrappers[i].innerHTML = hierarchy[0].element.innerHTML;
	}
}

function drawBackgroundStar(){
	
	const ctx = document.getElementById('star-sky-canvas').getContext('2d');
	ctx.canvas.width = width;
	ctx.canvas.height = height - getWaveWidth()*2;
	// - 3*0.6*Math.round(width / 5);
	
	const baseColor = 'rgba(225, 215, 0, 0.7)';
	ctx.fillStyle = baseColor;
	
	ctx.beginPath();
	let coord;
	for(let i=0; i<100; i++){
		coord = getRandomCoord(width, height);
		ctx.moveTo(coord.x, coord.y);
		ctx.arc(coord.x, coord.y, 1*i*0.02, Math.PI*2, 0, true);
	}
	ctx.fill();
} 

function drawMainStar(){
	
	const starWrapper = document.getElementsByClassName('star-wrapper')[0];
	const stars = starWrapper.children;
	const starNum = stars.length;
	
	for(let i=0; i<starNum; i++){
		
		// *wave와 하늘 경계선 위치 공통
		const coord = getRandomCoord(width, height - getWaveWidth()*2);
		
		stars[i].setAttribute("class", "star");
		
		const starStyle = stars[i].style;
		starStyle.top = coord.y+"px";
		starStyle.left = coord.x+"px";
	}
}

function animateStarFalling(){
	// *중복코드
	const starWrapper = document.getElementsByClassName('star-wrapper')[0];
	const stars = starWrapper.children;
	const starNum = stars.length;
	
	for(let i=0; i<starNum; i++){
		// 시작 후 2초 후, 3초 동안 별이 떨어지기 시작
		stars[i].style.animation = "falling 3s 2s forwards linear";
	}
}

function animateFishMoving(){
	// 별이 떨이지고 난 후 물고기가 움직인다
	const starWrapper = document.getElementsByClassName('star-wrapper')[0];
	const stars = starWrapper.children;
	const canvas = document.getElementById('fish-canvas');

	stars[0].addEventListener("animationend", () => {
		const canvasEle = document.getElementById('fish-canvas');
		canvas.style.visibility = 'visible';
		// 10초 동안 오른쪽으로 물고기 움직임
		canvasEle.style.animation = 'fishMoving 10s infinite linear, drift 2s infinite linear';
	});
}

// canvas를 이용해 물고기 별자리 그린다
function drawFish(){
	
	const longer = width >= height ? width : height;
	const baseSize = parseInt(longer/5);
	const baseWid = baseSize + 100;
	const baseHei = baseSize + 100;
	
	let movingIdx = 0;
	
	// canvas 기본 값 설정
	const canvasEle = document.getElementById('fish-canvas');
	canvasEle.style.visibility = 'hidden';
	canvasEle.style.top = height - 2*0.6*Math.round(width / 5);
	const ctx = canvasEle.getContext('2d');
	ctx.canvas.width = baseWid;
	ctx.canvas.height = baseHei;
	
	const baseColor = 'gold';
	ctx.strokeStyle = baseColor;
	ctx.fillStyle = baseColor;
	ctx.shadowColor = baseColor;
	ctx.shadowBlur = 15;
	
	// 각 별의 좌표
	const mid = {x: 50, y: baseSize/2};
	const a = [
		{x: mid.x, y: mid.y-baseSize/4}, 
		{x: mid.x+baseSize/9, y: mid.y-baseSize/4+3}
	];
	const b = [
		{x: mid.x, y: mid.y+baseSize/4}, 
		{x: mid.x+baseSize/9, y: mid.y+baseSize/4-3}
	];
	const c = {x: mid.x+baseSize/6, y: mid.y};
	const d = {x: a[movingIdx].x+baseSize/5*3, y: a[movingIdx].y};
	const e = {x: b[movingIdx].x+baseSize/5*3, y: b[movingIdx].y};
	const f = {x: c.x+baseSize/5*3, y: c.y};
	
	// canvas로 물고기 별자리 그린다
	const drawFishByCanvas = () => {
		// 초기화
		ctx.clearRect(0, 0, baseWid, baseHei);
		
		ctx.beginPath();
		//ctx.translate(0, moving[movingIdx]*1.5);
		ctx.arc(f.x, f.y, 5, Math.PI*2, 0, true);
		ctx.fill();
		ctx.moveTo(d.x, d.y);
		ctx.arc(d.x, d.y, 5, Math.PI*2, 0, true);
		ctx.fill();
		ctx.moveTo(e.x, e.y);
		ctx.arc(e.x, e.y, 5, Math.PI*2, 0, true);
		ctx.fill();
		ctx.moveTo(c.x, c.y);
		ctx.arc(c.x, c.y, 5, Math.PI*2, 0, true);
		ctx.fill();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.moveTo(f.x, f.y);
		ctx.lineTo(d.x, d.y);
		ctx.lineTo(e.x, e.y);
		ctx.lineTo(c.x, c.y);
		ctx.lineTo(d.x, d.y);
		ctx.moveTo(f.x, f.y);
		ctx.lineTo(e.x, e.y);
		ctx.moveTo(f.x, f.y);
		ctx.lineTo(c.x, c.y);
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.translate(c.x, c.y);
		
		const x = c.x;
		const y = c.y;
		ctx.arc(a[movingIdx].x-x, a[movingIdx].y-y, 5, Math.PI*2, 0, true);
		ctx.fill();
		ctx.moveTo(b[movingIdx].x-x, b[movingIdx].y-y);
		ctx.arc(b[movingIdx].x-x, b[movingIdx].y-y, 5, Math.PI*2, 0, true);
		ctx.fill();
		
		ctx.moveTo(0, 0);
		ctx.lineTo(a[movingIdx].x-x, a[movingIdx].y-y);
		ctx.lineTo(b[movingIdx].x-x, b[movingIdx].y-y);
		ctx.lineTo(0, 0); 
		ctx.stroke();
		
		movingIdx++;
		if(movingIdx === 2){
			movingIdx = 0;
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}
	// end of drawFishByCanvas function 
	
	// trigger of drawing fish
	setInterval(drawFishByCanvas, 1000);
}

function animateNightToDay() {
	
	const html = document.querySelector('html');
	
	new Promise(resolve => {
		let step = 0;
		let intervalID = null;
		const brightNightColor = () => {
			// 밝기가 충분히 밝아지면 다른 색상으로 전환 시작
			if(step > 170) {
				clearInterval(intervalID);
				resolve();
				return;
			}
			// 밝기만 밝아짐
			html.style.background = `linear-gradient(25deg, black, rgb(0, ${0+step}, ${(255-170)+step}))`;
			step += 5;
		}
		intervalID = setInterval(brightNightColor, 100);
		
	}).then(() => {
		let step = 0;
		let intervalID = null;
		const shiftNightToDay = () => {
			if(step > 50){
				clearInterval(intervalID);
				return Promise.resolve();
			} 
			html.style.background = `linear-gradient(25deg, black, ${50-step}%, rgb(0, 170, 255))`;
			step += 5;
		}
		intervalID = setInterval(shiftNightToDay, 100);
	}).then(() => {
		// *함수가 promise를 반환해서 외부에서 체이닝을 해야 하는 것 아닐까?
		
		// 구름을 1.5초 노출하기 위해 
		return new Promise(resolve => setTimeout(() => {
			removeStarSky();
			showCloud(true);
			resolve();
		}, 1500));
	}).then(()=>{
		return new Promise(resolve => {
			showCloud(false);
			resolve();
		});
		
	}).then(()=>{
		return new Promise(resolve => {
			showCloud(false);
			doBeachBaseWork();
			resolve();
		});
	}).then(()=>{
		return new Promise(resolve => {
			drawBeachStuff();
			drawSand();
			resolve();
		});
	}).then(()=>{
		return new Promise(resolve => {
			animateStepMoving();
			resolve();
		});
	});
}
function removeStarSky(){
	// 별배경 없애기
	const starSkyStyle = document.querySelector("#star-sky-canvas").style;
	starSkyStyle.display = "none";
	starSkyStyle.transition = "display 1s linear";
}
function showCloud(isVisible){
	// 구름 생성
	document.querySelector(".day").style.visibility = isVisible ? "visible" : "hidden";
}

function doBeachBaseWork(){
	
	const waves = document.getElementsByClassName("wave-wrapper");
	const waveNum = waves[2].children.length;
	for(let i=0; i<waveNum; i++){
		// 파도가 전 화면을 가림
		waves[2].children[i].style.animation = 'waveUp 2s forwards ease-in-out';
	}
	
	//let isFirst = true;
	waves[2].children[0].addEventListener("animationend", () => {
	
		//if(!isFirst) return;
		//isFirst = false;

		// 물고기 숨기기
		document.querySelector("#fish-canvas").style.display = "none";
		// 떨어진 별 숨기기
		document.querySelector(".star-wrapper").style.visibility = "hidden";
		
		// 나머지 파도 숨기기
		waves[0].style.visibility = 'hidden';
		waves[1].style.visibility = 'hidden';
		
		// 배경 모래색으로 변경
		const html = document.querySelector("html");
		html.style.background = '';
		html.style.backgroundColor = '#f9eebd';
		
		// 파도 낮아짐
		for(let i=0; i<6; i++){
			waves[2].children[i].style.animation = 'waveDown 2s forwards ease-in-out';
		}
	});
}

function drawSand(){
	const ctx =	document.getElementById('beach-canvas').getContext('2d');
	ctx.canvas.width = width;
	ctx.canvas.height = height;
	
	const baseColor = 'white';
	ctx.fillStyle = baseColor;
	ctx.beginPath();
	let coord;
	for(let i=0; i<1000; i++){
		coord = getRandomCoord(1000, 1000);
		ctx.moveTo(coord.x, coord.y);
		ctx.arc(coord.x, coord.y, 1, Math.PI*2, 0, true);
	}
	ctx.fill();
}
function drawBeachStuff(){
	document.getElementsByClassName("parasol")[0].style.visibility = 'visible';
	document.getElementsByClassName("center")[0].style.visibility = 'visible';
}
function animateStepMoving(){
	addStepEle();
	const stepContainer = document.getElementsByClassName("steps")[0];
	const steps = stepContainer.children;
	const wave = document.getElementsByClassName("wave-wrapper")[2];
	const start = wave.children[0].getBoundingClientRect().top;
	const parasol = document.getElementsByClassName("parasol")[0];
	const end = parasol.getBoundingClientRect().bottom;
	const stepSize = (end - start) / 5;
	let intervalID = null;
	let i = 0;
	const showStep = () => {
		const leftStyle = steps[i].getElementsByClassName("left")[0].style;
		const rightStyle = steps[i].getElementsByClassName("right")[0].style;
		
		leftStyle.backgroundColor = 'rgba(0,0,0, 0.3)';
		leftStyle.transform = `translate(-10px ,-${start + stepSize*i}px)`;
		leftStyle.transition = 'transform 1s 0.5s steps(1, end)';
		leftStyle.animation = 'removeStep 1s linear 6.5s forwards';
		
		rightStyle.backgroundColor = 'rgba(0,0,0, 0.3)';
		rightStyle.transform = `translate(10px, -${start + stepSize*i}px)`;
		rightStyle.transition = 'transform 1s steps(1, end)';
		rightStyle.animation = 'removeStep 1s linear 6s forwards';
		//console.log(i);
		if(++i >= 5){
			clearInterval(intervalID);
		}
	}
	intervalID = setInterval(showStep, 2000);
}

function addStepEle(){
	// 파도와 파라솔 간의 간격 계산
	
	const footNum = 5;
	const stepContainer = document.getElementsByClassName("steps")[0];
	let eleStr = "";
	for(let i=0; i<footNum; i++){
		eleStr += makeStepEleTree().outerHTML;
	}
	stepContainer.innerHTML = eleStr;
	return footNum;
}

function makeStepEleTree(){
	const hierarchy = [{
		type: "div",
		attrs: {class: "row"},
		child: [
			{
				type: "div",
				attrs: {class: "left"},
			},
			{
				type: "div",
				attrs: {class: "right"},
			}
		]
	}];
	getEle(hierarchy);
	makeEleTree(hierarchy);
	return hierarchy[0].element;
}
function makeEleTree(hierarchy){
	if(!hierarchy) return;
	
	const num = hierarchy.length;
	for(let j=0; j<num; j++){
		if(hierarchy[j].child){
			makeEleTree(hierarchy[j].child);
			const len = hierarchy[j].child.length;
			for(let i=0; i<len; i++){
				hierarchy[j].element.appendChild(hierarchy[j].child[i].element);
			}
		}
	}
}

function getEle(hierarchy){
	if(!hierarchy) return;
	const num = hierarchy.length;
	for(let i=0; i<num; i++){
		const ele = document.createElement(hierarchy[i].type);
		const attrs = hierarchy[i].attrs;
		for(const attr in attrs){
			ele.setAttribute(attr, attrs[attr]);
		}
		hierarchy[i].element = ele;
		getEle(hierarchy[i].child);
	}
}


function showMenu(){
	// fade out wava and beach
	// focus on parasol
	// drop down menu
}

// util function
function getRandomCoord(xUpper, yUpper){
	const coord = {
		x: Math.random()*xUpper,
		y: Math.random()*yUpper
	};
	return coord;
}

// function moveStep(){ 
//   const rows = document.getElementsByClassName("steps")[0].children;

//   // 추후에 파라솔 위치 구해서 조건으로 설정
//   const pos = 0;

//   const generateMoveFunc = (args) => {   
//     return () => {
//       const [left] = rows[args.rowIdx].getElementsByClassName("left");
//       left.style.transform = `translate(-10px ,-${pos+15*args.i}px)`;
//       if(args.rowIdx == 2){
//          left.style.animation = 'stepping 3s linear infinite';
//       }
//       left.style.transition = 'transform 1s 0.5s steps(1, end)';

//       const [right] = rows[args.rowIdx].getElementsByClassName("right");
//       right.style.transform = `translate(10px, -${pos+15*args.i}px)`;
//       if(args.rowIdx == 2){
//          right.style.animation = 'stepping 3s linear infinite';
//       }
//       right.style.transition = 'transform 1s steps(1, end), background-color 1s ease-out';

//       args.i++;
//       if(args.i === 5){
//       clearInterval(args.intervalId); 
//       //rows.removeElement();
//       }  
//     }
//   }
//   const moveFunc = {
//     move1: {
//       rowIdx: 0,
//       i: 0
//     },
//     move2: {
//       rowIdx: 1,
//       i: 0
//     },
//     move3: {
//       rowIdx: 2,
//       i: 0 
//     }
//   };
//   moveFunc.move1.intervalId = wrapIntervalFunc(generateMoveFunc(moveFunc.move1), 0);
//   moveFunc.move2.intervalId = wrapIntervalFunc(generateMoveFunc(moveFunc.move2), 6000);
//   moveFunc.move3.intervalId = wrapIntervalFunc(generateMoveFunc(moveFunc.move3), 12000);

// }
// async function wrapIntervalFunc(func, ms){
//   let id;
//   await new Promise(resolve => setTimeout(resolve, ms))
//   .then(() => new Promise(resolve => setInterval(() => resolve(func()), 3000)))
//   .then(res => id = res);
//   return id;
// }
