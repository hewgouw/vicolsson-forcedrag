# vicolsson-forcedrag
A small library to get angle and force of a drag

[Demo](https://htmlpreview.github.io/?https://github.com/vicolsson/vicolsson-forcedrag/blob/master/example/index.html)


### Usage
```javascript
forcedrag({
	selector: "canvas",
	inverted: false,
	
	down: function (e) {
		console.log(e.coords); // { x: 0, y: 0 }
	},
	move: function (e) {
		console.log(e.angle); // 180
		console.log(e.coords); // { x: 0, y: 5 }
		console.log(e.coordsFirstEvent); // { x: 0, y: 0 }
		console.log(e.force); // 0.25
	},
	up: function (e) {
		console.log(e.angle); // 180
		console.log(e.coords); // { x: 0, y: 10 }
		console.log(e.coordsFirstEvent); // { x: 0, y: 0 }
		console.log(e.force); // 0.5
		
	}
});
```
