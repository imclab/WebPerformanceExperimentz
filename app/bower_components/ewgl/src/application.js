(function(global) {
  var info = {};
  var app = function(args) {
      var camera, renderer, rootNode;
      renderer = global.renderer;
      
      
      this.renderer = global.renderer;
      this.materialList = global.materialList;
      this.input = global.inputManager;
      this.lights = global.lights;
      
      rootNode = new global.node({
        "name": "rootNode"
      });
      this.rootNode = rootNode;
      
      camera = new global.cameraNode({
        "name": "mainCamera",
        "parent": this.rootNode
      });
      renderer.camera = camera;
      
      this.mainLight = new global.ambientLight({
        "name": "mainLight",
        "color": vec3.create([0.5, 0.5, 0.5]),
        "parent": this.rootNode
      });
      
      this.stats = new global.stats();
      
      this.assetManager = global.loaderCollection;
      
      if (args && args.canvas){
        var canvas = document.getElementById(args.canvas.id);
        canvas.width = args.canvas.width;
        canvas.height = args.canvas.height;
        this.renderer.canvas = canvas;
      } else {
        this.renderer.canvas = createcanvas();
      }
      
  };
  
  Object.defineProperties(app.prototype, {
    "camera": {
      "get": function() {
        return this.renderer.camera;
      },
      "set": function(cam) {
        this.renderer.camera = cam;
      }
    }
  });
  
  

  app.prototype.startRendering = function() {
    var applicationtest = this;
    timestart = +(new Date());
    var render = function() {
        requestAnimationFrame(render);
        applicationtest.stats.update(info);
        applicationtest.update(info);
        applicationtest.input.update(info);
        applicationtest.rootNode.update(info);
        applicationtest.materialList.render(info);
        };
    render();
  };

  app.prototype.renderOnce = function() {
    this.stats.update(info);
    this.update(info);
    this.input.update(info);
    this.rootNode.update(info);
    this.materialList.render(info);
  };

  app.prototype.update = function(info) {};

  var createcanvas;
  createcanvas = function() {
    var canvas;
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    return canvas;
  };

  global.app = app;
}(EWGL));