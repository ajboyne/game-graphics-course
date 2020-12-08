// *********************************************************************************************************************
// **                                                                                                                 **
// **             Texturing example, Cube is mapped with 2D texture, skybox is mapped with a Cubemap                  **
// **                                                                                                                 **
// *********************************************************************************************************************

// * Change textures
// * Combine several textures in fragment shaders
// * Distort UV coordinates
// * Change texture filtering for pixel graphics
// * Use wrapping modes for texture tiling


let positions = new Float32Array([
    // front
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5,

    // back
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,

    //top
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, -0.5,
    -0.5, 0.5, -0.5,

    //bottom
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5,

    //left
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5,
    -0.5, -0.5, -0.5,

    //right
    0.5, -0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,
]);

let normals = new Float32Array([
    // front
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,

    // back
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, -1.0,

    //top
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    //bottom
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, -1.0, 0.0,

    //left
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,

    //right
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
]);

let uvs = new Float32Array([
    // front
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,

    // back
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,

    //top
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,

    //bottom
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,

    //left
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,

    //right
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
]);

let triangles = new Uint16Array([
    // front
    2, 1, 0,
    0, 3, 2,

    // back
    4, 5, 6,
    6, 7, 4,

    // top
    8, 9, 10,
    10, 11, 8,

    // bottom
    14, 13, 12,
    12, 15, 14,

    // left
    16, 17, 18,
    18, 19, 16,

    // right
    22, 21, 20,
    20, 23, 22,
]);
/////////////////////////////
let mirrorPositions = new Float32Array([
    -2, 0, 2,
     2, 0, 2,
    -2, 0, -2,
     2, 0, -2,
]);

let mirrorUvs = new Float32Array([
    0, 1,
    1, 1,
    0, 0,
    1, 0,
]);

let mirrorTriangles = new Uint16Array([
    0, 1, 2,
    2, 1, 3
]);
//////////////////////////////////////////
let skyboxPositions = new Float32Array([
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0
]);

let skyboxTriangles = new Uint16Array([
    0, 2, 1,
    2, 3, 1
]);








// language=GLSL
let fragmentShader = `
    #version 300 es
    precision highp float;
    //////////////////////
   // uniform samplerCube cubemap;
    //////////////////////
    uniform sampler2D tex;    
    
    in vec2 v_uv;
    /////////////////////////
    in vec3 vNormal;
    in vec3 viewDir;
    ///////////////////////////
    
    out vec4 outColor;
    
    void main()
    {        
        outColor = texture(tex, v_uv);
        ////////////////////////////////
        vec3 reflectedDir = reflect(viewDir, normalize(vNormal));
        outColor = texture(cubemap, reflectedDir);
        //////////////////////////////////////////
    }
`;

// language=GLSL
let vertexShader = `
    #version 300 es
            
    uniform mat4 modelViewProjectionMatrix;
   ////////////////////////////////////////////// 
    uniform mat4 modelMatrix;
    uniform mat3 normalMatrix;
    uniform vec3 cameraPosition; 
    ////////////////////////////////////////
   
    layout(location=0) in vec3 position;
    layout(location=1) in vec3 normal;
    layout(location=2) in vec2 uv;
        
    out vec2 v_uv;
    /////////////////////////////////////////
    out vec3 vNormal;
    out vec3 viewDir;
    ////////////////////////////////////////
    
    void main()
    {
        gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);           
        v_uv = uv;
        //////////////////////////////////////////////////////////////////////////
       // gl_Position = modelViewProjectionMatrix * position;           
        //vUv = uv;
        //viewDir = (modelMatrix * position).xyz - cameraPosition;                
        //vNormal = normalMatrix * normal;
        ////////////////////////////////////////////////////////////////
    }
`;
////////////////////////////////
let mirrorFragmentShader = `
    #version 300 es
    precision highp float;
    
    uniform sampler2D reflectionTex;
    uniform sampler2D distortionMap;
    uniform vec2 screenSize;
    
    in vec2 vUv;        
        
    out vec4 outColor;
    
    void main()
    {                        
        vec2 screenPos = gl_FragCoord.xy / screenSize;
        
               
        screenPos.x += (texture(distortionMap, vUv).r - 0.5) * 0.03;
        outColor = texture(reflectionTex, screenPos);
    }
`;

////////////////////////////////////////////////


////////////////////////////////////////////
// language=GLSL
let mirrorVertexShader = `
    #version 300 es
            
    uniform mat4 modelViewProjectionMatrix;
    
    layout(location=0) in vec4 position;   
    layout(location=1) in vec2 uv;
    
    out vec2 vUv;
        
    void main()
    {
        vUv = uv;
        gl_Position = modelViewProjectionMatrix * position;           
    }
`;
///////////////////////////////////////////////////////////

// language=GLSL
let skyboxFragmentShader = `
    #version 300 es
    precision mediump float;
    
    uniform samplerCube cubemap;
    uniform mat4 viewProjectionInverse;
    in vec4 v_position;
    
    out vec4 outColor;
    
    void main() {
      vec4 t = viewProjectionInverse * v_position;
      outColor = texture(cubemap, normalize(t.xyz / t.w));
    }
`;

// language=GLSL
let skyboxVertexShader = `
    #version 300 es
    
    layout(location=0) in vec4 position;
    out vec4 v_position;
    
    void main() {
      v_position = position;
      gl_Position = position;
    }
`;

app.cullBackfaces();

let program = app.createProgram(vertexShader.trim(), fragmentShader.trim());
let skyboxProgram = app.createProgram(skyboxVertexShader.trim(), skyboxFragmentShader.trim());
//
let mirrorProgram = app.createProgram(mirrorVertexShader.trim(), mirrorFragmentShader.trim());
//
let vertexArray = app.createVertexArray()
    .vertexAttributeBuffer(0, app.createVertexBuffer(PicoGL.FLOAT, 3, positions))
    .vertexAttributeBuffer(1, app.createVertexBuffer(PicoGL.FLOAT, 3, normals))
    .vertexAttributeBuffer(2, app.createVertexBuffer(PicoGL.FLOAT, 2, uvs))
    .indexBuffer(app.createIndexBuffer(PicoGL.UNSIGNED_SHORT, 3, triangles));

let skyboxArray = app.createVertexArray()
    .vertexAttributeBuffer(0, app.createVertexBuffer(PicoGL.FLOAT, 3, skyboxPositions))
    .indexBuffer(app.createIndexBuffer(PicoGL.UNSIGNED_SHORT, 3, skyboxTriangles));
//
let mirrorArray = app.createVertexArray()
    .vertexAttributeBuffer(0, app.createVertexBuffer(PicoGL.FLOAT, 3, mirrorPositions))
    .vertexAttributeBuffer(1, app.createVertexBuffer(PicoGL.FLOAT, 2, mirrorUvs))
    .indexBuffer(app.createIndexBuffer(PicoGL.UNSIGNED_SHORT, 3, mirrorTriangles));
let reflectionResolutionFactor = 0.3;
let reflectionColorTarget = app.createTexture2D(app.width * reflectionResolutionFactor, app.height * reflectionResolutionFactor, {magFilter: PicoGL.LINEAR});
let reflectionDepthTarget = app.createTexture2D(app.width * reflectionResolutionFactor, app.height * reflectionResolutionFactor, {format: PicoGL.DEPTH_COMPONENT});
let reflectionBuffer = app.createFramebuffer().colorTarget(0, reflectionColorTarget).depthTarget(reflectionDepthTarget);
//

let projMatrix = mat4.create();
let viewMatrix = mat4.create();
let viewProjMatrix = mat4.create();
let modelMatrix = mat4.create();
let modelViewMatrix = mat4.create();
let modelViewProjectionMatrix = mat4.create();
let rotateXMatrix = mat4.create();
let rotateYMatrix = mat4.create();
let skyboxViewProjectionInverse = mat4.create();
//
let mirrorModelMatrix = mat4.create();
let mirrorModelViewProjectionMatrix = mat4.create();
//let skyboxViewProjectionInverse = mat4.create();
let cameraPosition = vec3.create();
//


//loadImages(["images/texture.jpg", "images/cubemap.jpg"], function (images) {
loadImages(["images/noise.png", "images/cubemap.jpg", "images/texture.jpg"], function (images) {
    //////////////////////////////////////////////////////////
    let cubemap = app.createCubemap({cross: images[2]});
    //let drawCall = app.createDrawCall(program, vertexArray)
     //   .texture("images/texture.jpg", cubemap)
    /////////////////////////////////////////////////////////////
    let drawCall = app.createDrawCall(program, vertexArray)
        //.texture("tex", app.createTexture2D(images[2], images[2].width, images[2].height, {flipY: true, magFilter: PicoGL.NEAREST, wrapT: PicoGL.REPEAT}));
            .texture("texture", cubemap)
    let skyboxDrawCall = app.createDrawCall(skyboxProgram, skyboxArray)
        .texture("cubemap", app.createCubemap({cross: images[1]}));
    let mirrorDrawCall = app.createDrawCall(mirrorProgram, mirrorArray)
        .texture("reflectionTex", reflectionColorTarget)
        .texture("distortionMap", app.createTexture2D(images[1]));

    let startTime = new Date().getTime() / 1000;

    ///
    function renderReflectionTexture()
    {
        app.drawFramebuffer(reflectionBuffer);
        app.viewport(0, 0, reflectionColorTarget.width, reflectionColorTarget.height);

        app.gl.cullFace(app.gl.FRONT);

        let reflectionMatrix = mat4.calculateSurfaceReflectionMatrix(mat4.create(), mirrorModelMatrix, vec3.up);
        let reflectionViewMatrix = mat4.mul(mat4.create(), viewMatrix, reflectionMatrix);
        let reflectionCameraPosition = vec3.transformMat4(vec3.create(), cameraPosition, reflectionMatrix);
        drawObjects(reflectionCameraPosition, reflectionViewMatrix);

        app.gl.cullFace(app.gl.BACK);
        app.defaultDrawFramebuffer();
        app.defaultViewport();
    }
    /////
    ////
    function drawObjects(cameraPosition, viewMatrix) {
        mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);
 
        mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
        mat4.multiply(modelViewProjectionMatrix, viewProjMatrix, modelMatrix);
        
 
 
        mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
        mat4.multiply(modelViewProjectionMatrix, viewProjMatrix, modelMatrix);
 
 
        let skyboxView = mat4.clone(viewMatrix);
        mat4.setTranslation(skyboxView, vec3.fromValues(0, 0, 0));
        let skyboxViewProjectionMatrix = mat4.create();
        mat4.mul(skyboxViewProjectionMatrix, projMatrix, skyboxView);
        mat4.invert(skyboxViewProjectionInverse, skyboxViewProjectionMatrix);
 
        app.clear();
 
        app.noDepthTest().drawBackfaces();
        skyboxDrawCall.uniform("viewProjectionInverse", skyboxViewProjectionInverse);
        skyboxDrawCall.draw();
 
        app.depthTest().cullBackfaces();
        drawCall.uniform("modelViewProjectionMatrix", modelViewProjectionMatrix);
        drawCall.uniform("cameraPosition", cameraPosition);
        drawCall.uniform("modelMatrix", modelMatrix);
        drawCall.uniform("normalMatrix", mat3.normalFromMat4(mat3.create(), modelMatrix));
        drawCall.draw();
     }
 
     function drawMirror() {
         mat4.multiply(mirrorModelViewProjectionMatrix, viewProjMatrix, mirrorModelMatrix);
         mirrorDrawCall.uniform("modelViewProjectionMatrix", mirrorModelViewProjectionMatrix);
         mirrorDrawCall.uniform("screenSize", vec2.fromValues(app.width, app.height))
         mirrorDrawCall.draw();
     }
 
    /////

    function draw() {
        let time = new Date().getTime() / 1000 - startTime;

        mat4.perspective(projMatrix, Math.PI / 2, app.width / app.height, 0.1, 100.0);
        let camPos = vec3.rotateY(vec3.create(), vec3.fromValues(0, -1, 2), vec3.fromValues(0, 0, 0), time * 0.05);
        ///
        //vec3.rotateY(cameraPosition, vec3.fromValues(0, 2, 4), vec3.zero, time * 0.05);
        ///
        mat4.lookAt(viewMatrix, camPos, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
        mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);

        mat4.fromXRotation(rotateXMatrix, time * 0.1136 - Math.PI / 2);
        mat4.fromZRotation(rotateYMatrix, time * 0.2235);
        mat4.multiply(modelMatrix, rotateXMatrix, rotateYMatrix);
        ///
        mat4.mul(mirrorModelMatrix, rotateYMatrix, rotateXMatrix);
        mat4.setTranslation(mirrorModelMatrix, vec3.fromValues(0, -1, 0));
        ///

        mat4.multiply(modelViewMatrix, viewMatrix, modelMatrix);
        mat4.multiply(modelViewProjectionMatrix, viewProjMatrix, modelMatrix);

        let skyboxView = mat4.clone(viewMatrix);
        mat4.setTranslation(skyboxView, vec3.fromValues(0, 0, 0));
        let skyboxViewProjectionMatrix = mat4.create();
        mat4.mul(skyboxViewProjectionMatrix, projMatrix, skyboxView);
        mat4.invert(skyboxViewProjectionInverse, skyboxViewProjectionMatrix);

        app.clear();

        app.noDepthTest();
        skyboxDrawCall.uniform("viewProjectionInverse", skyboxViewProjectionInverse);
        skyboxDrawCall.draw();
        
        renderReflectionTexture();
        drawObjects(cameraPosition, viewMatrix);
        drawMirror();

        app.depthTest();
        drawCall.uniform("modelViewProjectionMatrix", modelViewProjectionMatrix);
        drawCall.draw();



        requestAnimationFrame(draw);
        
    }

    requestAnimationFrame(draw);
});