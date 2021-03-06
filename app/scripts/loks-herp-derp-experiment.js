/*================================================
LOK's herp derp touch driven 3d js animation experiment
~Native WebkitCSSMatrix jsObject~
~ Custom 3D animation @o@ ~

Inspired from 9element's matrix3d tutorial ft. sylvester matrix lib
Copyright (c) 2014 wonglok
Licensed under the MIT license.
=================================================*/
'use strict';
(function() {

	/*=====================================
	System State
	=====================================*/


	/*=====================================
	Dom related Variables
	=====================================*/

	var dom = window.document.querySelectorAll('.target')[0],
		matrixResetTemplate = new window['WebKitCSSMatrix'](),
		domWebKit3dMatrix = new window['WebKitCSSMatrix'](),
		digest = {
			eventBased: null,
			intervalBased: null
		},
		effectStateTemplate = {
			r: {
				x: 0,
				y: 0,
				z: 0
			},
			t: {
				x: 0,
				y: 0,
				z: 0
			},
			s: {
				x: 1,
				y: 1,
				z: 1
			}
		},
		effectStateReset = function(eState){
			eState.r.x = 0;
			eState.r.y = 0;
			eState.r.z = 0;

			eState.t.x = 0;
			eState.t.y = 0;
			eState.t.z = 0;

			eState.s.x = 1;
			eState.s.y = 1;
			eState.s.z = 1;

			return eState;
		},
		effectStateFactory = function(){
			return {
				r: {
					x: 0,
					y: 0,
					z: 0
				},
				t: {
					x: 0,
					y: 0,
					z: 0
				},
				s: {
					x: 1,
					y: 1,
					z: 1
				}
			};
		},
		effectStateDeltaFactory = function(){
			return effectStateReset(effectStateTemplate);
		},
		effectState = effectStateFactory();


	/*=====================================
	Update the effect state upon interval or events (touchmove)
	=====================================*/
	function deltaEventHandelr(event) {
		event.preventDefault();
		var delta = effectStateDeltaFactory();

		delta.r.x =	-0.5;
		delta.r.y =	-0.5;
		// delta.r.z =	-1.6;

		// delta.t.x =	-0.2;
		// delta.t.y =	-0.2;
		// delta.t.z =	-0.2;

		delta.s.x =	1-0.0007;
		delta.s.y =	1-0.0007;
		delta.s.z =	1-0.0007;

		//applyDelta
		digest.eventBased = delta;

	}

	function deltaInternalHandler() {
		var delta = effectStateDeltaFactory();

		delta.r.x =	0.1;
		delta.r.y =	0.1;
		// delta.r.z =	-0.035;

		// delta.t.x =	-0.3;
		// delta.t.y =	-0.3;
		// delta.t.z =	-0.3;

		// delta.s.x =	1+0.0006;
		// delta.s.y =	1+0.0006;
		// delta.s.z =	1+0.0000;

		//applyDelta
		digest.intervalBased = delta;
	}

	function applyDelta(delta){
		console.log(!!!delta);
		if (!!!delta){
			return;
		}

		//apply the delta
		effectState.r.x +=	delta.r.x;
		effectState.r.y +=	delta.r.y;
		effectState.r.z +=	delta.r.z;

		effectState.t.x +=	delta.t.x;
		effectState.t.y +=	delta.t.y;
		effectState.t.z +=	delta.t.z;

		effectState.s.x *=	delta.s.x;
		effectState.s.y *=	delta.s.y;
		effectState.s.z *=	delta.s.z;

	}

	/*=====================================
	Generate WebKitCSSMatrix String
	=====================================*/
	//enforced version
	function getMatrix3dCSSManually(m) {
		//tries to limit the floating point
		// _.each(m,function(val,key){
		//  m[key] = m[key].toFixed(20);
		// });
		return 'matrix3d(' +
			m.m11+ ',' + m.m12+ ',' + m.m13+ ',' + m.m14+ ',' +
			m.m21+ ',' + m.m22+ ',' + m.m23+ ',' + m.m24+ ',' +
			m.m31+ ',' + m.m32+ ',' + m.m33+ ',' + m.m34+ ',' +
			m.m41+ ',' + m.m42+ ',' + m.m43+ ',' + m.m44+
		')';
	}

	//native version
	function getMatrix3dCSSNatively(webkitMatrix) {
		//sometimes it returns 2dmatrix
		//does not enable layer promotion;
		//eg. rotateZ does not enable this

		//for translateX,Y, it would give the integer value instead of floating point value.
		//bad 'stair step' animation experience.
		return webkitMatrix.toString();
	}
	var getMatrix3dCSS = getMatrix3dCSSManually;



	/*  ============================================================
	Update the Matrix different status
	============================================================  */
	function updateMatrix() {

		var r = effectState.r,
			t = effectState.t,
			s = effectState.s
		;

		//reset the transformation matrix
		domWebKit3dMatrix = matrixResetTemplate;
		domWebKit3dMatrix = domWebKit3dMatrix
								.rotate(
									r.x,
									r.y,
									r.z
								)
								.translate(
									t.x,
									t.y,
									t.z
								)
								.scale(
									s.x,
									s.y,
									s.z
								);
	}

	/*  ============================================================
	Apply the css string to the dom
	============================================================  */
	function updateDom() {
		var result = getMatrix3dCSS(domWebKit3dMatrix);
		if (result !== dom.style['-webkit-transform']){
			dom.style['-webkit-transform'] = result;
		}
	}




	/*=====================================
	Event Emitterrrz
	=====================================*/
	function setupEventEmitter(){

		setInterval(deltaInternalHandler, 16);

		//for production, both need to coded with an adapter.
		// window.addEventListener('touchmove', deltaEventHandelr, false);
		// window.addEventListener('mousemove', deltaEventHandelr, false);
	}



	/*=====================================
	Delta Digest
	=====================================*/
	function digestDelta(){

		applyDelta(digest.eventBased);
		// applyDelta(digest.intervalBased);

	}

	/*  ============================================================
	render
	============================================================  */

	function render() {


		digestDelta();
		updateMatrix();
		updateDom();

		window.requestAnimationFrame(render);
	}


	/*=====================================
	Engine
	=====================================*/
	function init() {
		setupEventEmitter();
		render();
	}

	window.addEventListener('DOMContentLoaded', function() {
		window.requestAnimationFrame(init);
	}, false);






}());
























