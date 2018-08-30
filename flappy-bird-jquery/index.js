var bird = null,
	board = null;
var cPos = {
	x: 80,
	y: 100,
	h: 40,
	w: 50
}
var dimPipe = { width:40, height:420 };
var gravity = 0.5, initSpeed = -7, curSpeed = 0;
var score = 0,
	tmStep = 0,
	noClr = 0;
	state = 0;
	bgLoop = null;

function onTap() {
	console.log('asdas');
	if (state > 1) return;
	if (state === 0) {
		state = 1;
		$('#score').text("Score : " + (score));
		Parallax($('#bgBackground'), 240);
		Parallax($('#bgForeground'), 240);
		$('#start').hide();
		tmStep = window.setInterval(BirdStep, 40);
	}
	curSpeed = initSpeed;
}
function gameOver () {
	// body... 
	state = 2;
	$(":animated").stop();
	if (tmStep) tmStep = window.clearInterval(tmStep);
	if(bgLoop) bgLoop = window.clearInterval(bgLoop);
	start();
}
function BirdStep () {
	// body... 
	curSpeed += gravity;
	cPos.y = Math.max(cPos.y + curSpeed, 0);
	var ang = curSpeed * 5, mh = board.height()-cPos.h, m = -15, lo = 0, actPipe = $('.obs');
	bird.css({top: cPos.y, rotate:(ang < -20) ? -20 : (ang > 90) ? 90 : ang});
	if (cPos.y > mh)
		return gameOver();
	for (var i = actPipe.length-1; i >= 0; i--) {
		var s = actPipe[i].style, x = parseInt(s.left), y = parseInt(s.top);
		lo = Math.max(lo, x);
		if (x+dimPipe.width +m < cPos.x || x > cPos.x+cPos.w+m)	continue;
		if (y+dimPipe.height+m < cPos.y || y > cPos.y+cPos.h+m) continue;
		return gameOver();
	}
	if (actPipe.length > 3 || lo > 300 || Math.random() >= 0.05 * (1+noClr))
		return;
	var og = cPos.h * 2;
	var oh = og + Math.floor(Math.random() * (mh-og+1));
	var obs = $("<img/><img/>").addClass('c obs').css({left:580, zIndex:300}).css(dimPipe).attr('src', 'column.jpg')
		.appendTo(board).animate({left:-50}, Math.max(2000,3500-noClr*50), 'linear', function() { 
			$('#score').text(' Score: ' + (score += 1));
			this.remove();
		});
	obs[0].style.top = oh + 'px';
	obs[1].style.top = (oh - og - dimPipe.height) + "px";
}

function Parallax(elm, tmo) {
	console.log(elm, tmo);
	backgroundAnimation(elm);
}
bg_x = 0;
function backgroundAnimation(elm)
{
	if (bgLoop!=null) return;
 bgLoop = setInterval(function(){
 	bg_x-=2;
 	if (bg_x<=-768) bg_x =0;
 	elm.css('background-position', bg_x+ "px 0px")
 },10)
}

function start() {
	// body... 
	state = noClr = score = 0;
	cPos = {
		x: 80,
		y: 100,
		h: 40,
		w: 50
	};
	bird.css({
		"left": cPos.x,
		"top": cPos.y,
		"width": cPos.w,
		"height": cPos.h,
		rotate: 0
	});
	$('.obs').remove();
	$('#start').show();
}

$(document).ready(function() {
	bird = $('#bird');
	var evt = typeof(bird[0].ontouchend) === 'function' ? "touchstart" : "mousedown";
	board = $('#board').bind(evt, onTap);
	start();
});