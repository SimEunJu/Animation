// 전역변수 관리하는 width, height
// *사용자가 중간에 화면을 줄인다면 어떻게 할 것인가
const width = window.innerWidth;
const height = window.innerHeight;

addWave();
drawBackgroundStar();
drawMainStar();
document.querySelector("#fish-canvas").addEventListener("animationstart", nightToDay, false);

function addWave(){
  const waveWrappers = document.getElementsByClassName('wave-wrapper');
  const len = waveWrappers.length;
  const waveWidth = Math.round(width / 5);
  const hierarchy = [{
    type: "div",
    child: []
  }];
  for(let i=0; i<len; i++){
    waveWrappers[i].style.top = `calc(100vh - ${(len-i)*0.6*waveWidth}px)`;
  }
  const style = `width: ${waveWidth}px; height: ${waveWidth*1.2}px`;
  for(let i=0; i<6; i++){
    hierarchy[0].child.push({
      type: "div",
      attrs: {class: "wave", style: style},
    });
  }
  getEle(hierarchy);
  makeEleTree(hierarchy);
  for(let i=0; i<len; i++){
    waveWrappers[i].innerHTML = hierarchy[0].element.innerHTML;
  }
}

function drawMainStar(){
	
	const starWrapper = document.getElementsByClassName('star-wrapper')[0];
	const stars = starWrapper.children;
	const starNum = stars.length;
	
	for(let i=0; i<starNum; i++){
		
		const coord = getRandomCoord(width, height - 3*0.6*Math.round(width / 5));
		
		stars[i].setAttribute("class", "star");
		
		const starStyle = stars[i].style;
		starStyle.top = coord.y+"px";
		starStyle.left = coord.x+"px";
		
		// *한 군데 모이도록 재설정
		starStyle.animation = "falling 3s 2s forwards linear";
	}
	// 별이 떨이지고 난 후 물고기가 움직인다
	stars[0].addEventListener("animationend", drawFish, false);
}

// *추후에 day function이랑 합쳐야 
function drawBackgroundStar(){
	
	const ctx = document.getElementById('star-sky-canvas').getContext('2d');
	ctx.canvas.width = width;
	ctx.canvas.height = height - 3*0.6*Math.round(width / 5);
	
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

// canvas를 이용해 물고기 별자리 그린다
function drawFish(){
	
	const longer = width >= height ? width : height;
	const baseSize = parseInt(longer/5);
	const baseWid = baseSize + 100;
	const baseHei = baseSize + 100;
	
	let movingIdx = 0;
	
	// canvas 기본 값 설정
	const canvasEle = document.getElementById('fish-canvas')
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
	
	// 물고기를 다 그린 후 움직이도록
	canvasEle.style.animation = 'fishMoving 10s infinite linear, drift 2s infinite linear';
	
	let isFirst = true;  
	const startMovingForward = () => {
		if(isFirst){
			isFirst = false;
		}
		else{
			return;
		}
		// *falling star와 timing 맞추어야 한다
		canvasEle.style.animation = 'fishMoving 10s infinite linear, drift 2s infinite linear';
	}
	// 물고기가 위치해 있는 물결
	// const wave2 = document.getElementsByClassName("layer2")[0];
	// *추후에 별이 다 떨어진 후에 trigger 하도록 변경
	// wave2.addEventListener("animationiteration", startMovingForward, false);
	
}

function removeStar(){
	const starSkyStyle = document.querySelector("#star-sky-canvas").style;
	starSkyStyle.display = "none";
	starSkyStyle.transition = "display 1s linear";
}
function nightToDay() {
	let idx = 0;
	let id1 = 0;
	let id2 = 0;
	const html = document.querySelector('html');
	const changeColorRatio = () => {
		if(idx > 50){
			clearInterval(id2);
			removeStar();
			showCloud();
			return;
		} 
		html.style.background = `linear-gradient(25deg, black, ${50-idx}%, rgb(0, 170, 255))`;
		idx += 5;
	}
	const changeColor = () => {
		if(idx > 170) {
			idx = 5;
			id2 = setInterval(changeColorRatio, 100);
			clearInterval(id1);
			return;
		}
		html.style.background = `linear-gradient(25deg, black, rgb(0, ${0+idx}, ${255-170+idx}))`;
		idx += 5;
	}
	id1 = setInterval(changeColor, 100);
}

function showCloud(){
	document.querySelector(".day").style.visibility = "visible";
  showBeach();
}

function showBeach(){

	// remain only one wave
	const waves = document.getElementsByClassName("wave-wrapper");
  for(let i=0; i<6; i++){
    waves[2].children[i].style.animation = 'waveUp 2s forwards ease-in-out';
  }
	
  waves[2].children[0].addEventListener("animationend", () => {
    // remove cloud
	  document.querySelector(".day").style.visibility = "hidden";
	
	  // hide another wave
	  waves[0].style.visibility = 'hidden';
	  waves[1].style.visibility = 'hidden';
	
	  // change background color
	  const html = document.querySelector("html");
    html.style.background = '';
	  html.style.backgroundColor = '#f9eebd';
    
    waves[2].style.transition = 'all 1.5s ease-out';
    waves[2].style.transform = 'scale(0.2)';
    waves[2].style.opacity = '.5';
    
    drawBeach();
  });
}

function drawBeach(){
	const ctx =         document.getElementById('beach-canvas').getContext('2d');
	//ctx.canvas.width = baseSize + 50;
	//ctx.canvas.height = baseSize + 50;
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
  
  document.getElementsByClassName("parasol")[0].style.visibility = '';
	document.getElementsByClassName("center")[0].style.visibility = '';
	moveStep();
}
function moveStep(){
	const footNum = addStepEle();
	const stepContainer = document.getElementsByClassName("steps")[0];
	const steps = stepContainer.children;
	const pos = 100;
	let intervalID;
	let i = 0;
	const showStep = () => {
		const leftStyle = steps[i].getElementsByClassName("left")[0].style;
		const rightStyle = steps[i].getElementsByClassName("right")[0].style;
		
		leftStyle.backgroundColor = 'rgba(0,0,0, 0.3)';
		leftStyle.transform = `translate(-10px ,-${pos + 30*i}px)`;
		leftStyle.transition = 'transform 1s 0.5s steps(1, end)';
		leftStyle.animation = 'removeStep 1s linear 6.5s forwards';
		
		rightStyle.backgroundColor = 'rgba(0,0,0, 0.3)';
		rightStyle.transform = `translate(10px, -${pos + 30*i}px)`;
		rightStyle.transition = 'transform 1s steps(1, end)';
		rightStyle.animation = 'removeStep 1s linear 6s forwards';
		//console.log(i);
		if(++i >= 5){
			clearInterval(intervalID);
		}
	}
	intervalID = setInterval(showStep, 3000);
}

function addStepEle(){
	// 파도와 파라솔 간의 간격 계산
	const dist = 200;
	const footNum = 200/20;
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
