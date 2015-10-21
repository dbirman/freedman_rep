$(document).ready(function() {
	cohcon();
});

function cohcon() {

  	window.myscreen = initScreen();

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-1.html",
		"instructions/instruct-2.html",
		"instructions/instruct-3.html",
		"instructions/instruct-4.html",
		"instructions/instruct-5.html",
		"instructions/instruct-ready.html"
	];

	var pracTrials = Infinity;

	// Trial Phases:
	// wait = wait for spacebar press
	// fixation = 667 ms wait
	// stimulus = 667 ms
	// delay = 1013 ms
	// test = 667 ms

	var phases = {};
	// phases.survey1 = 0;
	phases.survey2 = 0;
	// phases.instructions = 2;
	phases.task = 1;

	var segs = {};
	segs.wait = 0;
	segs.fixation = 1;
	segs.stimulus = 2;
	segs.delay = 3;
	segs.test = 4;
	segs.resp = 5;
	segs.fback = 6;

	var params = {};
	params.directions = [0,1,2,3,4,5,6,7]

	window.task = [];
	task[0] = [];
	// task[0][phases.survey1] = initSurvey();
	// task[0][phases.survey1].html = "surveyDemo.html";

	task[0][phases.survey2] = initSurvey();
	task[0][phases.survey2].html = "surveyScreen.html";

	// task[0][phases.i] = initInstructions(instructionPages);

	window.stimulus = {};
	initStimulus('stimulus');
	myInitStimulus(task);
	// stimulus.categories = randomElement([0,1]);
	stimulus.categories = 1;
	stimulus.categoryGroups = [[0,1,2,3],[4,5,6,7]];
	stimulus.seg = segs;


	task[0][phases.task] = {};
	task[0][phases.task].waitForBacktick = 0;
	task[0][phases.task].seglen = [2, .650, .650, 1.000, .667,2,1];
	task[0][phases.task].numTrials = 10;
	task[0][phases.task].parameter = {};
	task[0][phases.task].parameter.match = [0,1];
	if (stimulus.categories) {
		task[0][phases.task].parameter.direction = [0,1];
		task[0][phases.task].parameter.nomatchdir = [0];
	} else {
		task[0][phases.task].parameter.direction = params.directions;
		task[0][phases.task].parameter.nomatchdir = [-Math.PI*4/8,-Math.PI*3/8,-Math.PI*2/8,Math.PI*2/8,Math.PI*3/8,Math.PI*4/8];
	}
	task[0][phases.task].random = 1;
	task[0][phases.task].usingScreen = 1;
	task[0][phases.task].getResponse = [0,0,0,0,0,1,0];
	task[0][phases.task].html = "canvas.html";

	task[0][phases.task] = initTask(task[0][phases.task], startSegmentCallback, screenUpdateCallback, getResponseCallback, startTrialCallback,endTrialCallbackPrac,[],blockRandomization);
	// task[0][phases.train2] = initTask(task[0][phases.train2], startSegmentCallback, screenUpdateCallback, getResponseCallback, startTrialCallback,endTrialCallbackPrac,[],blockRandomization);
	// task[0][phases.e1] = initTask(task[0][phases.e1], startSegmentCallback, screenUpdateCallback, getResponseCallback, startTrialCallback,[],[],blockRandomization);
	// task[0][phases.c] = initTask(task[0][phases.c], startSegmentCallback, screenUpdateCallback, getResponseCallback, startTrialCallback,[],[],blockRandomization);
	// task[0][phases.e2] = initTask(task[0][phases.e2], startSegmentCallback, screenUpdateCallback, getResponseCallback, startTrialCallback,[],[],blockRandomization);

	initTurk();

	//response related
	jglData.responses = [];
	jglData.correct = [];
	jglData.direction = [];
	jglData.postSurvey = {};

	jglData.categories = stimulus.categories;

	startPhase(task[0]);
}

var endTrialCallbackPrac = function(task,myscreen) {
	return [task,myscreen];
}

var startTrialCallback = function(task, myscreen) {

	if(task.thistrial.crit) {
		task.thistrial.seglen[stimulus.seg.resp] = 5;
	}
	jglData.responses.push(-1);
	jglData.correct.push(0);
	jglData.direction.push(task.thistrial.direction);
	stimulus.gotResp = 0;

	var flip = [1, 0];
	if (stimulus.categories) {
		stimulus.rot1 = randomElement(stimulus.categoryGroups[task.thistrial.direction]) * Math.PI * 2 / 8;
		if (task.thistrial.match) {
			// matching trial, use same category
			stimulus.rot2 = randomElement(stimulus.categoryGroups[task.thistrial.direction]) * Math.PI * 2 / 8;
		} else {

			stimulus.rot2 = randomElement(stimulus.categoryGroups[flip[task.thistrial.direction]]) * Math.PI * 2 / 8;
		}
	} else {
		stimulus.rot1 = task.thistrial.direction * Math.PI * 2 / 8;
		if (task.thistrial.match) {
			stimulus.rot2 = stimulus.rot1;
		} else {
			stimulus.rot2 = task.thistrial.direction * Math.PI * 2 / 8 + task.thistrial.nomatchdir;
		}
	}
	console.log(stimulus.rot1);
			console.log(stimulus.rot2);

	stimulus.dots.T = add(multiply(rand(task,stimulus.dots.n), (stimulus.dots.maxT-stimulus.dots.minT)),stimulus.dots.minT);
	stimulus.dots.R = add(multiply(rand(task,stimulus.dots.n), (stimulus.dots.maxR-stimulus.dots.minR)),stimulus.dots.minR);	
	stimulus.dots.holdx =  multiply(stimulus.dots.R,cos(mod(add(stimulus.dots.T, 0), Math.PI*2)));	
	stimulus.dots.holdy = multiply(stimulus.dots.R,sin(mod(add(stimulus.dots.T, 0), Math.PI*2)));

	stimulus.dots.x = multiply(stimulus.dots.R,cos(stimulus.dots.T));
	stimulus.dots.y = multiply(stimulus.dots.R,sin(stimulus.dots.T));


	// contrast
	// convert to hex color

  return [task, myscreen];
}

var getResponseCallback = function(task, myscreen) {
	jumpSegment(task,0);
	
	if (jglData.keys[jglData.keys.length - 1].keyCode == 32) {
		jglData.responses[jglData.responses.length-1] = 1;
		if (task.thistrial.match==1) {
			stimulus.gotResp = 1;
		} else {
			stimulus.gotResp = -1;
		}
	}
	// jglData.responses[jglData.responses.length-1] = resp;
	// jglData.correct[jglData.correct.length-1] = corr;
	// stimulus.gotResp = corr;
	return [task, myscreen];
}

var startSegmentCallback = function(task, myscreen) {
	switch (task.thistrial.thisseg) {
		case stimulus.seg.stimulus:
			stimulus.rot = stimulus.rot1;
			break;
		case stimulus.seg.test:
			stimulus.rot = stimulus.rot2;
			break;
		case stimulus.seg.fback:
			if (stimulus.gotResp==0) {
				// no response yet
				if (task.thistrial.match==0) {
					stimulus.gotResp=1;
				} else {
					stimulus.gotResp = -1;
				}

			}
			jglData.correct[jglData.correct.length-1] = jglData.gotResp;
			break;
	}

  	return [task, myscreen];
}

var screenUpdateCallback = function(task, myscreen) {
	jglClearScreen(0);

	var segs = stimulus.seg;

	if (task.thistrial.match) {
	jglTextSet('Arial',1,'#ffffff',0,0);
	jglTextDraw('match',5 * - .22,-4); 
	} else {

	jglTextSet('Arial',1,'#ffffff',0,0);
	jglTextDraw('nomatch',5 * - .22,-4);
	}

	switch (task.thistrial.thisseg) {
		case segs.wait:
			upText('Get Ready!','#ffffff');
			break;
		case segs.fixation:
			upFix('#ffffff');
			break;
		case segs.stimulus:
			upDots(task);
			break;
		case segs.delay:
			upFix('#ffffff');
			break;
		case segs.test:
			upDots(task);
			break;
		case segs.resp:
			if (task.trialnum < 10) {
				upNowRespondText();
			}
			upFix('#ffffff');
			break;
		case segs.fback:
			switch (stimulus.gotResp) {
				case -1: // incorrect
					upFix('#ff0000');
					upCorrectText();
					break;
				case 1: // incorrect
					upFix('#00ff00');
					upCorrectText();
					break;
				case 0:
					upFix('#000000');
					upCorrectText();
					break;
			}
			break;
	}

	return [task, myscreen];

}

function upCorrectText() {	
	if (stimulus.gotResp==-1) {
		upText('Wrong','#ff0000');
	} else if (stimulus.gotResp==1) {
		upText('Correct','#00ff00');
	} else if (stimulus.gotResp==0) {
		upText('Failed to Respond','#ffffff');
	}
}


function upNowRespondText() {	
	upText('Respond with Space','#ffffff');
}

function upText(text, color) {
	jglTextSet('Arial',1,color,0,0);
	jglTextDraw(text,text.length * - .22,-2.75);

}

function upFix(color) {
	jglFixationCross(1,0.1,color,[0,0]);
}

function upDots(task) {
	stimulus.dots = updateDots(task,stimulus.dots);

	jglPoints2(stimulus.dots.x, stimulus.dots.y, 0.2, '#ffffff');
}

function updateDots(task,dots) {

	// Check frequency? Not sure how to do this...
	freq_factor = 0.2;

	// dots.x = add(dots.y,);

	// Flip dots back if they go too far
	for (var i=0;i<dots.R.length;i++) {
		if (dots.R[i] > dots.maxR) {
			dots.holdx[i] = -dots.holdx[i];
		}
		// if (dots.R[i] < dots.minR) {
		// 	dots.R[i] = dots.R[i] + (dots.maxR - dots.minR);
		// }
		// if (dots.T[i] < dots.minT) {
		// 	dots.T[i] = dots.T[i] + (dots.maxT - dots.minT);
		// }
		// if (dots.T[i] > dots.maxT) {
		// 	dots.T[i] = dots.T[i] - (dots.maxT - dots.minT);
		// }
		// if (dots.X[i] > dots.maxX) {
		// 	dots.X[i] = dots.X[i] - (dots.maxX - dots.minX);
		// } else if (dots.X[i] < dots.minX) {
		// 	dots.X[i] = dots.X[i] + (dots.maxX - dots.minX)
		// }
		// if (dots.Y[i] > dots.maxY) {
		// 	dots.Y[i] = dots.Y[i] - (dots.maxY - dots.minY);
		// } else if (dots.Y[i] < dots.minY) {
		// 	dots.Y[i] = dots.Y[i] + (dots.maxY - dots.minY)
		// }
	}
	dots.holdx = add(dots.holdx,freq_factor);
	dots.R = sqrt(add(multiply(dots.holdx,dots.holdx),multiply(dots.holdy,dots.holdy)));
	dots.T = mod(add(atan2(dots.holdy,dots.holdx),Math.PI*2),Math.PI*2);

	// Update x, y

	dots.holdx =  multiply(dots.R,cos(mod(dots.T, Math.PI*2)));
	dots.holdy = multiply(dots.R,sin(mod(dots.T, Math.PI*2)));

	dots.x = multiply(dots.R,cos(mod(add(dots.T, stimulus.rot), Math.PI*2)));
	dots.y = multiply(dots.R,sin(mod(add(dots.T, stimulus.rot), Math.PI*2)));

	return(dots);
}

function myInitStimulus(task) {

	stimulus.dots = {};


	stimulus.dots.white = '#FFFFFF';

	stimulus.dots.minR = 0;
	stimulus.dots.maxR = 9
	stimulus.dots.minT = 0;
	stimulus.dots.maxT = Math.PI*2;
	stimulus.dots.n = 160;
	stimulus.dots.T = add(multiply(rand(task,stimulus.dots.n), (stimulus.dots.maxT-stimulus.dots.minT)),stimulus.dots.minT);
	stimulus.dots.R = add(multiply(rand(task,stimulus.dots.n), (stimulus.dots.maxR-stimulus.dots.minR)),stimulus.dots.minR);	
	stimulus.dots.holdx =  multiply(stimulus.dots.R,cos(mod(add(stimulus.dots.T, 0), Math.PI*2)));	
	stimulus.dots.holdy = multiply(stimulus.dots.R,sin(mod(add(stimulus.dots.T, 0), Math.PI*2)));

	stimulus.dots.x = multiply(stimulus.dots.R,cos(stimulus.dots.T));
	stimulus.dots.y = multiply(stimulus.dots.R,sin(stimulus.dots.T));
}
