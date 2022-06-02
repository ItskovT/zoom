(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"Zoom_atlas_1", frames: [[0,0,1794,1862]]},
		{name:"Zoom_atlas_2", frames: [[0,0,1808,1825]]},
		{name:"Zoom_atlas_3", frames: [[0,0,1794,1609]]},
		{name:"Zoom_atlas_4", frames: [[0,0,1794,1609]]},
		{name:"Zoom_atlas_5", frames: [[0,0,1505,1736]]},
		{name:"Zoom_atlas_6", frames: [[0,0,1505,1736]]},
		{name:"Zoom_atlas_7", frames: [[0,0,1505,1736]]},
		{name:"Zoom_atlas_8", frames: [[0,0,1499,1636]]},
		{name:"Zoom_atlas_9", frames: [[0,0,1464,1340],[0,1342,1463,557]]},
		{name:"Zoom_atlas_10", frames: [[0,1118,1111,713],[0,0,1463,557],[0,559,1462,557]]},
		{name:"Zoom_atlas_11", frames: [[0,0,1336,157],[0,159,645,315],[544,630,75,130],[1120,927,72,130],[1959,792,75,130],[420,630,122,130],[1716,897,75,130],[1194,927,72,130],[1793,897,75,130],[131,829,122,130],[1870,897,75,130],[131,961,72,130],[1947,924,75,130],[255,829,122,130],[1716,411,241,241],[1716,654,241,241],[877,773,241,241],[1845,218,152,152],[1296,411,418,351],[420,476,152,152],[0,476,418,351],[1120,773,152,152],[1296,764,418,351],[420,768,455,309],[980,159,314,612],[647,159,331,607],[877,1016,223,23],[1959,512,79,138],[1959,652,76,138],[1959,372,80,138],[0,829,129,138],[1338,0,505,409],[1845,0,187,216],[1296,184,20,23],[1296,209,20,23],[1999,218,20,23],[1296,159,22,23]]},
		{name:"Zoom_atlas_12", frames: [[546,1506,574,408],[710,1098,579,406],[1383,744,542,416],[1291,1162,542,416],[0,0,1381,364],[0,366,1381,364],[0,732,1381,364],[1383,0,453,742],[0,1098,708,381],[0,1481,544,469],[1122,1580,505,424]]},
		{name:"Zoom_atlas_13", frames: [[0,1290,1104,554],[1106,1290,844,678],[0,0,1600,428],[0,430,1600,428],[0,860,1600,428]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_191 = function() {
	this.initialize(ss["Zoom_atlas_10"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_190 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_189 = function() {
	this.initialize(ss["Zoom_atlas_13"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_188 = function() {
	this.initialize(ss["Zoom_atlas_12"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_187 = function() {
	this.initialize(ss["Zoom_atlas_12"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_186 = function() {
	this.initialize(ss["Zoom_atlas_12"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_185 = function() {
	this.initialize(ss["Zoom_atlas_12"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_184 = function() {
	this.initialize(img.CachedBmp_184);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1621,2080);


(lib.CachedBmp_183 = function() {
	this.initialize(img.CachedBmp_183);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2800,1344);


(lib.CachedBmp_181 = function() {
	this.initialize(ss["Zoom_atlas_9"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_180 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_179 = function() {
	this.initialize(img.CachedBmp_179);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3887,2776);


(lib.CachedBmp_178 = function() {
	this.initialize(img.CachedBmp_178);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3481,1895);


(lib.CachedBmp_177 = function() {
	this.initialize(img.CachedBmp_177);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1621,2080);


(lib.CachedBmp_176 = function() {
	this.initialize(img.CachedBmp_176);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3837,2612);


(lib.CachedBmp_175 = function() {
	this.initialize(img.CachedBmp_175);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2800,1344);


(lib.CachedBmp_173 = function() {
	this.initialize(img.CachedBmp_173);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3887,2776);


(lib.CachedBmp_172 = function() {
	this.initialize(ss["Zoom_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_171 = function() {
	this.initialize(img.CachedBmp_171);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1621,2080);


(lib.CachedBmp_170 = function() {
	this.initialize(img.CachedBmp_170);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2525,1098);


(lib.CachedBmp_168 = function() {
	this.initialize(img.CachedBmp_168);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3837,2612);


(lib.CachedBmp_167 = function() {
	this.initialize(ss["Zoom_atlas_12"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_166 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_165 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_164 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_163 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_162 = function() {
	this.initialize(ss["Zoom_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_161 = function() {
	this.initialize(img.CachedBmp_161);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3887,2776);


(lib.CachedBmp_160 = function() {
	this.initialize(ss["Zoom_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_159 = function() {
	this.initialize(ss["Zoom_atlas_12"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_158 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_157 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_156 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_155 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_154 = function() {
	this.initialize(ss["Zoom_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_153 = function() {
	this.initialize(img.CachedBmp_153);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3808,2720);


(lib.CachedBmp_152 = function() {
	this.initialize(img.CachedBmp_152);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3887,2776);


(lib.CachedBmp_151 = function() {
	this.initialize(img.CachedBmp_151);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3846,2154);


(lib.CachedBmp_150 = function() {
	this.initialize(ss["Zoom_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_149 = function() {
	this.initialize(ss["Zoom_atlas_12"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_148 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_147 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_146 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_145 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_144 = function() {
	this.initialize(ss["Zoom_atlas_7"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_143 = function() {
	this.initialize(img.CachedBmp_143);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3887,2776);


(lib.CachedBmp_142 = function() {
	this.initialize(ss["Zoom_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_141 = function() {
	this.initialize(ss["Zoom_atlas_12"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_140 = function() {
	this.initialize(img.CachedBmp_140);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1621,2080);


(lib.CachedBmp_139 = function() {
	this.initialize(img.CachedBmp_139);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2800,1344);


(lib.CachedBmp_182 = function() {
	this.initialize(ss["Zoom_atlas_13"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_137 = function() {
	this.initialize(img.CachedBmp_137);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3896,2212);


(lib.CachedBmp_136 = function() {
	this.initialize(img.CachedBmp_136);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3342,793);


(lib.CachedBmp_135 = function() {
	this.initialize(img.CachedBmp_135);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3840,2160);


(lib.CachedBmp_134 = function() {
	this.initialize(img.CachedBmp_134);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,4481,2923);


(lib.CachedBmp_133 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_132 = function() {
	this.initialize(ss["Zoom_atlas_9"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_198 = function() {
	this.initialize(img.CachedBmp_198);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2537,679);


(lib.CachedBmp_130 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_129 = function() {
	this.initialize(ss["Zoom_atlas_10"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_197 = function() {
	this.initialize(img.CachedBmp_197);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2537,679);


(lib.CachedBmp_127 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_126 = function() {
	this.initialize(ss["Zoom_atlas_10"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_196 = function() {
	this.initialize(img.CachedBmp_196);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2537,679);


(lib.CachedBmp_124 = function() {
	this.initialize(img.CachedBmp_124);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3352,2186);


(lib.CachedBmp_123 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_122 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_195 = function() {
	this.initialize(ss["Zoom_atlas_13"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_120 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_119 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_194 = function() {
	this.initialize(ss["Zoom_atlas_13"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_117 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_116 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_193 = function() {
	this.initialize(ss["Zoom_atlas_13"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_114 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_113 = function() {
	this.initialize(ss["Zoom_atlas_12"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_112 = function() {
	this.initialize(ss["Zoom_atlas_12"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_111 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_110 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_109 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_108 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_107 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_106 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_105 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_104 = function() {
	this.initialize(ss["Zoom_atlas_8"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_103 = function() {
	this.initialize(ss["Zoom_atlas_12"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_102 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_192 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_100 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_99 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_98 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(35);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_97 = function() {
	this.initialize(ss["Zoom_atlas_11"]);
	this.gotoAndStop(36);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.zoom1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_3
	this.instance = new lib.CachedBmp_191();
	this.instance.setTransform(0,0,0.3643,0.3643);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,404.8,259.8);


(lib.text = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_190();
	this.instance.setTransform(-333.95,-39.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-333.9,-39.3,668,78.5);


(lib.mail = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("Ag3D7QgVAAgKgDQgQgGAAgSQgBghAzAAIAdABIgDguQgDgeAAgPQAAgpAHhTQAHhVABgnQgsAhgMAAQgNAAgJgKQgKgJAAgNQABgPAbgVQAUgPAegZQAbgcAaAAQAVAAAAAYQAAAKgCAMIgCAWIADBBQAAAmgIBIQgIBIAAAkQAAAPACAeIAEAsIAhgBQANAAAJAJQAKAJgBANQABAOgKAJQgJAIgNAAg");
	this.shape.setTransform(-0.85,-3.075);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#A33628").s().p("AlIFJQiIiIAAjBQAAjACIiIQCIiIDAAAQDBAACHCIQCJCIAADAQAADBiJCIQiHCIjBAAQjAAAiIiIg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-46.5,-46.5,93,93);


(lib.email = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_189();
	this.instance.setTransform(-276,-138.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-276,-138.5,552,277);


(lib.sheep04 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_188();
	this.instance.setTransform(-143.35,-101.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-143.3,-101.9,287,204);


(lib.sheep03 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_187();
	this.instance.setTransform(-144.85,-101.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-144.8,-101.5,289.5,203);


(lib.sheep02 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_186();
	this.instance.setTransform(-135.35,-104.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-135.3,-104,271,208);


(lib.sheep01 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_185();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,271,208);


(lib.startagain = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// OBJECTS
	this.instance = new lib.CachedBmp_127();
	this.instance.setTransform(-106.35,-630.55,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_126();
	this.instance_1.setTransform(99.4,-726.8,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_196();
	this.instance_2.setTransform(-230.45,-730.65,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_130();
	this.instance_3.setTransform(-106.35,-630.55,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_129();
	this.instance_4.setTransform(101,-725.55,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_197();
	this.instance_5.setTransform(-230.45,-730.65,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_133();
	this.instance_6.setTransform(-106.35,-630.55,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_132();
	this.instance_7.setTransform(101,-725.55,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_198();
	this.instance_8.setTransform(-230.45,-730.65,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_5},{t:this.instance_4},{t:this.instance_3}]},1).to({state:[{t:this.instance_8},{t:this.instance_7},{t:this.instance_6}]},1).wait(2));

	// f9
	this.instance_9 = new lib.CachedBmp_134();
	this.instance_9.setTransform(-734.75,-1128.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(4));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-734.7,-1128.4,2240.5,1461.5);


(lib.start = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2
	this.instance = new lib.CachedBmp_117();
	this.instance.setTransform(144.5,-198.65,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_116();
	this.instance_1.setTransform(401.25,-258.45,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_193();
	this.instance_2.setTransform(66.25,-261.8,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_120();
	this.instance_3.setTransform(144.5,-198.65,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_119();
	this.instance_4.setTransform(401.25,-258.45,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_194();
	this.instance_5.setTransform(66.25,-261.8,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_123();
	this.instance_6.setTransform(144.5,-198.65,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_122();
	this.instance_7.setTransform(401.25,-258.55,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_195();
	this.instance_8.setTransform(66.25,-261.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_5},{t:this.instance_4},{t:this.instance_3}]},1).to({state:[{t:this.instance_8},{t:this.instance_7},{t:this.instance_6}]},1).wait(2));

	// f9
	this.instance_9 = new lib.CachedBmp_124();
	this.instance_9.setTransform(-395.8,-741.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(4));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-395.8,-741.5,1676,1093);


(lib.mouth1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#53151E").s().p("AhpAOQgsgFAAgJQAAgHAsgGQAsgGA9AAQA+AAAsAGQAsAGAAAHQAAAJgsAFQgsAGg+AAQg+AAgrgGg");
	this.shape.setTransform(15,2);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mouth1, new cjs.Rectangle(0,0,30,4), null);


(lib.mouth_sleep = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#632A37").s().p("AAFArQhcAAhbAEQgaAAgKgHQgKgIAAgTQAAgmArgLQApgKCMAAQCNAAApAKQArALAAAmQAAATgIAIQgIAHgYAAQhYgEhcAAg");
	this.shape.setTransform(22.5,4.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,45,9.5);


(lib.mouth = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("Ag2A3QgXgXAAggQAAgfAXgXQAXgXAfAAQAgAAAXAXQAWAXAAAfQAAAggWAXQgXAWggAAQgfAAgXgWg");
	this.shape.setTransform(7.75,7.75);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mouth, new cjs.Rectangle(0,0,15.5,15.5), null);


(lib.head = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_114();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,227.5,154.5);


(lib.hand_right = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_113();
	this.instance.setTransform(-177.05,-95.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-177,-95.2,354,190.5);


(lib.hand_left = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_112();
	this.instance.setTransform(-135.95,-117.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-135.9,-117.1,272,234.5);


(lib.hand_4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#F3DEDD").s().p("AgiEYQgigKgSgeIidkOQgRgdAHgiQAIghAcgTIC0h6QAfgVAlAIQAlAJASAiICfEfQARAfgKAjQgKAigeARIi1BoQgUAMgVAAQgMAAgMgDg");
	this.shape.setTransform(7.8055,-22.6926);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#DDB7AA").s().p("Aw+KtQghgfAWgpIDynGQAIgOAMgIQGmkRF0jWQLBmXBoA/QCXBdBDBGQBYBcAABlQAABXAGBYQAIB0ARBRQAJAngiAWQghAXgigWQjQiIgKhrQgOiagMgdQgWg5hFAxQhWA+5FPJQgRAKgQAAQgVAAgTgSg");
	this.shape_1.setTransform(0.0369,-0.0206);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-110.6,-70.3,221.3,140.6);


(lib.hand_2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_111();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hand_2, new cjs.Rectangle(0,0,157,306), null);


(lib.hand_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_110();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hand_1, new cjs.Rectangle(0,0,165.5,303.5), null);


(lib.hand = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EAC4B5").s().p("AD5TQQ7g5BgghSQgfhRjihAQkqhGibgtQhwggjDjAQi3i0ivjuQi1j2hPi3QhZjOBKg1QCHhgCnCDQBfBMBdCLQAsBBBbAsQBXApBOAAQApAAgGhbQgGhjhAhrQhNiEiHhVQilhpjkgVQmjgmhFh8Qgjg/A/hVQAQgVC9gHQDMgIAfgOQAsgSDfAWQBvALBmAPIBthRQCAhXBdggQBegfCFBiQBCAwAvA3IBdgPQBkgPAlAAQAmAABaCCQAtBBAlBBICgAAQA0AAFGJrQB1DgBrDZQBkDLAIAcUAANAAsAgUAZkQQLMzQIMqI4EJ2QtrsRtxsig");
	this.shape.setTransform(354.4782,281.9011);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hand, new cjs.Rectangle(0,0,709,563.8), null);


(lib.eyes_sleep = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_109();
	this.instance.setTransform(-1.5,-1.5,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.5,-1.5,111.5,11.5);


(lib.eye = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgRAYQgHgJAAgPQAAgOAHgKQAIgKAJAAQAKAAAIAKQAHAKAAAOQAAAOgHAKQgIALgKAAQgJAAgIgLg");
	this.shape.setTransform(1.5,-4);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#250F14").s().p("AgpBKQgSgeAAgsQAAgqASgfQARgfAYAAQAZAAARAfQASAfAAAqQAAArgSAfQgRAfgZAAQgYAAgRgfg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-6,-10.5,12,21);


(lib.drool = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#C7D8ED").s().p("AgDBJQgUgBgKgOQgNgPACgdQACgYAYgiQANgQALgMIAUAfQAUAkgBAZQgCAcgOAOQgMALgRAAIgDAAg");
	this.shape.setTransform(4.5164,7.3038);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,9,14.6);


(lib.clock = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_108();
	this.instance.setTransform(-305.35,-81.45,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_107();
	this.instance_1.setTransform(264.9,-81.65,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_106();
	this.instance_2.setTransform(-19.1,200.6,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_105();
	this.instance_3.setTransform(-31.15,-360.3,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_104();
	this.instance_4.setTransform(-373.55,-417.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-373.5,-417.2,749.5,818);


(lib.arrowmin = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8E1E23").s().p("AnRxSIiDAwIBWmcIFHEHIiOAzMAOaAoQIiMAzg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-59.7,-147,119.4,294.1);


(lib.arrowhour = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8E1E23").s().p("AyAAAIELjaIAACWIf2AAIAACUI/2AAIAACLg");
	this.shape.setTransform(0.025,0.025);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-115.2,-21.9,230.5,43.9);


(lib.alarmr = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_103();
	this.instance.setTransform(-126.25,-105.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-126.2,-105.9,252.5,212);


(lib.alarml = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_102();
	this.instance.setTransform(-126.3,-102.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-126.3,-102.2,252.5,204.5);


(lib.aclock_g = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_192();
	this.instance.setTransform(-46.75,-53.9,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_100();
	this.instance_1.setTransform(-36.95,-4.15,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_99();
	this.instance_2.setTransform(29.65,-4.15,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_98();
	this.instance_3.setTransform(-3.5,28.8,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_97();
	this.instance_4.setTransform(-4.95,-36.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-46.7,-53.9,93.5,108);


(lib.Scene14 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// mask_t (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_52 = new cjs.Graphics().p("AG+QjIuRAAIAAAAMAAAghFIAAAAIORAAIAWAAMAAAAhFg");
	var mask_graphics_53 = new cjs.Graphics().p("AIvQjIx5AAIAAAAMAAAghFIAAAAIR5AAIAcAAMAAAAhFg");
	var mask_graphics_54 = new cjs.Graphics().p("AKhQjI1jAAIAAAAMAAAghFIAAAAIVjAAIAiAAMAAAAhFg");
	var mask_graphics_55 = new cjs.Graphics().p("AMSQjI5LAAIAAAAMAAAghFIAAAAIZLAAIAoAAMAAAAhFg");
	var mask_graphics_56 = new cjs.Graphics().p("AOEQjI80AAIAAAAMAAAghFIAAAAIc0AAIAtAAMAAAAhFg");
	var mask_graphics_57 = new cjs.Graphics().p("AP1QjMggcAAAIAAAAMAAAghFIAAAAMAgcAAAIAzAAMAAAAhFg");
	var mask_graphics_58 = new cjs.Graphics().p("ARnQjMgkFAAAIAAAAMAAAghFIAAAAMAkFAAAIA4AAMAAAAhFg");
	var mask_graphics_59 = new cjs.Graphics().p("ATYQjMgntAAAIAAAAMAAAghFIAAAAMAntAAAIA+AAMAAAAhFg");
	var mask_graphics_60 = new cjs.Graphics().p("AVKQjMgrWAAAIgBAAMAAAghFIABAAMArWAAAIBEAAMAAAAhFg");
	var mask_graphics_61 = new cjs.Graphics().p("AW7QjMgu+AAAIgBAAMAAAghFIABAAMAu+AAAIBKAAMAAAAhFg");
	var mask_graphics_62 = new cjs.Graphics().p("AYsQjMgynAAAIAAAAMAAAghFIAAAAMAynAAAIBQAAMAAAAhFg");
	var mask_graphics_63 = new cjs.Graphics().p("AaeQjMg2QAAAIAAAAMAAAghFIAAAAMA2QAAAIBVAAMAAAAhFg");
	var mask_graphics_64 = new cjs.Graphics().p("AcPQjMg54AAAIAAAAMAAAghFIAAAAMA54AAAIBbAAMAAAAhFg");
	var mask_graphics_65 = new cjs.Graphics().p("AeBQjMg9hAAAIAAAAMAAAghFIAAAAMA9hAAAIBgAAMAAAAhFg");
	var mask_graphics_66 = new cjs.Graphics().p("AfyQjMhBJAAAIAAAAMAAAghFIAAAAMBBJAAAIBmAAMAAAAhFg");
	var mask_graphics_67 = new cjs.Graphics().p("EAhkAQjMhEyAAAIgBAAMAAAghFIABAAMBEyAAAIBsAAMAAAAhFg");
	var mask_graphics_68 = new cjs.Graphics().p("EAjVAQjMhIaAAAIgBAAMAAAghFIABAAMBIaAAAIByAAMAAAAhFg");
	var mask_graphics_69 = new cjs.Graphics().p("EAlHAQjMhMEAAAIAAAAMAAAghFIAAAAMBMEAAAIB3AAMAAAAhFg");
	var mask_graphics_70 = new cjs.Graphics().p("EAm4AQjMhPsAAAIAAAAMAAAghFIAAAAMBPsAAAIB9AAMAAAAhFg");
	var mask_graphics_71 = new cjs.Graphics().p("EAoqAQjMhTVAAAIAAAAMAAAghFIAAAAMBTVAAAICCAAMAAAAhFg");
	var mask_graphics_72 = new cjs.Graphics().p("EAqbAQjMhW9AAAIAAAAMAAAghFIAAAAMBW9AAAICIAAMAAAAhFg");
	var mask_graphics_73 = new cjs.Graphics().p("EAsMAQjMhalAAAIAAAAMAAAghFIAAAAMBalAAAICOAAMAAAAhFg");
	var mask_graphics_74 = new cjs.Graphics().p("EAt+AQjMheOAAAIgBAAMAAAghFIABAAMBeOAAAICUAAMAAAAhFg");
	var mask_graphics_75 = new cjs.Graphics().p("EAvvAQjMhh2AAAIgBAAMAAAghFIABAAMBh2AAAICaAAMAAAAhFg");
	var mask_graphics_76 = new cjs.Graphics().p("EAxhAQjMhlfAAAIgBAAMAAAghFIABAAMBlfAAAICfAAMAAAAhFg");
	var mask_graphics_77 = new cjs.Graphics().p("EAzSAQjMhpIAAAIAAAAMAAAghFIAAAAMBpIAAAIClAAMAAAAhFg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(52).to({graphics:mask_graphics_52,x:565.4048,y:-170.4501}).wait(1).to({graphics:mask_graphics_53,x:576.454,y:-170.4524}).wait(1).to({graphics:mask_graphics_54,x:587.5038,y:-170.4546}).wait(1).to({graphics:mask_graphics_55,x:598.5531,y:-170.4564}).wait(1).to({graphics:mask_graphics_56,x:609.6024,y:-170.4587}).wait(1).to({graphics:mask_graphics_57,x:620.6521,y:-170.4609}).wait(1).to({graphics:mask_graphics_58,x:631.7015,y:-170.4632}).wait(1).to({graphics:mask_graphics_59,x:642.7507,y:-170.4654}).wait(1).to({graphics:mask_graphics_60,x:653.8005,y:-170.4677}).wait(1).to({graphics:mask_graphics_61,x:664.8498,y:-170.4699}).wait(1).to({graphics:mask_graphics_62,x:675.8991,y:-170.4717}).wait(1).to({graphics:mask_graphics_63,x:686.948,y:-170.474}).wait(1).to({graphics:mask_graphics_64,x:697.9977,y:-170.4762}).wait(1).to({graphics:mask_graphics_65,x:709.047,y:-170.4785}).wait(1).to({graphics:mask_graphics_66,x:720.0963,y:-170.4807}).wait(1).to({graphics:mask_graphics_67,x:731.146,y:-170.483}).wait(1).to({graphics:mask_graphics_68,x:742.1954,y:-170.4848}).wait(1).to({graphics:mask_graphics_69,x:753.2446,y:-170.487}).wait(1).to({graphics:mask_graphics_70,x:764.2939,y:-170.4893}).wait(1).to({graphics:mask_graphics_71,x:775.3437,y:-170.4915}).wait(1).to({graphics:mask_graphics_72,x:786.393,y:-170.4938}).wait(1).to({graphics:mask_graphics_73,x:797.4423,y:-170.496}).wait(1).to({graphics:mask_graphics_74,x:808.492,y:-170.4978}).wait(1).to({graphics:mask_graphics_75,x:819.5413,y:-170.5001}).wait(1).to({graphics:mask_graphics_76,x:830.5907,y:-170.5023}).wait(1).to({graphics:mask_graphics_77,x:841.4361,y:-170.4501}).wait(13));

	// text
	this.instance = new lib.CachedBmp_180();
	this.instance.setTransform(679.6,-222.1,0.5,0.5);
	this.instance._off = true;

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(52).to({_off:false},0).wait(38));

	// screen (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	var mask_1_graphics_13 = new cjs.Graphics().p("EBBCACCMiFTAAAIgBAAIAAkDIABAAMCFTAAAIDRAAIAAEDg");
	var mask_1_graphics_14 = new cjs.Graphics().p("EBBCADBMiFTAAAIgBAAIAAmBIABAAMCFTAAAIDRAAIAAGBg");
	var mask_1_graphics_15 = new cjs.Graphics().p("EBBCAEBMiFTAAAIgBAAIAAoBIABAAMCFTAAAIDRAAIAAIBg");
	var mask_1_graphics_16 = new cjs.Graphics().p("EBBCAFBMiFTAAAIgBAAIAAqBIABAAMCFTAAAIDRAAIAAKBg");
	var mask_1_graphics_17 = new cjs.Graphics().p("EBBCAGBMiFTAAAIgBAAIAAsBIABAAMCFTAAAIDRAAIAAMBg");
	var mask_1_graphics_18 = new cjs.Graphics().p("EBBCAHBMiFTAAAIgBAAIAAuBIABAAMCFTAAAIDRAAIAAOBg");
	var mask_1_graphics_19 = new cjs.Graphics().p("EBBCAIBMiFTAAAIgBAAIAAwBIABAAMCFTAAAIDRAAIAAQBg");
	var mask_1_graphics_20 = new cjs.Graphics().p("EBBCAJBMiFTAAAIgBAAIAAyBIABAAMCFTAAAIDRAAIAASBg");
	var mask_1_graphics_21 = new cjs.Graphics().p("EBBCAKAMiFTAAAIgBAAIAAz/IABAAMCFTAAAIDRAAIAAT/g");
	var mask_1_graphics_22 = new cjs.Graphics().p("EBBCALAMiFTAAAIgBAAIAA1/IABAAMCFTAAAIDRAAIAAV/g");
	var mask_1_graphics_23 = new cjs.Graphics().p("EBBCAMAMiFTAAAIgBAAIAA3/IABAAMCFTAAAIDRAAIAAX/g");
	var mask_1_graphics_24 = new cjs.Graphics().p("EBBCANAMiFTAAAIgBAAIAA5/IABAAMCFTAAAIDRAAIAAZ/g");
	var mask_1_graphics_25 = new cjs.Graphics().p("EBBCAOAMiFTAAAIgBAAIAA7/IABAAMCFTAAAIDRAAIAAb/g");
	var mask_1_graphics_26 = new cjs.Graphics().p("EBBCAPAMiFTAAAIgBAAIAA9/IABAAMCFTAAAIDRAAIAAd/g");
	var mask_1_graphics_27 = new cjs.Graphics().p("EBBCAQAMiFTAAAIgBAAIAA//IABAAMCFTAAAIDRAAIAAf/g");
	var mask_1_graphics_28 = new cjs.Graphics().p("EBBCAQ/MiFTAAAIgBAAMAAAgh9IABAAMCFTAAAIDRAAMAAAAh9g");
	var mask_1_graphics_29 = new cjs.Graphics().p("EBBCAR/MiFTAAAIgBAAMAAAgj9IABAAMCFTAAAIDRAAMAAAAj9g");
	var mask_1_graphics_30 = new cjs.Graphics().p("EBBCAS/MiFTAAAIgBAAMAAAgl9IABAAMCFTAAAIDRAAMAAAAl9g");
	var mask_1_graphics_31 = new cjs.Graphics().p("EBBCAT/MiFTAAAIgBAAMAAAgn9IABAAMCFTAAAIDRAAMAAAAn9g");
	var mask_1_graphics_32 = new cjs.Graphics().p("EBBCAU/MiFTAAAIgBAAMAAAgp9IABAAMCFTAAAIDRAAMAAAAp9g");
	var mask_1_graphics_33 = new cjs.Graphics().p("EBBCAV/MiFTAAAIgBAAMAAAgr9IABAAMCFTAAAIDRAAMAAAAr9g");
	var mask_1_graphics_34 = new cjs.Graphics().p("EBBCAW/MiFTAAAIgBAAMAAAgt9IABAAMCFTAAAIDRAAMAAAAt9g");
	var mask_1_graphics_35 = new cjs.Graphics().p("EBBCAX+MiFTAAAIgBAAMAAAgv7IABAAMCFTAAAIDRAAMAAAAv7g");
	var mask_1_graphics_36 = new cjs.Graphics().p("EBBCAY+MiFTAAAIgBAAMAAAgx7IABAAMCFTAAAIDRAAMAAAAx7g");
	var mask_1_graphics_37 = new cjs.Graphics().p("EBBCAZ+MiFTAAAIgBAAMAAAgz7IABAAMCFTAAAIDRAAMAAAAz7g");
	var mask_1_graphics_38 = new cjs.Graphics().p("EBBCAa+MiFTAAAIgBAAMAAAg17IABAAMCFTAAAIDRAAMAAAA17g");
	var mask_1_graphics_39 = new cjs.Graphics().p("EBBCAb+MiFTAAAIgBAAMAAAg37IABAAMCFTAAAIDRAAMAAAA37g");
	var mask_1_graphics_40 = new cjs.Graphics().p("EBBCAc+MiFTAAAIgBAAMAAAg57IABAAMCFTAAAIDRAAMAAAA57g");
	var mask_1_graphics_41 = new cjs.Graphics().p("EBBCAd+MiFTAAAIgBAAMAAAg77IABAAMCFTAAAIDRAAMAAAA77g");
	var mask_1_graphics_42 = new cjs.Graphics().p("EBBCAe9MiFTAAAIgBAAMAAAg95IABAAMCFTAAAIDRAAMAAAA95g");
	var mask_1_graphics_43 = new cjs.Graphics().p("EBBCAf9MiFTAAAIgBAAMAAAg/5IABAAMCFTAAAIDRAAMAAAA/5g");
	var mask_1_graphics_44 = new cjs.Graphics().p("EBBCAg9MiFTAAAIgBAAMAAAhB5IABAAMCFTAAAIDRAAMAAABB5g");
	var mask_1_graphics_45 = new cjs.Graphics().p("EBBCAh9MiFTAAAIgBAAMAAAhD5IABAAMCFTAAAIDRAAMAAABD5g");
	var mask_1_graphics_46 = new cjs.Graphics().p("EBBCAi9MiFTAAAIgBAAMAAAhF5IABAAMCFTAAAIDRAAMAAABF5g");
	var mask_1_graphics_47 = new cjs.Graphics().p("EBBCAj9MiFTAAAIgBAAMAAAhH5IABAAMCFTAAAIDRAAMAAABH5g");
	var mask_1_graphics_48 = new cjs.Graphics().p("EBBCAk9MiFTAAAIgBAAMAAAhJ5IABAAMCFTAAAIDRAAMAAABJ5g");
	var mask_1_graphics_49 = new cjs.Graphics().p("EBBCAl8MiFTAAAIgBAAMAAAhL3IABAAMCFTAAAIDRAAMAAABL3g");
	var mask_1_graphics_50 = new cjs.Graphics().p("EBBCAm8MiFTAAAIgBAAMAAAhN3IABAAMCFTAAAIDRAAMAAABN3g");
	var mask_1_graphics_51 = new cjs.Graphics().p("EBBCAn8MiFTAAAIgBAAMAAAhP3IABAAMCFTAAAIDRAAMAAABP3g");
	var mask_1_graphics_52 = new cjs.Graphics().p("EBBCAo8MiFTAAAIgBAAMAAAhR3IABAAMCFTAAAIDRAAMAAABR3g");

	this.timeline.addTween(cjs.Tween.get(mask_1).to({graphics:null,x:0,y:0}).wait(13).to({graphics:mask_1_graphics_13,x:838.9957,y:-441}).wait(1).to({graphics:mask_1_graphics_14,x:838.9957,y:-434.61}).wait(1).to({graphics:mask_1_graphics_15,x:838.9957,y:-428.2205}).wait(1).to({graphics:mask_1_graphics_16,x:838.9957,y:-421.8305}).wait(1).to({graphics:mask_1_graphics_17,x:838.9957,y:-415.4409}).wait(1).to({graphics:mask_1_graphics_18,x:838.9957,y:-409.0509}).wait(1).to({graphics:mask_1_graphics_19,x:838.9957,y:-402.6614}).wait(1).to({graphics:mask_1_graphics_20,x:838.9957,y:-396.2714}).wait(1).to({graphics:mask_1_graphics_21,x:838.9957,y:-389.8814}).wait(1).to({graphics:mask_1_graphics_22,x:838.9957,y:-383.4918}).wait(1).to({graphics:mask_1_graphics_23,x:838.9957,y:-377.1018}).wait(1).to({graphics:mask_1_graphics_24,x:838.9957,y:-370.7123}).wait(1).to({graphics:mask_1_graphics_25,x:838.9957,y:-364.3223}).wait(1).to({graphics:mask_1_graphics_26,x:838.9957,y:-357.9327}).wait(1).to({graphics:mask_1_graphics_27,x:838.9957,y:-351.5427}).wait(1).to({graphics:mask_1_graphics_28,x:838.9957,y:-345.1527}).wait(1).to({graphics:mask_1_graphics_29,x:838.9957,y:-338.7632}).wait(1).to({graphics:mask_1_graphics_30,x:838.9957,y:-332.3732}).wait(1).to({graphics:mask_1_graphics_31,x:838.9957,y:-325.9836}).wait(1).to({graphics:mask_1_graphics_32,x:838.9957,y:-319.5936}).wait(1).to({graphics:mask_1_graphics_33,x:838.9957,y:-313.2041}).wait(1).to({graphics:mask_1_graphics_34,x:838.9957,y:-306.8141}).wait(1).to({graphics:mask_1_graphics_35,x:838.9957,y:-300.4241}).wait(1).to({graphics:mask_1_graphics_36,x:838.9957,y:-294.0345}).wait(1).to({graphics:mask_1_graphics_37,x:838.9957,y:-287.6445}).wait(1).to({graphics:mask_1_graphics_38,x:838.9957,y:-281.255}).wait(1).to({graphics:mask_1_graphics_39,x:838.9957,y:-274.865}).wait(1).to({graphics:mask_1_graphics_40,x:838.9957,y:-268.4754}).wait(1).to({graphics:mask_1_graphics_41,x:838.9957,y:-262.0854}).wait(1).to({graphics:mask_1_graphics_42,x:838.9957,y:-255.6954}).wait(1).to({graphics:mask_1_graphics_43,x:838.9957,y:-249.3059}).wait(1).to({graphics:mask_1_graphics_44,x:838.9957,y:-242.9159}).wait(1).to({graphics:mask_1_graphics_45,x:838.9957,y:-236.5263}).wait(1).to({graphics:mask_1_graphics_46,x:838.9957,y:-230.1363}).wait(1).to({graphics:mask_1_graphics_47,x:838.9957,y:-223.7468}).wait(1).to({graphics:mask_1_graphics_48,x:838.9957,y:-217.3568}).wait(1).to({graphics:mask_1_graphics_49,x:838.9957,y:-210.9668}).wait(1).to({graphics:mask_1_graphics_50,x:838.9957,y:-204.5772}).wait(1).to({graphics:mask_1_graphics_51,x:838.9957,y:-198.1872}).wait(1).to({graphics:mask_1_graphics_52,x:838.9957,y:-192.0002}).wait(38));

	// screen_mask
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("Eg8WgieMB4fgAUMAAOBFQMh4fAAVg");
	this.shape.setTransform(839.85,-148.325);
	this.shape._off = true;

	var maskedShapeInstanceList = [this.shape];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask_1;
	}

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(13).to({_off:false},0).wait(77));

	// hand
	this.instance_1 = new lib.hand();
	this.instance_1.setTransform(1172.25,701.75,1,1,0,0,0,354.4,281.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({x:1536.35,y:351.75},13).to({x:1292.25,y:597.75},11).wait(66));

	// background
	this.instance_2 = new lib.CachedBmp_181();
	this.instance_2.setTransform(-30.1,25.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(90));

	// computer
	this.instance_3 = new lib.CachedBmp_183();
	this.instance_3.setTransform(318.85,-397.1,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_182();
	this.instance_4.setTransform(611.45,-292.65,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3}]}).wait(90));

	// table
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#9E8161").s().p("EiVXAo3MAAAhRtMEqvAAAMAAABRtg");
	this.shape_1.setTransform(866,253.5);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(90));

	// window
	this.instance_5 = new lib.CachedBmp_184();
	this.instance_5.setTransform(5.3,-887.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(90));

	// hall
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#DEE5E9").s().p("EiVXAwwMAAAhhfMEqvAAAMAAABhfg");
	this.shape_2.setTransform(866,-308);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(90));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-90,-887.8,1980.9,1871.5);


(lib.Scene13 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Hand_3
	this.instance = new lib.hand_1();
	this.instance.setTransform(705.1,427.95,1,1,0,0,0,165.7,303.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:165.8,rotation:36.2418},29).to({rotation:-8.7576,x:708.3,y:427.9},31).to({rotation:29.7079,x:708.25,y:427.85},30).wait(1));

	// table
	this.instance_1 = new lib.CachedBmp_178();
	this.instance_1.setTransform(94.95,116.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(91));

	// hand_2
	this.instance_2 = new lib.hand_2();
	this.instance_2.setTransform(734,404.45,1,1,0,0,0,0,306.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({regX:38.4,regY:281.2,rotation:-29.9992,x:719.7,y:387},29).to({rotation:14.999,x:772.55,y:379.4},31).to({scaleX:0.9999,scaleY:0.9999,rotation:-14.9992,x:772.45,y:379.3},30).wait(1));

	// background
	this.instance_3 = new lib.CachedBmp_179();
	this.instance_3.setTransform(0.8,-291.95,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(91));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.8,-291.9,1943.5,1388);


(lib.Scene12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// masc (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("ABueUIjhAAIAAAAMAAAg8nIAAAAIDhAAIAGAAMAAAA8ng");
	var mask_graphics_1 = new cjs.Graphics().p("AC8eUImBAAIAAAAMAAAg8nIAAAAIGBAAIAKAAMAAAA8ng");
	var mask_graphics_2 = new cjs.Graphics().p("AEKeVIohAAIAAAAMAAAg8pIAAAAIIhAAIAOAAMAAAA8pg");
	var mask_graphics_3 = new cjs.Graphics().p("AFYeUIrAAAIAAAAMAAAg8nIAAAAILAAAIARAAMAAAA8ng");
	var mask_graphics_4 = new cjs.Graphics().p("AGmeUItgAAIAAAAMAAAg8nIAAAAINgAAIAVAAMAAAA8ng");
	var mask_graphics_5 = new cjs.Graphics().p("AH0eUIwAAAIAAAAMAAAg8nIAAAAIQAAAIAZAAMAAAA8ng");
	var mask_graphics_6 = new cjs.Graphics().p("AJCeUIygAAIAAAAMAAAg8nIAAAAISgAAIAdAAMAAAA8ng");
	var mask_graphics_7 = new cjs.Graphics().p("AKPeUI0+AAIAAAAMAAAg8nIAAAAIU+AAIAhAAMAAAA8ng");
	var mask_graphics_8 = new cjs.Graphics().p("ALdeUI3eAAIAAAAMAAAg8nIAAAAIXeAAIAlAAMAAAA8ng");
	var mask_graphics_9 = new cjs.Graphics().p("AMreVI5+AAIAAAAMAAAg8pIAAAAIZ+AAIApAAMAAAA8pg");
	var mask_graphics_10 = new cjs.Graphics().p("AN5eVI8eAAIAAAAMAAAg8pIAAAAIceAAIAtAAMAAAA8pg");
	var mask_graphics_11 = new cjs.Graphics().p("APHeUI+9AAIAAAAMAAAg8nIAAAAIe9AAIAwAAMAAAA8ng");
	var mask_graphics_12 = new cjs.Graphics().p("AQVeUMghdAAAIAAAAMAAAg8nIAAAAMAhdAAAIA0AAMAAAA8ng");
	var mask_graphics_13 = new cjs.Graphics().p("ARjeUMgj9AAAIAAAAMAAAg8nIAAAAMAj9AAAIA4AAMAAAA8ng");
	var mask_graphics_14 = new cjs.Graphics().p("ASweUMgmcAAAIAAAAMAAAg8nIAAAAMAmcAAAIA9AAMAAAA8ng");
	var mask_graphics_15 = new cjs.Graphics().p("AT+eUMgo7AAAIgBAAMAAAg8nIABAAMAo7AAAIBBAAMAAAA8ng");
	var mask_graphics_16 = new cjs.Graphics().p("AVMeUMgrbAAAIAAAAMAAAg8nIAAAAMArbAAAIBEAAMAAAA8ng");
	var mask_graphics_17 = new cjs.Graphics().p("AWaeVMgt7AAAIAAAAMAAAg8pIAAAAMAt7AAAIBIAAMAAAA8pg");
	var mask_graphics_18 = new cjs.Graphics().p("AXoeUMgwbAAAIAAAAMAAAg8nIAAAAMAwbAAAIBMAAMAAAA8ng");
	var mask_graphics_19 = new cjs.Graphics().p("AY2eUMgy6AAAIgBAAMAAAg8nIABAAMAy6AAAIBQAAMAAAA8ng");
	var mask_graphics_20 = new cjs.Graphics().p("AaEeUMg1aAAAIAAAAMAAAg8nIAAAAMA1aAAAIBTAAMAAAA8ng");
	var mask_graphics_21 = new cjs.Graphics().p("AbReUMg35AAAIAAAAMAAAg8nIAAAAMA35AAAIBYAAMAAAA8ng");
	var mask_graphics_22 = new cjs.Graphics().p("AcfeUMg6ZAAAIAAAAMAAAg8nIAAAAMA6ZAAAIBcAAMAAAA8ng");
	var mask_graphics_23 = new cjs.Graphics().p("AdteUMg84AAAIgBAAMAAAg8nIABAAMA84AAAIBgAAMAAAA8ng");
	var mask_graphics_24 = new cjs.Graphics().p("Ae7eVMg/YAAAIAAAAMAAAg8pIAAAAMA/YAAAIBjAAMAAAA8pg");
	var mask_graphics_25 = new cjs.Graphics().p("EAgJAeVMhB4AAAIAAAAMAAAg8pIAAAAMBB4AAAIBnAAMAAAA8pg");
	var mask_graphics_26 = new cjs.Graphics().p("EAhXAeUMhEYAAAIAAAAMAAAg8nIAAAAMBEYAAAIBrAAMAAAA8ng");
	var mask_graphics_27 = new cjs.Graphics().p("EAilAeUMhG3AAAIgBAAMAAAg8nIABAAMBG3AAAIBvAAMAAAA8ng");
	var mask_graphics_28 = new cjs.Graphics().p("EAjyAeUMhJWAAAIAAAAMAAAg8nIAAAAMBJWAAAIBzAAMAAAA8ng");
	var mask_graphics_29 = new cjs.Graphics().p("EAlAAeUMhL2AAAIAAAAMAAAg8nIAAAAMBL2AAAIB3AAMAAAA8ng");
	var mask_graphics_30 = new cjs.Graphics().p("EAmOAeUMhOWAAAIAAAAMAAAg8nIAAAAMBOWAAAIB7AAMAAAA8ng");
	var mask_graphics_31 = new cjs.Graphics().p("EAncAeUMhQ1AAAIgBAAMAAAg8nIABAAMBQ1AAAIB/AAMAAAA8ng");
	var mask_graphics_32 = new cjs.Graphics().p("EAoqAeVMhTVAAAIgBAAMAAAg8pIABAAMBTVAAAICDAAMAAAA8pg");
	var mask_graphics_33 = new cjs.Graphics().p("EAp4AeUMhV1AAAIAAAAMAAAg8nIAAAAMBV1AAAICGAAMAAAA8ng");
	var mask_graphics_34 = new cjs.Graphics().p("EArGAeUMhYVAAAIAAAAMAAAg8nIAAAAMBYVAAAICKAAMAAAA8ng");
	var mask_graphics_35 = new cjs.Graphics().p("EAsTAeUMhazAAAIgBAAMAAAg8nIABAAMBazAAAICPAAMAAAA8ng");
	var mask_graphics_36 = new cjs.Graphics().p("EAthAeUMhdTAAAIgBAAMAAAg8nIABAAMBdTAAAICTAAMAAAA8ng");
	var mask_graphics_37 = new cjs.Graphics().p("EAuvAeUMhfzAAAIAAAAMAAAg8nIAAAAMBfzAAAICWAAMAAAA8ng");
	var mask_graphics_38 = new cjs.Graphics().p("EAv9AeUMhiTAAAIAAAAMAAAg8nIAAAAMBiTAAAICaAAMAAAA8ng");
	var mask_graphics_39 = new cjs.Graphics().p("EAxLAeVMhkyAAAIgBAAMAAAg8pIABAAMBkyAAAICeAAMAAAA8pg");
	var mask_graphics_40 = new cjs.Graphics().p("EAyZAeVMhnSAAAIgBAAMAAAg8pIABAAMBnSAAAICiAAMAAAA8pg");
	var mask_graphics_41 = new cjs.Graphics().p("EAznAeUMhpyAAAIAAAAMAAAg8nIAAAAMBpyAAAIClAAMAAAA8ng");
	var mask_graphics_42 = new cjs.Graphics().p("EA00AeUMhsRAAAIAAAAMAAAg8nIAAAAMBsRAAAICqAAMAAAA8ng");
	var mask_graphics_43 = new cjs.Graphics().p("EA2CAeUMhuxAAAIAAAAMAAAg8nIAAAAMBuxAAAICuAAMAAAA8ng");
	var mask_graphics_44 = new cjs.Graphics().p("EA3QAeUMhxQAAAIgBAAMAAAg8nIABAAMBxQAAAICyAAMAAAA8ng");
	var mask_graphics_45 = new cjs.Graphics().p("EA4eAeUMhzwAAAIgBAAMAAAg8nIABAAMBzwAAAIC2AAMAAAA8ng");
	var mask_graphics_46 = new cjs.Graphics().p("EA5sAeUMh2QAAAIAAAAMAAAg8nIAAAAMB2QAAAIC5AAMAAAA8ng");
	var mask_graphics_47 = new cjs.Graphics().p("EA66AeVMh4wAAAIAAAAMAAAg8pIAAAAMB4wAAAIC9AAMAAAA8pg");
	var mask_graphics_48 = new cjs.Graphics().p("EA8IAeUMh7PAAAIgBAAMAAAg8nIABAAMB7PAAAIDBAAMAAAA8ng");
	var mask_graphics_49 = new cjs.Graphics().p("EA9VAeUMh9uAAAIgBAAMAAAg8nIABAAMB9uAAAIDGAAMAAAA8ng");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:1235.2513,y:263.8998}).wait(1).to({graphics:mask_graphics_1,x:1227.6981,y:263.9007}).wait(1).to({graphics:mask_graphics_2,x:1220.1453,y:263.902}).wait(1).to({graphics:mask_graphics_3,x:1212.5925,y:263.9034}).wait(1).to({graphics:mask_graphics_4,x:1205.0402,y:263.9043}).wait(1).to({graphics:mask_graphics_5,x:1197.4873,y:263.9052}).wait(1).to({graphics:mask_graphics_6,x:1189.9345,y:263.9061}).wait(1).to({graphics:mask_graphics_7,x:1182.3813,y:263.907}).wait(1).to({graphics:mask_graphics_8,x:1174.8285,y:263.9079}).wait(1).to({graphics:mask_graphics_9,x:1167.2756,y:263.9092}).wait(1).to({graphics:mask_graphics_10,x:1159.7233,y:263.9102}).wait(1).to({graphics:mask_graphics_11,x:1152.1705,y:263.9115}).wait(1).to({graphics:mask_graphics_12,x:1144.6177,y:263.9124}).wait(1).to({graphics:mask_graphics_13,x:1137.0649,y:263.9133}).wait(1).to({graphics:mask_graphics_14,x:1129.5117,y:263.9142}).wait(1).to({graphics:mask_graphics_15,x:1121.9589,y:263.9151}).wait(1).to({graphics:mask_graphics_16,x:1114.4061,y:263.916}).wait(1).to({graphics:mask_graphics_17,x:1106.8537,y:263.9173}).wait(1).to({graphics:mask_graphics_18,x:1099.3009,y:263.9187}).wait(1).to({graphics:mask_graphics_19,x:1091.7481,y:263.9196}).wait(1).to({graphics:mask_graphics_20,x:1084.1949,y:263.9205}).wait(1).to({graphics:mask_graphics_21,x:1076.6421,y:263.9214}).wait(1).to({graphics:mask_graphics_22,x:1069.0893,y:263.9223}).wait(1).to({graphics:mask_graphics_23,x:1061.5369,y:263.9232}).wait(1).to({graphics:mask_graphics_24,x:1053.9841,y:263.9245}).wait(1).to({graphics:mask_graphics_25,x:1046.4313,y:263.9255}).wait(1).to({graphics:mask_graphics_26,x:1038.8785,y:263.9268}).wait(1).to({graphics:mask_graphics_27,x:1031.3253,y:263.9277}).wait(1).to({graphics:mask_graphics_28,x:1023.7725,y:263.9286}).wait(1).to({graphics:mask_graphics_29,x:1016.2201,y:263.9295}).wait(1).to({graphics:mask_graphics_30,x:1008.6673,y:263.9304}).wait(1).to({graphics:mask_graphics_31,x:1001.1146,y:263.9313}).wait(1).to({graphics:mask_graphics_32,x:993.5617,y:263.9327}).wait(1).to({graphics:mask_graphics_33,x:986.0085,y:263.934}).wait(1).to({graphics:mask_graphics_34,x:978.4557,y:263.9349}).wait(1).to({graphics:mask_graphics_35,x:970.9029,y:263.9358}).wait(1).to({graphics:mask_graphics_36,x:963.3506,y:263.9367}).wait(1).to({graphics:mask_graphics_37,x:955.7977,y:263.9376}).wait(1).to({graphics:mask_graphics_38,x:948.2449,y:263.9385}).wait(1).to({graphics:mask_graphics_39,x:940.6917,y:263.9399}).wait(1).to({graphics:mask_graphics_40,x:933.1389,y:263.9407}).wait(1).to({graphics:mask_graphics_41,x:925.5861,y:263.9421}).wait(1).to({graphics:mask_graphics_42,x:918.0333,y:263.943}).wait(1).to({graphics:mask_graphics_43,x:910.481,y:263.9439}).wait(1).to({graphics:mask_graphics_44,x:902.9281,y:263.9448}).wait(1).to({graphics:mask_graphics_45,x:895.3753,y:263.9457}).wait(1).to({graphics:mask_graphics_46,x:887.8221,y:263.9466}).wait(1).to({graphics:mask_graphics_47,x:880.2693,y:263.9479}).wait(1).to({graphics:mask_graphics_48,x:872.7165,y:263.9493}).wait(1).to({graphics:mask_graphics_49,x:864.0436,y:263.8998}).wait(42));

	// text
	this.instance = new lib.text("synched",0);
	this.instance.setTransform(847.4,262.35);

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).to({_off:true},61).wait(30));

	// computer
	this.instance_1 = new lib.CachedBmp_175();
	this.instance_1.setTransform(327.1,-10.1,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_182();
	this.instance_2.setTransform(619.7,94.35,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2},{t:this.instance_1}]}).wait(91));

	// background
	this.instance_3 = new lib.CachedBmp_176();
	this.instance_3.setTransform(-84,-9.05,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({_off:true},61).wait(30));

	// table
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#9E8161").s().p("EiVXAo3MAAAhRtMEqvAAAMAAABRtg");
	this.shape.setTransform(874.25,640.5);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(91));

	// window
	this.instance_4 = new lib.CachedBmp_177();
	this.instance_4.setTransform(13.55,-500.8,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(91));

	// hall
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#DEE5E9").s().p("EiVXAwwMAAAhhfMEqvAAAMAAABhfg");
	this.shape_1.setTransform(874.25,79);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(91));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-84,-500.8,1918.5,1797.8);


(lib.Scene111 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// table
	this.instance = new lib.CachedBmp_172();
	this.instance.setTransform(536.55,-319.65,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(41));

	// hand
	this.instance_1 = new lib.hand_4("synched",0);
	this.instance_1.setTransform(1023.45,-145.35);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({x:1024.7,y:-173.35},20).to({y:-143.35},20).wait(1));

	// background
	this.instance_2 = new lib.CachedBmp_173();
	this.instance_2.setTransform(-74.7,-860.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(41));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-74.7,-860.9,1943.5,1388);


(lib.Scene11 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// masc_1 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_29 = new cjs.Graphics().p("EBVtgS8QAAgBgBAAQAAAAAAgBQAAAAAAgBQAAAAAAgBQAAAAAAgBQAAAAAAgBQAAAAAAgBQABAAAAAAQAAgBABAAQAAAAABAAQAAgBABAAQAAAAAAAAQABAAAAAAQABAAAAABQABAAAAAAQABAAAAABQAAAAABAAQAAABAAAAQAAABAAAAQAAABAAAAQAAABAAAAQAAABAAAAQAAABAAAAQgBAAAAABQAAAAgBAAQAAABgBAAQAAAAgBAAQAAAAgBAAQAAAAAAAAQgBAAAAAAQgBAAAAgBQgBAAAAAAg");
	var mask_graphics_30 = new cjs.Graphics().p("EBVDgSPQgMgLAAgRQAAgRAMgLQALgMARAAQARAAALAMQAMALAAARQAAARgMALQgLAMgRAAQgRAAgLgMg");
	var mask_graphics_31 = new cjs.Graphics().p("EBUYgRhQgWgWAAgfQAAgfAWgWQAWgXAfAAQAgAAAWAXQAWAWAAAfQAAAfgWAWQgWAWggAAQgfAAgWgWg");
	var mask_graphics_32 = new cjs.Graphics().p("EBTugQzQghghAAgtQAAguAhghQAgggAuAAQAuAAAgAgQAgAhAAAuQAAAtggAhQggAgguAAQguAAggggg");
	var mask_graphics_33 = new cjs.Graphics().p("EBTDgQGQgqgqAAg9QAAg8AqgrQArgqA8AAQA8AAArAqQArArAAA8QAAA9grAqQgrArg8AAQg8AAgrgrg");
	var mask_graphics_34 = new cjs.Graphics().p("EBSZgPYQg1g1AAhLQAAhLA1g1QA1g1BLAAQBKAAA1A1QA1A1AABLQAABLg1A1Qg1A1hKAAQhLAAg1g1g");
	var mask_graphics_35 = new cjs.Graphics().p("EBRugOqQg/hAAAhZQAAhZA/hAQBAg/BZAAQBZAABAA/QA/BAAABZQAABZg/BAQhAA/hZAAQhZAAhAg/g");
	var mask_graphics_36 = new cjs.Graphics().p("EBREgN9QhKhJAAhoQAAhoBKhKQBJhJBoAAQBoAABKBJQBKBKAABoQAABohKBJQhKBKhoAAQhoAAhJhKg");
	var mask_graphics_37 = new cjs.Graphics().p("EBQZgNPQhUhUAAh2QAAh3BUhUQBUhUB3AAQB2AABUBUQBUBUAAB3QAAB2hUBUQhUBUh2AAQh3AAhUhUg");
	var mask_graphics_38 = new cjs.Graphics().p("EBPvgMhQhehfAAiFQAAiFBeheQBeheCFAAQCFAABfBeQBeBeAACFQAACFheBfQhfBeiFAAQiFAAheheg");
	var mask_graphics_39 = new cjs.Graphics().p("EBPEgL0QhohoAAiUQAAiUBohoQBphpCUAAQCTAABpBpQBoBoAACUQAACUhoBoQhpBpiTAAQiUAAhphpg");
	var mask_graphics_40 = new cjs.Graphics().p("EBOagLGQhzhzAAiiQAAiiBzhzQBzhzCiAAQCiAABzBzQBzBzAACiQAACihzBzQhzBziiAAQiiAAhzhzg");
	var mask_graphics_41 = new cjs.Graphics().p("EBNwgKYQh9h+AAiwQAAixB9h9QB9h9CwAAQCxAAB9B9QB+B9AACxQAACwh+B+Qh9B9ixAAQiwAAh9h9g");
	var mask_graphics_42 = new cjs.Graphics().p("EBNFgJrQiHiHAAjAQAAi/CHiHQCIiIC/AAQC/AACICIQCHCHAAC/QAADAiHCHQiICIi/AAQi/AAiIiIg");
	var mask_graphics_43 = new cjs.Graphics().p("EBMbgI9QiSiSAAjOQAAjOCSiRQCRiSDOAAQDOAACSCSQCSCRAADOQAADOiSCSQiSCSjOAAQjOAAiRiSg");
	var mask_graphics_44 = new cjs.Graphics().p("Al3F4QidibAAjdQAAjbCdicQCbidDcAAQDdAACbCdQCdCcAADbQAADdidCbQibCdjdAAQjcAAibidg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:null,x:0,y:0}).wait(29).to({graphics:mask_graphics_29,x:549.3498,y:-122.1748}).wait(1).to({graphics:mask_graphics_30,x:551.1082,y:-123.6132}).wait(1).to({graphics:mask_graphics_31,x:552.8665,y:-125.0515}).wait(1).to({graphics:mask_graphics_32,x:554.6249,y:-126.4899}).wait(1).to({graphics:mask_graphics_33,x:556.3832,y:-127.9282}).wait(1).to({graphics:mask_graphics_34,x:558.1416,y:-129.3666}).wait(1).to({graphics:mask_graphics_35,x:559.8999,y:-130.8049}).wait(1).to({graphics:mask_graphics_36,x:561.6583,y:-132.2433}).wait(1).to({graphics:mask_graphics_37,x:563.4166,y:-133.6816}).wait(1).to({graphics:mask_graphics_38,x:565.1749,y:-135.1199}).wait(1).to({graphics:mask_graphics_39,x:566.9333,y:-136.5583}).wait(1).to({graphics:mask_graphics_40,x:568.6916,y:-137.9966}).wait(1).to({graphics:mask_graphics_41,x:570.45,y:-139.435}).wait(1).to({graphics:mask_graphics_42,x:572.2083,y:-140.8733}).wait(1).to({graphics:mask_graphics_43,x:573.9667,y:-142.3117}).wait(1).to({graphics:mask_graphics_44,x:1098.2,y:-244.9}).wait(17));

	// mail
	this.instance = new lib.mail("synched",0);
	this.instance.setTransform(1098.2,-244.9);
	this.instance._off = true;

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(29).to({_off:false},0).wait(32));

	// masc_0 (mask)
	var mask_1 = new cjs.Shape();
	mask_1._off = true;
	var mask_1_graphics_0 = new cjs.Graphics().p("AmYCJIAAgJMBf0AAAIAAAJg");
	var mask_1_graphics_1 = new cjs.Graphics().p("AmYCPIAAh2MBf0AAAIAAB2g");
	var mask_1_graphics_2 = new cjs.Graphics().p("AmYCVIAAjiMBf0AAAIAADig");
	var mask_1_graphics_3 = new cjs.Graphics().p("AmYCoIAAlPMBf0AAAIAAFPg");
	var mask_1_graphics_4 = new cjs.Graphics().p("AmYDeIAAm7MBf0AAAIAAG7g");
	var mask_1_graphics_5 = new cjs.Graphics().p("AmYEUIAAonMBf0AAAIAAIng");
	var mask_1_graphics_6 = new cjs.Graphics().p("AmYFLIAAqVMBf0AAAIAAKVg");
	var mask_1_graphics_7 = new cjs.Graphics().p("AmYGBIAAsBMBf0AAAIAAMBg");
	var mask_1_graphics_8 = new cjs.Graphics().p("AmYG3IAAttMBf0AAAIAANtg");
	var mask_1_graphics_9 = new cjs.Graphics().p("AmYHuIAAvbMBf0AAAIAAPbg");
	var mask_1_graphics_10 = new cjs.Graphics().p("AmYIkIAAxHMBf0AAAIAARHg");
	var mask_1_graphics_11 = new cjs.Graphics().p("AmYJaIAAyzMBf0AAAIAASzg");
	var mask_1_graphics_12 = new cjs.Graphics().p("AmYKQIAA0fMBf0AAAIAAUfg");
	var mask_1_graphics_13 = new cjs.Graphics().p("AmYLHIAA2NMBf0AAAIAAWNg");
	var mask_1_graphics_14 = new cjs.Graphics().p("AmYL9IAA35MBf0AAAIAAX5g");
	var mask_1_graphics_15 = new cjs.Graphics().p("AmYMzIAA5lMBf0AAAIAAZlg");
	var mask_1_graphics_16 = new cjs.Graphics().p("AmYNpIAA7RMBf0AAAIAAbRg");
	var mask_1_graphics_17 = new cjs.Graphics().p("AmYOgIAA8/MBf0AAAIAAc/g");
	var mask_1_graphics_18 = new cjs.Graphics().p("AmYPWIAA+rMBf0AAAIAAerg");
	var mask_1_graphics_19 = new cjs.Graphics().p("AmYQMMAAAggXMBf0AAAMAAAAgXg");
	var mask_1_graphics_20 = new cjs.Graphics().p("AmYRDMAAAgiFMBf0AAAMAAAAiFg");
	var mask_1_graphics_21 = new cjs.Graphics().p("AmYR5MAAAgjxMBf0AAAMAAAAjxg");
	var mask_1_graphics_22 = new cjs.Graphics().p("AmYSvMAAAgldMBf0AAAMAAAAldg");
	var mask_1_graphics_23 = new cjs.Graphics().p("AmYTlMAAAgnJMBf0AAAMAAAAnJg");
	var mask_1_graphics_24 = new cjs.Graphics().p("AmYUcMAAAgo3MBf0AAAMAAAAo3g");
	var mask_1_graphics_25 = new cjs.Graphics().p("AmYVSMAAAgqjMBf0AAAMAAAAqjg");
	var mask_1_graphics_26 = new cjs.Graphics().p("AmYWIMAAAgsPMBf0AAAMAAAAsPg");
	var mask_1_graphics_27 = new cjs.Graphics().p("AmYW/MAAAgt9MBf0AAAMAAAAt9g");
	var mask_1_graphics_28 = new cjs.Graphics().p("AmYX1MAAAgvpMBf0AAAMAAAAvpg");
	var mask_1_graphics_29 = new cjs.Graphics().p("AmYYrMAAAgxVMBf0AAAMAAAAxVg");

	this.timeline.addTween(cjs.Tween.get(mask_1).to({graphics:mask_1_graphics_0,x:572.35,y:13.7499}).wait(1).to({graphics:mask_1_graphics_1,x:572.35,y:14.3477}).wait(1).to({graphics:mask_1_graphics_2,x:572.35,y:14.9454}).wait(1).to({graphics:mask_1_graphics_3,x:572.35,y:14.303}).wait(1).to({graphics:mask_1_graphics_4,x:572.35,y:10.0706}).wait(1).to({graphics:mask_1_graphics_5,x:572.35,y:5.8382}).wait(1).to({graphics:mask_1_graphics_6,x:572.35,y:1.6058}).wait(1).to({graphics:mask_1_graphics_7,x:572.35,y:-2.6265}).wait(1).to({graphics:mask_1_graphics_8,x:572.35,y:-6.8589}).wait(1).to({graphics:mask_1_graphics_9,x:572.35,y:-11.0913}).wait(1).to({graphics:mask_1_graphics_10,x:572.35,y:-15.3236}).wait(1).to({graphics:mask_1_graphics_11,x:572.35,y:-19.556}).wait(1).to({graphics:mask_1_graphics_12,x:572.35,y:-23.7884}).wait(1).to({graphics:mask_1_graphics_13,x:572.35,y:-28.0208}).wait(1).to({graphics:mask_1_graphics_14,x:572.35,y:-32.2531}).wait(1).to({graphics:mask_1_graphics_15,x:572.35,y:-36.4855}).wait(1).to({graphics:mask_1_graphics_16,x:572.35,y:-40.7179}).wait(1).to({graphics:mask_1_graphics_17,x:572.35,y:-44.9503}).wait(1).to({graphics:mask_1_graphics_18,x:572.35,y:-49.1826}).wait(1).to({graphics:mask_1_graphics_19,x:572.35,y:-53.415}).wait(1).to({graphics:mask_1_graphics_20,x:572.35,y:-57.6474}).wait(1).to({graphics:mask_1_graphics_21,x:572.35,y:-61.8798}).wait(1).to({graphics:mask_1_graphics_22,x:572.35,y:-66.1121}).wait(1).to({graphics:mask_1_graphics_23,x:572.35,y:-70.3445}).wait(1).to({graphics:mask_1_graphics_24,x:572.35,y:-74.5769}).wait(1).to({graphics:mask_1_graphics_25,x:572.35,y:-78.8092}).wait(1).to({graphics:mask_1_graphics_26,x:572.35,y:-83.0416}).wait(1).to({graphics:mask_1_graphics_27,x:572.35,y:-87.274}).wait(1).to({graphics:mask_1_graphics_28,x:572.35,y:-91.5064}).wait(1).to({graphics:mask_1_graphics_29,x:572.35,y:-127.2747}).wait(32));

	// email
	this.instance_1 = new lib.email("synched",0);
	this.instance_1.setTransform(831.7,-127.9);

	var maskedShapeInstanceList = [this.instance_1];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask_1;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(61));

	// background
	this.instance_2 = new lib.CachedBmp_168();
	this.instance_2.setTransform(-92,-397.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(61));

	// computer
	this.instance_3 = new lib.CachedBmp_170();
	this.instance_3.setTransform(453.2,-370.15,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_182();
	this.instance_4.setTransform(608.15,-300.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4},{t:this.instance_3}]}).wait(61));

	// table
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#9E8161").s().p("EiVXAo3MAAAhRtMEqvAAAMAAABRtg");
	this.shape.setTransform(862.7,245.45);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(61));

	// window
	this.instance_5 = new lib.CachedBmp_171();
	this.instance_5.setTransform(2,-896,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).wait(61));

	// hall
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#DEE5E9").s().p("EiVXAwwMAAAhhfMEqvAAAMAAABhfg");
	this.shape_1.setTransform(862.7,-316.05);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(61));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-93.3,-896,1919.8,1804.9);


(lib.Scene10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// hour
	this.instance = new lib.arrowhour("synched",0);
	this.instance.setTransform(0.4,1.1,1,1,180,0,0,115.3,-0.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:114,regY:0.5,rotation:203.2452,x:-0.85,y:-0.6},9).to({regX:115.2,regY:0,rotation:233.1958,x:-0.15,y:-0.4},10).to({regY:-0.1,rotation:268.6876,x:1.55,y:0.6},10).to({scaleX:0.9999,scaleY:0.9999,rotation:303.6261,x:1.65},10).to({regX:115.1,rotation:331.3336,y:0.65},11).to({regX:115,rotation:359.2716,y:0.7},10).wait(1));

	// min
	this.instance_1 = new lib.arrowmin("synched",0);
	this.instance_1.setTransform(2.95,7.6,1,1,19.9425,0,0,51.8,132.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regX:37.7,regY:126.2,rotation:1819.9425,x:-12.15,y:-2.2},60).wait(1));

	// clock
	this.instance_2 = new lib.CachedBmp_167();
	this.instance_2.setTransform(-319.85,-449.65,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_166();
	this.instance_3.setTransform(-289.15,-37.25,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_165();
	this.instance_4.setTransform(246.6,-37.4,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_164();
	this.instance_5.setTransform(-20.25,227.75,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_163();
	this.instance_6.setTransform(-31.55,-299.25,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_162();
	this.instance_7.setTransform(-381.85,-452.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2}]}).wait(61));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-381.8,-452.1,752.5,868);


(lib.Scene9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// body
	this.instance = new lib.CachedBmp_160();
	this.instance.setTransform(591,248.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(71));

	// head
	this.instance_1 = new lib.head();
	this.instance_1.setTransform(1081.75,365.55,1,1,0,0,0,113.8,77.2);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({rotation:-14.9983,x:1081.95,y:336.6},15).to({regX:113.9,rotation:0,x:1083.95,y:377.6},14).to({rotation:-14.9985,x:1082.05,y:334.55},11).to({rotation:0.4765,x:1084.6,y:366.15},9).to({regY:77.3,rotation:-14.5216,x:1081.7,y:331.25},10).to({regX:114,rotation:0.4765,x:1084.7,y:366.25},11).wait(1));

	// background
	this.instance_2 = new lib.CachedBmp_161();
	this.instance_2.setTransform(-19.2,-303.9,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(71));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-19.2,-303.9,1943.5,1388);


(lib.Scene8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// hour
	this.instance = new lib.arrowhour("synched",0);
	this.instance.setTransform(0.4,1.1,1,1,90,0,0,115.3,-0.9);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:114.1,regY:0.6,rotation:119.9992,x:-0.95,y:-0.7},19).to({regX:115.2,regY:0,rotation:143.1958,x:-0.05,y:-0.4},20).to({regY:-0.1,rotation:178.6876,x:0.6,y:0.7},21).wait(1));

	// min
	this.instance_1 = new lib.arrowmin("synched",0);
	this.instance_1.setTransform(2.95,7.6,1,1,19.9425,0,0,51.8,132.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regX:37.7,regY:126.2,rotation:739.9425,x:-12.15,y:-2.2},60).wait(1));

	// clock
	this.instance_2 = new lib.CachedBmp_159();
	this.instance_2.setTransform(-319.85,-449.65,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_158();
	this.instance_3.setTransform(-289.15,-37.25,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_157();
	this.instance_4.setTransform(246.6,-37.4,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_156();
	this.instance_5.setTransform(-20.25,227.75,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_155();
	this.instance_6.setTransform(-31.55,-299.25,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_154();
	this.instance_7.setTransform(-381.85,-452.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2}]}).wait(61));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-381.8,-452.1,752.5,868);


(lib.Scene7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// mouth
	this.instance = new lib.mouth();
	this.instance.setTransform(888.75,-412.55,0.9189,0.7303,0,58.2055,34.5371,7.8,7.7);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regX:7.7,regY:7.5,scaleX:1.2792,scaleY:1.7331,rotation:44.9996,skewX:0,skewY:0,x:888.7,y:-413.05},36).to({regX:6.9,regY:6.4,scaleX:0.8612,scaleY:0.6954,rotation:0,skewX:60.197,skewY:29.8018,x:887.95,y:-412.85},24).wait(1));

	// hand
	this.instance_1 = new lib.hand_right("synched",0);
	this.instance_1.setTransform(891.3,-284.45);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({rotation:-0.181,x:892.2904,y:-284.4538},0).wait(1).to({rotation:-0.362,x:893.2808,y:-284.4577},0).wait(1).to({rotation:-0.543,x:894.2712,y:-284.4615},0).wait(1).to({rotation:-0.724,x:895.2615,y:-284.4654},0).wait(1).to({rotation:-0.905,x:896.2519,y:-284.4692},0).wait(1).to({rotation:-1.086,x:897.2423,y:-284.4731},0).wait(1).to({rotation:-1.267,x:898.2327,y:-284.4769},0).wait(1).to({rotation:-1.448,x:899.2231,y:-284.4808},0).wait(1).to({rotation:-1.629,x:900.2135,y:-284.4846},0).wait(1).to({rotation:-1.81,x:901.2038,y:-284.4885},0).wait(1).to({rotation:-1.991,x:902.1942,y:-284.4923},0).wait(1).to({rotation:-2.172,x:903.1846,y:-284.4962},0).wait(1).to({rotation:-2.353,x:904.175,y:-284.5},0).wait(1).to({rotation:-2.534,x:905.1654,y:-284.5038},0).wait(1).to({rotation:-2.715,x:906.1558,y:-284.5077},0).wait(1).to({rotation:-2.896,x:907.1462,y:-284.5115},0).wait(1).to({rotation:-3.077,x:908.1365,y:-284.5154},0).wait(1).to({rotation:-3.258,x:909.1269,y:-284.5192},0).wait(1).to({rotation:-3.439,x:910.1173,y:-284.5231},0).wait(1).to({rotation:-3.62,x:911.1077,y:-284.5269},0).wait(1).to({rotation:-3.801,x:912.0981,y:-284.5308},0).wait(1).to({rotation:-3.982,x:913.0885,y:-284.5346},0).wait(1).to({rotation:-4.163,x:914.0788,y:-284.5385},0).wait(1).to({rotation:-4.344,x:915.0692,y:-284.5423},0).wait(1).to({rotation:-4.525,x:916.0596,y:-284.5462},0).wait(1).to({rotation:-4.706,x:917.05,y:-284.55},0).wait(1).to({rotation:-4.4797,x:916.7735},0).wait(1).to({rotation:-4.2534,x:916.4971},0).wait(1).to({rotation:-4.0271,x:916.2206},0).wait(1).to({rotation:-3.8008,x:915.9441},0).wait(1).to({rotation:-3.5745,x:915.6676},0).wait(1).to({rotation:-3.3482,x:915.3912},0).wait(1).to({rotation:-3.1219,x:915.1147},0).wait(1).to({rotation:-2.8956,x:914.8382},0).wait(1).to({rotation:-2.6693,x:914.5618},0).wait(1).to({rotation:-2.443,x:914.2853},0).wait(1).to({rotation:-2.2167,x:914.0088},0).wait(1).to({rotation:-1.9904,x:913.7324},0).wait(1).to({rotation:-1.7641,x:913.4559},0).wait(1).to({rotation:-1.5378,x:913.1794},0).wait(1).to({rotation:-1.3115,x:912.9029},0).wait(1).to({rotation:-1.0852,x:912.6265},0).wait(1).to({rotation:-0.8589,x:912.35},0).wait(1).to({rotation:-0.6327,x:912.0735},0).wait(1).to({rotation:-0.4064,x:911.7971},0).wait(1).to({rotation:-0.1801,x:911.5206},0).wait(1).to({rotation:0.0462,x:911.2441},0).wait(1).to({rotation:0.2725,x:910.9676},0).wait(1).to({rotation:0.4988,x:910.6912},0).wait(1).to({rotation:0.7251,x:910.4147},0).wait(1).to({rotation:0.9514,x:910.1382},0).wait(1).to({rotation:1.1777,x:909.8618},0).wait(1).to({rotation:1.404,x:909.5853},0).wait(1).to({rotation:1.6303,x:909.3088},0).wait(1).to({rotation:1.8566,x:909.0324},0).wait(1).to({rotation:2.0829,x:908.7559},0).wait(1).to({rotation:2.3092,x:908.4794},0).wait(1).to({rotation:2.5355,x:908.2029},0).wait(1).to({rotation:2.7618,x:907.9265},0).wait(1).to({rotation:2.9881,x:907.65},0).wait(1));

	// table
	this.instance_2 = new lib.CachedBmp_150();
	this.instance_2.setTransform(458.55,-571,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_151();
	this.instance_3.setTransform(-140.05,-672.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2}]}).to({state:[{t:this.instance_3}]},60).wait(1));

	// background
	this.instance_4 = new lib.CachedBmp_152();
	this.instance_4.setTransform(-151.3,-980.15,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_153();
	this.instance_5.setTransform(-135.6,-672.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_4}]}).to({state:[{t:this.instance_5}]},60).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-151.3,-980.1,1943.5,1668);


(lib.Scene6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// hour
	this.instance = new lib.arrowhour("synched",0);
	this.instance.setTransform(-2.7,-2.65,1,1,0,0,0,115.3,0);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({regY:-0.1,rotation:33.9493,x:-2.65,y:-2.7},19).to({regX:115.2,regY:0,rotation:56.6385,x:-2.8,y:-2.75},21).to({regY:0.1,rotation:90.1084,x:-2.9,y:-2.7},20).wait(2));

	// min
	this.instance_1 = new lib.arrowmin("synched",0);
	this.instance_1.setTransform(2.95,7.6,1,1,19.9425,0,0,51.8,132.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({regX:37.7,regY:126.2,rotation:739.9425,x:-12.15,y:-2.2},60).wait(2));

	// clock
	this.instance_2 = new lib.CachedBmp_149();
	this.instance_2.setTransform(-319.85,-449.65,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_148();
	this.instance_3.setTransform(-289.15,-37.25,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_147();
	this.instance_4.setTransform(246.6,-37.4,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_146();
	this.instance_5.setTransform(-20.25,227.75,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_145();
	this.instance_6.setTransform(-31.55,-299.25,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_144();
	this.instance_7.setTransform(-381.85,-452.1,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2}]}).wait(62));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-381.8,-452.1,752.5,868);


(lib.Scene5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// hand_right
	this.instance = new lib.hand_right("synched",0);
	this.instance.setTransform(657.05,3.15,1,1,26.6902);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(61));

	// body
	this.instance_1 = new lib.CachedBmp_141();
	this.instance_1.setTransform(499.55,-223,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(61));

	// hand_left
	this.instance_2 = new lib.hand_left("synched",0);
	this.instance_2.setTransform(748.4,-113.05);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({rotation:-14.9983,x:756.2,y:-143.15},27).to({rotation:0,x:740.1,y:-117.1},19).to({regX:0.1,rotation:-14.9985,x:741.3,y:-152.85},14).wait(1));

	// background1
	this.instance_3 = new lib.CachedBmp_142();
	this.instance_3.setTransform(462.9,-405.55,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(61));

	// background2
	this.instance_4 = new lib.CachedBmp_143();
	this.instance_4.setTransform(-156.4,-835.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(61));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-156.4,-835.2,1943.5,1388);


(lib.Scene4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// zoom (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_1 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_2 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_3 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_4 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_5 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_6 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_7 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_8 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_9 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_10 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_11 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_12 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_13 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_14 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_15 = new cjs.Graphics().p("EA+9ACDMiBDAAAIAAAAIAAkFIAAAAMCBDAAAIDKAAIAAEFg");
	var mask_graphics_16 = new cjs.Graphics().p("EA+9ACnMiBDAAAIAAAAIAAlNIAAAAMCBDAAAIDKAAIAAFNg");
	var mask_graphics_17 = new cjs.Graphics().p("EA+9ADLMiBDAAAIAAAAIAAmVIAAAAMCBDAAAIDKAAIAAGVg");
	var mask_graphics_18 = new cjs.Graphics().p("EA+9ADvMiBDAAAIAAAAIAAndIAAAAMCBDAAAIDKAAIAAHdg");
	var mask_graphics_19 = new cjs.Graphics().p("EA+9AETMiBDAAAIAAAAIAAolIAAAAMCBDAAAIDKAAIAAIlg");
	var mask_graphics_20 = new cjs.Graphics().p("EA+9AE3MiBDAAAIAAAAIAAptIAAAAMCBDAAAIDKAAIAAJtg");
	var mask_graphics_21 = new cjs.Graphics().p("EA+9AFbMiBDAAAIAAAAIAAq1IAAAAMCBDAAAIDKAAIAAK1g");
	var mask_graphics_22 = new cjs.Graphics().p("EA+9AF/MiBDAAAIAAAAIAAr9IAAAAMCBDAAAIDKAAIAAL9g");
	var mask_graphics_23 = new cjs.Graphics().p("EA+9AGjMiBDAAAIAAAAIAAtFIAAAAMCBDAAAIDKAAIAANFg");
	var mask_graphics_24 = new cjs.Graphics().p("EA+9AHHMiBDAAAIAAAAIAAuNIAAAAMCBDAAAIDKAAIAAONg");
	var mask_graphics_25 = new cjs.Graphics().p("EA+9AHrMiBDAAAIAAAAIAAvVIAAAAMCBDAAAIDKAAIAAPVg");
	var mask_graphics_26 = new cjs.Graphics().p("EA+9AIQMiBDAAAIAAAAIAAwfIAAAAMCBDAAAIDKAAIAAQfg");
	var mask_graphics_27 = new cjs.Graphics().p("EA+9AI0MiBDAAAIAAAAIAAxnIAAAAMCBDAAAIDKAAIAARng");
	var mask_graphics_28 = new cjs.Graphics().p("EA+9AJYMiBDAAAIAAAAIAAyvIAAAAMCBDAAAIDKAAIAASvg");
	var mask_graphics_29 = new cjs.Graphics().p("EA+9AJ8MiBDAAAIAAAAIAAz3IAAAAMCBDAAAIDKAAIAAT3g");
	var mask_graphics_30 = new cjs.Graphics().p("EA+9AKgMiBDAAAIAAAAIAA0/IAAAAMCBDAAAIDKAAIAAU/g");
	var mask_graphics_31 = new cjs.Graphics().p("EA+9ALEMiBDAAAIAAAAIAA2HIAAAAMCBDAAAIDKAAIAAWHg");
	var mask_graphics_32 = new cjs.Graphics().p("EA+9ALoMiBDAAAIAAAAIAA3PIAAAAMCBDAAAIDKAAIAAXPg");
	var mask_graphics_33 = new cjs.Graphics().p("EA+9AMMMiBDAAAIAAAAIAA4XIAAAAMCBDAAAIDKAAIAAYXg");
	var mask_graphics_34 = new cjs.Graphics().p("EA+9AMwMiBDAAAIAAAAIAA5fIAAAAMCBDAAAIDKAAIAAZfg");
	var mask_graphics_35 = new cjs.Graphics().p("EA+9ANUMiBDAAAIAAAAIAA6nIAAAAMCBDAAAIDKAAIAAang");
	var mask_graphics_36 = new cjs.Graphics().p("EA+9AN4MiBDAAAIAAAAIAA7vIAAAAMCBDAAAIDKAAIAAbvg");
	var mask_graphics_37 = new cjs.Graphics().p("EA+9AOcMiBDAAAIAAAAIAA83IAAAAMCBDAAAIDKAAIAAc3g");
	var mask_graphics_38 = new cjs.Graphics().p("EA+9APAMiBDAAAIAAAAIAA9/IAAAAMCBDAAAIDKAAIAAd/g");
	var mask_graphics_39 = new cjs.Graphics().p("EA+9APkMiBDAAAIAAAAIAA/HIAAAAMCBDAAAIDKAAIAAfHg");
	var mask_graphics_40 = new cjs.Graphics().p("EA+9AQIMiBDAAAIAAAAMAAAggPIAAAAMCBDAAAIDKAAMAAAAgPg");
	var mask_graphics_41 = new cjs.Graphics().p("EA+9AQsMiBDAAAIAAAAMAAAghXIAAAAMCBDAAAIDKAAMAAAAhXg");
	var mask_graphics_42 = new cjs.Graphics().p("EA+9ARQMiBDAAAIAAAAMAAAgifIAAAAMCBDAAAIDKAAMAAAAifg");
	var mask_graphics_43 = new cjs.Graphics().p("EA+9AR0MiBDAAAIAAAAMAAAgjnIAAAAMCBDAAAIDKAAMAAAAjng");
	var mask_graphics_44 = new cjs.Graphics().p("EA+9ASYMiBDAAAIAAAAMAAAgkvIAAAAMCBDAAAIDKAAMAAAAkvg");
	var mask_graphics_45 = new cjs.Graphics().p("EA+9AS8MiBDAAAIAAAAMAAAgl3IAAAAMCBDAAAIDKAAMAAAAl3g");
	var mask_graphics_46 = new cjs.Graphics().p("EA+9ATgMiBDAAAIAAAAMAAAgm/IAAAAMCBDAAAIDKAAMAAAAm/g");
	var mask_graphics_47 = new cjs.Graphics().p("EA+9AUEMiBDAAAIAAAAMAAAgoHIAAAAMCBDAAAIDKAAMAAAAoHg");
	var mask_graphics_48 = new cjs.Graphics().p("EA+9AUoMiBDAAAIAAAAMAAAgpPIAAAAMCBDAAAIDKAAMAAAApPg");
	var mask_graphics_49 = new cjs.Graphics().p("EA+9AVMMiBDAAAIAAAAMAAAgqXIAAAAMCBDAAAIDKAAMAAAAqXg");
	var mask_graphics_50 = new cjs.Graphics().p("EA+9AVwMiBDAAAIAAAAMAAAgrfIAAAAMCBDAAAIDKAAMAAAArfg");
	var mask_graphics_51 = new cjs.Graphics().p("EA+9AWUMiBDAAAIAAAAMAAAgsnIAAAAMCBDAAAIDKAAMAAAAsng");
	var mask_graphics_52 = new cjs.Graphics().p("EA+9AW4MiBDAAAIAAAAMAAAgtvIAAAAMCBDAAAIDKAAMAAAAtvg");
	var mask_graphics_53 = new cjs.Graphics().p("EA+9AXcMiBDAAAIAAAAMAAAgu3IAAAAMCBDAAAIDKAAMAAAAu3g");
	var mask_graphics_54 = new cjs.Graphics().p("EA+9AYAMiBDAAAIAAAAMAAAgv/IAAAAMCBDAAAIDKAAMAAAAv/g");
	var mask_graphics_55 = new cjs.Graphics().p("EA+9AYkMiBDAAAIAAAAMAAAgxHIAAAAMCBDAAAIDKAAMAAAAxHg");
	var mask_graphics_56 = new cjs.Graphics().p("EA+9AZIMiBDAAAIAAAAMAAAgyPIAAAAMCBDAAAIDKAAMAAAAyPg");
	var mask_graphics_57 = new cjs.Graphics().p("EA+9AZsMiBDAAAIAAAAMAAAgzXIAAAAMCBDAAAIDKAAMAAAAzXg");
	var mask_graphics_58 = new cjs.Graphics().p("EA+9AaQMiBDAAAIAAAAMAAAg0fIAAAAMCBDAAAIDKAAMAAAA0fg");
	var mask_graphics_59 = new cjs.Graphics().p("EA+9Aa0MiBDAAAIAAAAMAAAg1nIAAAAMCBDAAAIDKAAMAAAA1ng");
	var mask_graphics_60 = new cjs.Graphics().p("EA+9AbYMiBDAAAIAAAAMAAAg2vIAAAAMCBDAAAIDKAAMAAAA2vg");
	var mask_graphics_61 = new cjs.Graphics().p("EA+9Ab8MiBDAAAIAAAAMAAAg33IAAAAMCBDAAAIDKAAMAAAA33g");
	var mask_graphics_62 = new cjs.Graphics().p("EA+9AcgMiBDAAAIAAAAMAAAg4/IAAAAMCBDAAAIDKAAMAAAA4/g");
	var mask_graphics_63 = new cjs.Graphics().p("EA+9AdEMiBDAAAIAAAAMAAAg6HIAAAAMCBDAAAIDKAAMAAAA6Hg");
	var mask_graphics_64 = new cjs.Graphics().p("EA+9AdoMiBDAAAIAAAAMAAAg7PIAAAAMCBDAAAIDKAAMAAAA7Pg");
	var mask_graphics_65 = new cjs.Graphics().p("EA+9AeMMiBDAAAIAAAAMAAAg8XIAAAAMCBDAAAIDKAAMAAAA8Xg");
	var mask_graphics_66 = new cjs.Graphics().p("EA+9AewMiBDAAAIAAAAMAAAg9fIAAAAMCBDAAAIDKAAMAAAA9fg");
	var mask_graphics_67 = new cjs.Graphics().p("EA+9AfVMiBDAAAIAAAAMAAAg+pIAAAAMCBDAAAIDKAAMAAAA+pg");
	var mask_graphics_68 = new cjs.Graphics().p("EA+9Af5MiBDAAAIAAAAMAAAg/xIAAAAMCBDAAAIDKAAMAAAA/xg");
	var mask_graphics_69 = new cjs.Graphics().p("EA+9AgdMiBDAAAIAAAAMAAAhA5IAAAAMCBDAAAIDKAAMAAABA5g");
	var mask_graphics_70 = new cjs.Graphics().p("EA+9AhBMiBDAAAIAAAAMAAAhCBIAAAAMCBDAAAIDKAAMAAABCBg");
	var mask_graphics_71 = new cjs.Graphics().p("EA+9AhlMiBDAAAIAAAAMAAAhDJIAAAAMCBDAAAIDKAAMAAABDJg");
	var mask_graphics_72 = new cjs.Graphics().p("EA+9AiJMiBDAAAIAAAAMAAAhERIAAAAMCBDAAAIDKAAMAAABERg");
	var mask_graphics_73 = new cjs.Graphics().p("EA+9AitMiBDAAAIAAAAMAAAhFZIAAAAMCBDAAAIDKAAMAAABFZg");
	var mask_graphics_74 = new cjs.Graphics().p("EA+9AjRMiBDAAAIAAAAMAAAhGhIAAAAMCBDAAAIDKAAMAAABGhg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_1,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_2,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_3,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_4,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_5,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_6,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_7,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_8,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_9,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_10,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_11,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_12,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_13,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_14,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_15,x:945.6948,y:207.05}).wait(1).to({graphics:mask_graphics_16,x:945.6948,y:210.672}).wait(1).to({graphics:mask_graphics_17,x:945.6948,y:214.2945}).wait(1).to({graphics:mask_graphics_18,x:945.6948,y:217.9165}).wait(1).to({graphics:mask_graphics_19,x:945.6948,y:221.5391}).wait(1).to({graphics:mask_graphics_20,x:945.6948,y:225.1615}).wait(1).to({graphics:mask_graphics_21,x:945.6948,y:228.7836}).wait(1).to({graphics:mask_graphics_22,x:945.6948,y:232.4061}).wait(1).to({graphics:mask_graphics_23,x:945.6948,y:236.0281}).wait(1).to({graphics:mask_graphics_24,x:945.6948,y:239.6507}).wait(1).to({graphics:mask_graphics_25,x:945.6948,y:243.2727}).wait(1).to({graphics:mask_graphics_26,x:945.6948,y:246.8947}).wait(1).to({graphics:mask_graphics_27,x:945.6948,y:250.5173}).wait(1).to({graphics:mask_graphics_28,x:945.6948,y:254.1393}).wait(1).to({graphics:mask_graphics_29,x:945.6948,y:257.7618}).wait(1).to({graphics:mask_graphics_30,x:945.6948,y:261.3839}).wait(1).to({graphics:mask_graphics_31,x:945.6948,y:265.0064}).wait(1).to({graphics:mask_graphics_32,x:945.6948,y:268.6289}).wait(1).to({graphics:mask_graphics_33,x:945.6948,y:272.2509}).wait(1).to({graphics:mask_graphics_34,x:945.6948,y:275.8734}).wait(1).to({graphics:mask_graphics_35,x:945.6948,y:279.4955}).wait(1).to({graphics:mask_graphics_36,x:945.6948,y:283.1175}).wait(1).to({graphics:mask_graphics_37,x:945.6948,y:286.74}).wait(1).to({graphics:mask_graphics_38,x:945.6948,y:290.3621}).wait(1).to({graphics:mask_graphics_39,x:945.6948,y:293.9846}).wait(1).to({graphics:mask_graphics_40,x:945.6948,y:297.6066}).wait(1).to({graphics:mask_graphics_41,x:945.6948,y:301.2291}).wait(1).to({graphics:mask_graphics_42,x:945.6948,y:304.8512}).wait(1).to({graphics:mask_graphics_43,x:945.6948,y:308.4737}).wait(1).to({graphics:mask_graphics_44,x:945.6948,y:312.0962}).wait(1).to({graphics:mask_graphics_45,x:945.6948,y:315.7182}).wait(1).to({graphics:mask_graphics_46,x:945.6948,y:319.3407}).wait(1).to({graphics:mask_graphics_47,x:945.6948,y:322.9628}).wait(1).to({graphics:mask_graphics_48,x:945.6948,y:326.5848}).wait(1).to({graphics:mask_graphics_49,x:945.6948,y:330.2073}).wait(1).to({graphics:mask_graphics_50,x:945.6948,y:333.8294}).wait(1).to({graphics:mask_graphics_51,x:945.6948,y:337.4518}).wait(1).to({graphics:mask_graphics_52,x:945.6948,y:341.0739}).wait(1).to({graphics:mask_graphics_53,x:945.6948,y:344.696}).wait(1).to({graphics:mask_graphics_54,x:945.6948,y:348.3189}).wait(1).to({graphics:mask_graphics_55,x:945.6948,y:351.9409}).wait(1).to({graphics:mask_graphics_56,x:945.6948,y:355.5634}).wait(1).to({graphics:mask_graphics_57,x:945.6948,y:359.1855}).wait(1).to({graphics:mask_graphics_58,x:945.6948,y:362.8075}).wait(1).to({graphics:mask_graphics_59,x:945.6948,y:366.4301}).wait(1).to({graphics:mask_graphics_60,x:945.6948,y:370.0521}).wait(1).to({graphics:mask_graphics_61,x:945.6948,y:373.6746}).wait(1).to({graphics:mask_graphics_62,x:945.6948,y:377.2966}).wait(1).to({graphics:mask_graphics_63,x:945.6948,y:380.9187}).wait(1).to({graphics:mask_graphics_64,x:945.6948,y:384.5412}).wait(1).to({graphics:mask_graphics_65,x:945.6948,y:388.1633}).wait(1).to({graphics:mask_graphics_66,x:945.6948,y:391.7862}).wait(1).to({graphics:mask_graphics_67,x:945.6948,y:395.4082}).wait(1).to({graphics:mask_graphics_68,x:945.6948,y:399.0303}).wait(1).to({graphics:mask_graphics_69,x:945.6948,y:402.6528}).wait(1).to({graphics:mask_graphics_70,x:945.6948,y:406.2748}).wait(1).to({graphics:mask_graphics_71,x:945.6948,y:409.8974}).wait(1).to({graphics:mask_graphics_72,x:945.6948,y:413.5194}).wait(1).to({graphics:mask_graphics_73,x:945.6948,y:417.1419}).wait(1).to({graphics:mask_graphics_74,x:945.6948,y:419.9499}).wait(17));

	// screen
	this.instance = new lib.zoom1("synched",0);
	this.instance.setTransform(925.1,442.35,1.3723,1.3723,0,0,0,202.4,129.9);

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(91));

	// right
	this.instance_1 = new lib.hand();
	this.instance_1.setTransform(1409.45,1015.1,1,1,0,0,0,354.4,281.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(1).to({regX:354.5,x:1425.8,y:1008.7},0).wait(1).to({x:1442.05,y:1002.3},0).wait(1).to({x:1458.35,y:995.9},0).wait(1).to({x:1474.6,y:989.5},0).wait(1).to({x:1490.9,y:983.1},0).wait(1).to({x:1507.15,y:976.7},0).wait(1).to({x:1523.4,y:970.3},0).wait(1).to({x:1539.7,y:963.9},0).wait(1).to({x:1555.95,y:957.5},0).wait(1).to({x:1572.25,y:951.1},0).wait(1).to({x:1588.5,y:944.7},0).wait(1).to({x:1604.75,y:938.3},0).wait(1).to({x:1621.05,y:931.9},0).wait(1).to({x:1637.3,y:925.5},0).wait(1).to({x:1653.6,y:919.1},0).wait(1).to({x:1641.4,y:923.05},0).wait(1).to({x:1629.2,y:927},0).wait(1).to({x:1617,y:930.95},0).wait(1).to({x:1604.8,y:934.9},0).wait(1).to({x:1592.6,y:938.85},0).wait(1).to({x:1580.4,y:942.8},0).wait(1).to({x:1568.25,y:946.75},0).wait(1).to({x:1556.05,y:950.7},0).wait(1).to({x:1543.85,y:954.65},0).wait(1).to({x:1531.65,y:958.6},0).wait(1).to({x:1519.45,y:962.6},0).wait(1).to({x:1507.25,y:966.55},0).wait(1).to({x:1495.05,y:970.5},0).wait(1).to({x:1482.9,y:974.45},0).wait(1).to({x:1470.7,y:978.4},0).wait(1).to({x:1458.5,y:982.35},0).wait(1).to({x:1446.3,y:986.3},0).wait(1).to({x:1434.1,y:990.25},0).wait(1).to({x:1421.9,y:994.2},0).wait(1).to({x:1409.7,y:998.15},0).wait(1).to({x:1397.55,y:1002.15},0).wait(55));

	// left
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#EAC4B5").s().p("EgoKAaFQIhmpIkmyQRHtiAMgsQAIgcBkjLQBrjZB2jfQFEprA0AAICgAAQAmhBAthBQBaiCAlAAQA8AACqAeQAwg3BCgxQCFhhBdAfQBeAfCABYQA/ArAtAmIDWgaQDfgXArATQAgANDLAIQC9AHAQAWQBABVgjA+QhFB9mkAmQjkAVikBoQiHBWhOCDQg/BsgHBiQgGBcApAAQBPAABWgpQBcgsArhBQBdiMBghLQCmiECHBhQBLA1hZDNQhQC3i1D2QivDui3CzQjDDAhwAhQhSAYiYAkQieAmg8ARQjjBAgfBRQgfBRosJHQkXEjkRETg");
	this.shape.setTransform(649.0573,900.1261);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(91));

	// computer
	this.instance_2 = new lib.CachedBmp_139();
	this.instance_2.setTransform(408.85,171,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_182();
	this.instance_3.setTransform(701.45,275.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_3},{t:this.instance_2}]}).wait(91));

	// table
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#9E8161").s().p("EiVXAo3MAAAhRtMEqvAAAMAAABRtg");
	this.shape_1.setTransform(956,821.6);

	this.timeline.addTween(cjs.Tween.get(this.shape_1).wait(91));

	// window
	this.instance_4 = new lib.CachedBmp_140();
	this.instance_4.setTransform(95.35,-319.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(91));

	// hall
	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#DEE5E9").s().p("EiVXAwwMAAAhhfMEqvAAAMAAABhfg");
	this.shape_2.setTransform(956,260.1);

	this.timeline.addTween(cjs.Tween.get(this.shape_2).wait(91));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-319.7,2008.1,1616.7);


(lib.Scene2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// minute
	this.instance = new lib.arrowmin("synched",0);
	this.instance.setTransform(-54.35,-122.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({startPosition:0},10).to({startPosition:0},5).to({rotation:20.4962,x:0.65,y:-122},11).to({regX:0.1,rotation:30.2748,x:41.6,y:-120.4},8).to({rotation:0.2754,x:-58.4},8).to({regX:0.2,regY:0.1,scaleX:0.9999,scaleY:0.9999,rotation:45.2547,x:80.75,y:-102.15},8).to({rotation:6.7905,x:-42.2,y:-127.1},7).to({scaleX:0.9998,scaleY:0.9998,rotation:36.7902,x:60.85,y:-125.8},6).to({regX:0.3,rotation:7.1851,x:-37.85,y:-122.45},5).to({regX:0.4,regY:0.2,rotation:33.1274,x:37,y:-118.65},6).to({regX:0.5,rotation:18.1283,x:1.1,y:-120.65},3).wait(3));

	// hour
	this.instance_1 = new lib.arrowhour("synched",0);
	this.instance_1.setTransform(-114.5,14.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({startPosition:0},10).to({regX:0.1,regY:0.1,rotation:2.1941,x:-114.35,y:10.4},16).to({regX:0,regY:0,rotation:14.9983,x:-114.5,y:-14.4},8).to({regX:0.1,regY:0.1,rotation:-14.999,x:-115,y:48.35},8).to({regX:0.2,scaleX:0.9999,scaleY:0.9999,rotation:29.9987,x:-73.7,y:-32.9},8).to({regX:0.3,rotation:-9.787,x:-111.65,y:38.05},7).to({rotation:20.2118,x:-95.25,y:-16.95},6).to({regX:0.4,regY:0.2,scaleX:0.9998,scaleY:0.9998,rotation:-9.7883,x:-106.15,y:36.15},5).to({rotation:10.6574,y:-5.9},6).to({regY:0.3,rotation:0.6908,x:-116.15,y:14.2},3).wait(3));

	// right_a
	this.instance_2 = new lib.alarmr("synched",0);
	this.instance_2.setTransform(269.25,-359.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({startPosition:0},10).to({startPosition:0},16).to({x:317.7,y:-393.5},8).to({x:291.7,y:-351.5},8).to({x:317.7,y:-381.45},8).to({x:293.7,y:-339.35},7).to({x:335,y:-384.9},6).to({x:303,y:-339.35},5).to({x:344.95,y:-377.35},6).to({x:317.7,y:-343.9},3).wait(3));

	// left_a
	this.instance_3 = new lib.alarml("synched",0);
	this.instance_3.setTransform(-278.85,-355.75);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({startPosition:0},10).to({startPosition:0},16).to({x:-306.8,y:-397.2},8).to({x:-282.75,y:-355.2},8).to({x:-319.55,y:-385.15},8).to({x:-282.75,y:-351.2},7).to({x:-337.55,y:-381.15},6).to({x:-297.6,y:-335.6},5).to({x:-335.6,y:-373.6},6).to({x:-297.65,y:-347.6},3).wait(3));

	// alarm
	this.instance_4 = new lib.clock("synched",0);
	this.instance_4.setTransform(-0.95,57.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({startPosition:0},10).to({startPosition:0},16).to({rotation:14.9983},9).to({regY:0.1,rotation:-19.461,y:57.85},7).to({rotation:25.5378},8).to({rotation:-12.6631,x:-1},7).to({scaleX:0.9999,scaleY:0.9999,rotation:17.3361,x:-0.9},6).to({rotation:-12.662},5).to({regX:0.1,regY:0.2,rotation:12.2744,x:-0.75,y:57.9},6).to({regX:0,regY:0.3,rotation:0.0682,x:-0.85,y:58},3).wait(3));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-510.7,-499.4,1028.9,1080.9);


(lib.Scene1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// sheeps4
	this.instance = new lib.sheep01("synched",0);
	this.instance.setTransform(-960.85,469.7,0.9999,0.9999,0,0,0,135.3,104.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({rotation:-14.9984,x:-695,y:219.6},119).wait(3));

	// sheeps3
	this.instance_1 = new lib.sheep03("synched",0);
	this.instance_1.setTransform(404.45,-527.75);

	this.sheep = new lib.sheep03("synched",0);
	this.sheep.name = "sheep";
	this.sheep.setTransform(432.85,-485.9);
	this.sheep._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).to({_off:true,x:432.85,y:-485.9},24).wait(98));
	this.timeline.addTween(cjs.Tween.get(this.sheep).to({_off:false},24).to({x:545.3,y:-320.15},95).wait(3));

	// sheeps2
	this.instance_2 = new lib.sheep01("synched",0);
	this.instance_2.setTransform(-690.1,-127.95,1,1,0,0,0,135.3,104);

	this.instance_3 = new lib.sheep02("synched",0);
	this.instance_3.setTransform(-510,-351.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_2}]}).to({state:[{t:this.instance_3}]},119).wait(3));
	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({_off:true,regX:0,regY:0,x:-510,y:-351.4},119).wait(3));

	// sheeps
	this.instance_4 = new lib.sheep04("synched",0);
	this.instance_4.setTransform(768.4,-125.8);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).to({x:688.4,y:283.4},119).wait(3));

	// drool
	this.instance_5 = new lib.drool("synched",0);
	this.instance_5.setTransform(54.55,-166.7,0.1111,0.113,0,0,0,5,-0.9);

	this.timeline.addTween(cjs.Tween.get(this.instance_5).to({regX:4.4,regY:0.1,scaleX:1.7778,scaleY:1.7774,x:54.2,y:-166.95},74).wait(48));

	// eyes
	this.instance_6 = new lib.eyes_sleep("synched",0);
	this.instance_6.setTransform(30.25,-239.3,1,1,0,0,0,54.1,6);

	this.timeline.addTween(cjs.Tween.get(this.instance_6).wait(122));

	// mouth
	this.instance_7 = new lib.mouth_sleep("synched",0);
	this.instance_7.setTransform(32.8,-170.65,1,1,0,0,0,22.5,4.7);

	this.timeline.addTween(cjs.Tween.get(this.instance_7).wait(122));

	// boysleep
	this.instance_8 = new lib.CachedBmp_135();
	this.instance_8.setTransform(-959.85,-539.65,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_8).wait(122));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1096.1,-629.3,2056.3,1202.9);


(lib.eyes = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.eye("synched",0);
	this.instance.setTransform(60.55,10.5);

	this.instance_1 = new lib.eye("synched",0);
	this.instance_1.setTransform(6,10.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.eyes, new cjs.Rectangle(0,0,66.6,21), null);


(lib.aclock = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.aclock_g("synched",0);
	this.instance.setTransform(51.45,53.95);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({rotation:3.7497},0).wait(1).to({rotation:7.4995},0).wait(1).to({rotation:11.2492},0).wait(1).to({rotation:14.9989},0).wait(1).to({rotation:4.9991},0).wait(1).to({rotation:-5.0007},0).wait(1).to({rotation:-15.0005},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({rotation:0},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-7.7,-10.2,118.3,128.5);


(lib.Scene3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// aclock
	this.instance = new lib.aclock();
	this.instance.setTransform(321.9,-107.75,1,1,0,0,0,51.5,54);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(121));

	// hall
	this.instance_1 = new lib.CachedBmp_136();
	this.instance_1.setTransform(-143.65,-483.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(121));

	// mouth
	this.instance_2 = new lib.mouth1();
	this.instance_2.setTransform(731.9,-351.2,1,1,0,0,0,15,2);

	this.timeline.addTween(cjs.Tween.get(this.instance_2).to({scaleX:0.7,scaleY:7,x:731.95},59).to({regX:15.1,scaleX:1,scaleY:1.0237,x:732,y:-350.7},56).wait(6));

	// eyel
	this.instance_3 = new lib.eyes();
	this.instance_3.setTransform(730.1,-411.95,1,1,0,0,0,33.2,10.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_3).to({regY:11.5,scaleY:0.0612,y:-411.9},47).to({regY:12.1,scaleY:1.1327,y:-409.35},68).wait(6));

	// background
	this.instance_4 = new lib.CachedBmp_137();
	this.instance_4.setTransform(-291.15,-596,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(121));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-291.1,-596,1948,1106);


// stage content:
(lib.Zoom = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {Sound_sleep:0,click:0};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,134,335,537,786,881,949,1133];
	this.streamSoundSymbolsList[0] = [{id:"kolyibelnaya990",startFrame:0,endFrame:165,loop:1,offset:0}];
	this.streamSoundSymbolsList[134] = [{id:"chasyisbudilnikombudilnikzvenit24158",startFrame:134,endFrame:323,loop:1,offset:0}];
	this.streamSoundSymbolsList[335] = [{id:"_12811",startFrame:335,endFrame:792,loop:1,offset:0}];
	this.streamSoundSymbolsList[537] = [{id:"af1a9fcd867d7c1",startFrame:537,endFrame:1134,loop:1,offset:0}];
	this.streamSoundSymbolsList[786] = [{id:"_20f8957bdf43e09",startFrame:786,endFrame:1134,loop:1,offset:0}];
	this.streamSoundSymbolsList[881] = [{id:"_00171",startFrame:881,endFrame:1134,loop:1,offset:0}];
	this.streamSoundSymbolsList[949] = [{id:"c90fa750648bdca",startFrame:949,endFrame:1134,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var soundInstance = playSound("kolyibelnaya990",0);
		this.InsertIntoSoundStreamData(soundInstance,0,165,1);
		var self = this;
		self.stop();
		
		this.playMovie.addEventListener("click", fuctionplayMovie);
		
		function fuctionplayMovie()
		{
			self.gotoAndPlay(2);
		}
	}
	this.frame_134 = function() {
		var soundInstance = playSound("chasyisbudilnikombudilnikzvenit24158",0);
		this.InsertIntoSoundStreamData(soundInstance,134,323,1);
	}
	this.frame_335 = function() {
		var soundInstance = playSound("_12811",0);
		this.InsertIntoSoundStreamData(soundInstance,335,792,1);
	}
	this.frame_537 = function() {
		var soundInstance = playSound("af1a9fcd867d7c1",0);
		this.InsertIntoSoundStreamData(soundInstance,537,1134,1);
	}
	this.frame_786 = function() {
		var soundInstance = playSound("_20f8957bdf43e09",0);
		this.InsertIntoSoundStreamData(soundInstance,786,1134,1);
	}
	this.frame_881 = function() {
		var soundInstance = playSound("_00171",0);
		this.InsertIntoSoundStreamData(soundInstance,881,1134,1);
	}
	this.frame_949 = function() {
		var soundInstance = playSound("c90fa750648bdca",0);
		this.InsertIntoSoundStreamData(soundInstance,949,1134,1);
	}
	this.frame_1133 = function() {
		var self = this;
		self.stop();
		
		this.again.addEventListener("click", fuctionplayMovie);
		
		function fuctionplayMovie()
		{
			self.gotoAndPlay(1);
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(134).call(this.frame_134).wait(201).call(this.frame_335).wait(202).call(this.frame_537).wait(249).call(this.frame_786).wait(95).call(this.frame_881).wait(68).call(this.frame_949).wait(184).call(this.frame_1133).wait(1));

	// Zooms
	this.playMovie = new lib.start();
	this.playMovie.name = "playMovie";
	this.playMovie.setTransform(628.25,568.1,0.5954,0.5954,0,0,0,414.3,150.2);
	new cjs.ButtonHelper(this.playMovie, 0, 1, 2, false, new lib.start(), 3);

	this.instance_9 = new lib.Scene1();
	this.instance_9.setTransform(560.75,402.9,0.677,0.7273,0,0,0,-102.2,66.2);

	this.instance_10 = new lib.Scene2();
	this.instance_10.setTransform(636.25,380,0.6463,0.6463,0,0,0,-4.7,-3.5);

	this.instance_11 = new lib.Scene3();
	this.instance_11.setTransform(640.05,360.4,0.6646,0.6691,0,0,0,671,-40.1);

	this.instance_12 = new lib.Scene4();
	this.instance_12.setTransform(639.95,434.1,0.6694,0.6694,0,0,0,956,648.5);

	this.instance_13 = new lib.Scene5();
	this.instance_13.setTransform(646.15,369.6,0.6578,0.6509,0,0,0,825.5,14.5);

	this.instance_14 = new lib.Scene6();
	this.instance_14.setTransform(624.15,344.05,0.6312,0.6312,0,0,0,-5.7,-18.2);

	this.instance_15 = new lib.Scene7();
	this.instance_15.setTransform(642.4,364.3,0.657,0.657,0,0,0,821.6,-133.4);

	this.instance_16 = new lib.Scene8();
	this.instance_16.setTransform(660.1,340.05,0.6035,0.6035,0,0,0,-5.7,-18.2);

	this.instance_17 = new lib.Scene9();
	this.instance_17.setTransform(651.95,363.4,0.6655,0.6544,0,0,0,961.6,538.5);

	this.instance_18 = new lib.Scene10();
	this.instance_18.setTransform(656.25,356.1,0.7142,0.7142,0,0,0,-5.7,-18.2);

	this.instance_19 = new lib.Scene11();
	this.instance_19.setTransform(641.85,488.45,0.683,0.683,0,0,0,867.5,170.3);

	this.instance_20 = new lib.Scene111();
	this.instance_20.setTransform(46.2,373.15,0.6603,0.6603,0,0,0,0.2,0.1);

	this.instance_21 = new lib.Scene12();
	this.instance_21.setTransform(640.8,511.75,0.6929,0.6929,0,0,0,875.5,558.5);

	this.instance_22 = new lib.Scene13();
	this.instance_22.setTransform(633.85,351.95,0.6628,0.6628,0,0,0,960.4,539.2);

	this.instance_23 = new lib.Scene14();
	this.instance_23.setTransform(642.65,492.6,0.6782,0.6671,0,0,0,867.5,170.3);

	this.again = new lib.startagain();
	this.again.name = "again";
	this.again.setTransform(676.35,621.5,0.4496,0.4496,0,0,0,414.2,150.1);
	new cjs.ButtonHelper(this.again, 0, 1, 2, false, new lib.startagain(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.playMovie}]}).to({state:[{t:this.instance_9}]},1).to({state:[{t:this.instance_10}]},121).to({state:[{t:this.instance_11}]},80).to({state:[{t:this.instance_12}]},121).to({state:[{t:this.instance_13}]},91).to({state:[{t:this.instance_14}]},61).to({state:[{t:this.instance_15}]},62).to({state:[{t:this.instance_16}]},61).to({state:[{t:this.instance_17}]},61).to({state:[{t:this.instance_18}]},72).to({state:[{t:this.instance_19}]},61).to({state:[{t:this.instance_20}]},61).to({state:[{t:this.instance_21}]},41).to({state:[{t:this.instance_22}]},60).to({state:[{t:this.instance_23}]},92).to({state:[{t:this.again}]},87).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(527.9,120.2,777.5000000000001,915);
// library properties:
lib.properties = {
	id: '34446012EF9641C9B9F73E44F2D92028',
	width: 1280,
	height: 720,
	fps: 30,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_184.png", id:"CachedBmp_184"},
		{src:"images/CachedBmp_183.png", id:"CachedBmp_183"},
		{src:"images/CachedBmp_179.png", id:"CachedBmp_179"},
		{src:"images/CachedBmp_178.png", id:"CachedBmp_178"},
		{src:"images/CachedBmp_177.png", id:"CachedBmp_177"},
		{src:"images/CachedBmp_176.png", id:"CachedBmp_176"},
		{src:"images/CachedBmp_175.png", id:"CachedBmp_175"},
		{src:"images/CachedBmp_173.png", id:"CachedBmp_173"},
		{src:"images/CachedBmp_171.png", id:"CachedBmp_171"},
		{src:"images/CachedBmp_170.png", id:"CachedBmp_170"},
		{src:"images/CachedBmp_168.png", id:"CachedBmp_168"},
		{src:"images/CachedBmp_161.png", id:"CachedBmp_161"},
		{src:"images/CachedBmp_153.png", id:"CachedBmp_153"},
		{src:"images/CachedBmp_152.png", id:"CachedBmp_152"},
		{src:"images/CachedBmp_151.png", id:"CachedBmp_151"},
		{src:"images/CachedBmp_143.png", id:"CachedBmp_143"},
		{src:"images/CachedBmp_140.png", id:"CachedBmp_140"},
		{src:"images/CachedBmp_139.png", id:"CachedBmp_139"},
		{src:"images/CachedBmp_137.png", id:"CachedBmp_137"},
		{src:"images/CachedBmp_136.png", id:"CachedBmp_136"},
		{src:"images/CachedBmp_135.png", id:"CachedBmp_135"},
		{src:"images/CachedBmp_134.png", id:"CachedBmp_134"},
		{src:"images/CachedBmp_198.png", id:"CachedBmp_198"},
		{src:"images/CachedBmp_197.png", id:"CachedBmp_197"},
		{src:"images/CachedBmp_196.png", id:"CachedBmp_196"},
		{src:"images/CachedBmp_124.png", id:"CachedBmp_124"},
		{src:"images/Zoom_atlas_1.png", id:"Zoom_atlas_1"},
		{src:"images/Zoom_atlas_2.png", id:"Zoom_atlas_2"},
		{src:"images/Zoom_atlas_3.png", id:"Zoom_atlas_3"},
		{src:"images/Zoom_atlas_4.png", id:"Zoom_atlas_4"},
		{src:"images/Zoom_atlas_5.png", id:"Zoom_atlas_5"},
		{src:"images/Zoom_atlas_6.png", id:"Zoom_atlas_6"},
		{src:"images/Zoom_atlas_7.png", id:"Zoom_atlas_7"},
		{src:"images/Zoom_atlas_8.png", id:"Zoom_atlas_8"},
		{src:"images/Zoom_atlas_9.png", id:"Zoom_atlas_9"},
		{src:"images/Zoom_atlas_10.png", id:"Zoom_atlas_10"},
		{src:"images/Zoom_atlas_11.png", id:"Zoom_atlas_11"},
		{src:"images/Zoom_atlas_12.png", id:"Zoom_atlas_12"},
		{src:"images/Zoom_atlas_13.png", id:"Zoom_atlas_13"},
		{src:"sounds/_00171.mp3", id:"_00171"},
		{src:"sounds/_12811.mp3", id:"_12811"},
		{src:"sounds/_20f8957bdf43e09.mp3", id:"_20f8957bdf43e09"},
		{src:"sounds/af1a9fcd867d7c1.mp3", id:"af1a9fcd867d7c1"},
		{src:"sounds/c90fa750648bdca.mp3", id:"c90fa750648bdca"},
		{src:"sounds/chasyisbudilnikombudilnikzvenit24158.mp3", id:"chasyisbudilnikombudilnikzvenit24158"},
		{src:"sounds/kolyibelnaya990.mp3", id:"kolyibelnaya990"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['34446012EF9641C9B9F73E44F2D92028'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;