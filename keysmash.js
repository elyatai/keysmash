const keyboard = [
	{offset: 0, keys: [...'1234567890-=']},
	{offset: 0.5, keys: [...'qwertyuiop[]\\']},
	{offset: 1, keys: [...'asdfghjkl;\'']},
	{offset: 1.5, keys: [...'zxcvbnm,./']},
]

const dims = {
	x: Math.max(...keyboard.map(x => x.keys.length + x.offset)),
	y: keyboard.length
};

const sc = 40;
const half_sc = sc/2;
const r = 10;

const speed = 0.2;

let going = false;
let smash = '';

let locs = [];
let last = [];

function randInt(n) {
	return Math.floor(randFloat(n));
}

function randFloat(n) {
	return Math.random() * n;
}

function rand(n) {
	return randFloat(n*2) - n;
}

function setup() {
  createCanvas(sc*(2+dims.x), sc*(3+dims.y));
	textSize(half_sc);
}

function draw() {
	translate(sc, sc);
  
	background(0);
	textAlign(CENTER, CENTER);
	keyboard.map((layer, i) => {
		layer.keys.map((k, j) => {
			let [x, y] = [(layer.offset+j)*sc, i*sc];
			stroke(255); fill(127);
			rect(x, y, sc, sc);
			noStroke(); fill(0);
			text(k, x+half_sc, y+half_sc);
		});
	});
	
	if(locs !== []) {
		locs.map((loc, i) => {
			['x', 'y'].map(k => {
				loc[k] += rand(speed);
			});

			if(0 > loc.y || loc.y > dims.y) {
				removeBall(i);
				return;
			}
			let kbl = keyboard[Math.floor(loc.y)];
			let kbpos = loc.x - kbl.offset;
			if(kbpos < 0 || kbpos > kbl.keys.length) {
				removeBall(i);
				return;
			}

			let k = kbl.keys[Math.floor(kbpos)];
			if(!last[i] || last[i] != k) {
				smash += k;
				last[i] = k;
			}

			fill(color(255, 0, 0));
			ellipse(loc.x*sc, loc.y*sc, r, r);
		});
	}
	
	fill(255);
	textAlign(LEFT, TOP);
	let msg = [
		smash,
		`Length: ${smash.length}, Count: ${locs.length}`
	]
	text(msg.join('\n'), 0, (dims.y+0.5)*sc)
}

function mouseClicked() {
	addBall(
		mouseX / sc - 1,
		mouseY / sc - 1
	);
	return false;
}

function addBall(x, y) {
	if(locs.length == 0) {
		smash = '';
	}
	locs.push({x, y});
}

function removeBall(i) {
	locs.splice(i, 1);
	last.splice(i, 1);
}

function keyPressed() {
	if(keyCode === ESCAPE) {
		locs = [];
		last = [];
		return;
	}
	key = key.toLowerCase();
	keyboard.forEach((row, i) => {
		let ind = row.keys.findIndex(x => x.toLowerCase() === key);
		if(ind === -1) return;
		addBall(
			row.offset + ind + 0.5,
			i + 0.5
		);
	});
}
