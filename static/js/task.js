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
	phases.instructions = 1;
	phases.task = [2,4,6,8];
	phases.newrule = 9;
	phases.catTask = [10, 12, 14, 16, 18, 20];
	phases.post1 = 21;
	phases.teachRule = 22;
	phases.post2 = 23;
	phases.ending = 24;
	phases.catKnown = [25];
	phases.post3 = 26;

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
	params.trials = 1;

	window.task = [];
	task[0] = [];
	// task[0][phases.survey1] = initSurvey();
	// task[0][phases.survey1].html = "surveyDemo.html";

	task[0][phases.survey2] = initSurvey();
	task[0][phases.survey2].html = "surveyScreen.html";

	task[0][phases.instructions] = initInstructions(instructionPages);

	window.stimulus = {};
	initStimulus('stimulus');
	myInitStimulus(task);
	// stimulus.categories = randomElement([0,1]);
	stimulus.categories = -1;
	stimulus.categoryGroups = [[0,1,2,3],[4,5,6,7]];
	stimulus.seg = segs;

	///////// BLOCK: DIRECTIONS //////////

	var readylen = [2, 1, 0, 0];
	var resplen = [2,1.5,1,1];
	var getred = [1,1,0,0];

	for (var i = 0; i < phases.task.length; i++) {
		ct = phases.task[i];

		task[0][ct] = {};
		task[0][ct].waitForBacktick = 0;
		task[0][ct].seglen = [readylen[i], .650, .650, 1.000, .667,2,resplen[i]];
		task[0][ct].numTrials = params.trials;
		task[0][ct].parameter = {};
		task[0][ct].parameter.match = [0,1];
		task[0][ct].parameter.categories = 0;
		task[0][ct].parameter.known = 0;
		task[0][ct].parameter.showresp = 1;
		task[0][ct].parameter.getready = getred[i];
		if (task[0][ct].parameter.categories==1) {
			task[0][ct].parameter.direction = [0,1];
			task[0][ct].parameter.nomatchdir = [0];
		} else {
			task[0][ct].parameter.direction = params.directions;
			task[0][ct].parameter.nomatchdir = [-Math.PI*4/8,-Math.PI*3/8,-Math.PI*2/8,Math.PI*2/8,Math.PI*3/8,Math.PI*4/8];
		}
		task[0][ct].random = 1;
		task[0][ct].usingScreen = 1;
		task[0][ct].getResponse = [0,0,0,0,0,1,0];
		task[0][ct].html = "canvas.html";

		task[0][ct] = initTask(task[0][ct], startSegmentCallback, screenUpdateCallback, getResponseCallback, startTrialCallback,endTrialCallbackPrac,[],blockRandomization);

		if (i < phases.task.length-1) {
			task[0][ct+1] = initSurvey();
			task[0][ct+1].html = "break.html";
		}

	}

	task[0][phases.newrule] = initSurvey();
	task[0][phases.newrule].html = "newrule.html";

	readylen = [1,0,0,0,0,0];

	for (var i = 0; i < phases.catTask.length; i++) {
		ct = phases.catTask[i];

		task[0][ct] = {};
		task[0][ct].waitForBacktick = 0;
		task[0][ct].seglen = [readylen[i], .650, .650, 1.000, .667,2,1];
		task[0][ct].numTrials = params.trials;
		task[0][ct].parameter = {};
		task[0][ct].parameter.match = [0,1];
		task[0][ct].parameter.categories = 1;
		task[0][ct].parameter.known = 0;
		task[0][ct].parameter.showresp = 0;
		task[0][ct].parameter.getready = 0;
		if (task[0][ct].parameter.categories==1) {
			task[0][ct].parameter.direction = [0,1];
			task[0][ct].parameter.nomatchdir = [0];
		} else {
			task[0][ct].parameter.direction = params.directions;
			task[0][ct].parameter.nomatchdir = [-Math.PI*4/8,-Math.PI*3/8,-Math.PI*2/8,Math.PI*2/8,Math.PI*3/8,Math.PI*4/8];
		}
		task[0][ct].random = 1;
		task[0][ct].usingScreen = 1;
		task[0][ct].getResponse = [0,0,0,0,0,1,0];
		task[0][ct].html = "canvas.html";

		task[0][ct] = initTask(task[0][ct], startSegmentCallback, screenUpdateCallback, getResponseCallback, startTrialCallback,endTrialCallbackPrac,[],blockRandomization);

		if (i < phases.catTask.length-1) {
			task[0][ct+1] = initSurvey();
			task[0][ct+1].html = "break.html";
		}

	}
	task[0][phases.post1] = initSurvey();
	task[0][phases.post1].html = "post1.html";
	task[0][phases.teachRule] = initSurvey();
	task[0][phases.teachRule].html = "teachRule.html";
	task[0][phases.post2] = initSurvey();
	task[0][phases.post2].html = "post2.html";
	task[0][phases.ending] = initSurvey();
	task[0][phases.ending].html = "ending.html";

	//////FINAL STAGE

	readylen = [0];

	for (var i = 0; i < phases.catKnown.length; i++) {
		ct = phases.catKnown[i];

		task[0][ct] = {};
		task[0][ct].waitForBacktick = 0;
		task[0][ct].seglen = [readylen[i], .650, .650, 1.000, .667,2,1];
		task[0][ct].numTrials = params.trials;
		task[0][ct].parameter = {};
		task[0][ct].parameter.match = [0,1];
		task[0][ct].parameter.categories = 1;
		task[0][ct].parameter.known = 1;
		task[0][ct].parameter.showresp = 0;
		task[0][ct].parameter.getready = 0;
		if (task[0][ct].parameter.categories==1) {
			task[0][ct].parameter.direction = [0,1];
			task[0][ct].parameter.nomatchdir = [0];
		} else {
			task[0][ct].parameter.direction = params.directions;
			task[0][ct].parameter.nomatchdir = [-Math.PI*4/8,-Math.PI*3/8,-Math.PI*2/8,Math.PI*2/8,Math.PI*3/8,Math.PI*4/8];
		}
		task[0][ct].random = 1;
		task[0][ct].usingScreen = 1;
		task[0][ct].getResponse = [0,0,0,0,0,1,0];
		task[0][ct].html = "canvas.html";

		task[0][ct] = initTask(task[0][ct], startSegmentCallback, screenUpdateCallback, getResponseCallback, startTrialCallback,endTrialCallbackPrac,[],blockRandomization);

		if (i < phases.catKnown.length-1) {
			task[0][ct+1] = initSurvey();
			task[0][ct+1].html = "break.html";
		}

	}

	task[0][phases.post3] = initSurvey();
	task[0][phases.post3].html = "post3.html";

	/////

	initTurk();

	//response related
	jglData.responses = [];
	jglData.correct = [];
	jglData.direction = [];
	jglData.categories = [];
	jglData.postSurvey = {};
	jglData.match = [];
	jglData.rot1 = [];
	jglData.rot2 = [];
	jglData.known = [];

	startPhase(task[0]);
}

var endTrialCallbackPrac = function(task,myscreen) {
	return [task,myscreen];
}

var startTrialCallback = function(task, myscreen) {

	stimulus.categories = task.thistrial.categories;

	if(task.thistrial.crit) {
		task.thistrial.seglen[stimulus.seg.resp] = 5;
	}
	jglData.responses.push(-1);
	jglData.correct.push(0);
	jglData.direction.push(task.thistrial.direction);
	jglData.categories.push(stimulus.categories);
	jglData.known.push(task.thistrial.known);
	jglData.match.push(task.thistrial.match);
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
	jglData.rot1.push(stimulus.rot1);
	jglData.rot2.push(stimulus.rot2);

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

	switch (task.thistrial.thisseg) {
		case segs.wait:
			if (task.thistrial.getready) {upText('Get Ready!','#ffffff');}
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
			if (task.thistrial.showresp && task.trialnum < 10) {
				upNowRespondText();
			}
			upFix('#ffff00');
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
	jglTextSet('Arial',1,'#ffff00',0,0);
	jglTextDraw('Respond Now',14 * - .25,-2.75);
	jglTextDraw('Press Space - or Do Nothing',27 * - .25,-1.75);
}

function upText(text, color) {
	jglTextSet('Arial',1,color,0,0);
	jglTextDraw(text,text.length * - .25,-1.75);

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
	freq_factor = 0.24;

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
	stimulus.dots.n = 140;
	stimulus.dots.T = add(multiply(rand(task,stimulus.dots.n), (stimulus.dots.maxT-stimulus.dots.minT)),stimulus.dots.minT);
	stimulus.dots.R = add(multiply(rand(task,stimulus.dots.n), (stimulus.dots.maxR-stimulus.dots.minR)),stimulus.dots.minR);	
	stimulus.dots.holdx =  multiply(stimulus.dots.R,cos(mod(add(stimulus.dots.T, 0), Math.PI*2)));	
	stimulus.dots.holdy = multiply(stimulus.dots.R,sin(mod(add(stimulus.dots.T, 0), Math.PI*2)));

	stimulus.dots.x = multiply(stimulus.dots.R,cos(stimulus.dots.T));
	stimulus.dots.y = multiply(stimulus.dots.R,sin(stimulus.dots.T));
}
