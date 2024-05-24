import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

const ThreeDModel = () => {
  const containerRef = useRef(null);
  const [model, setModel] = useState(null);
  const [showPanel, setShowPanel] = useState(true);
  const [modelProps, setModelProps] = useState({
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scaleX: 100,
    scaleY: 100,
    scaleZ: 100,
  });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    containerRef.current.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    loader.load(
      '/models/airplane1/scene.gltf',
      (gltf) => {
        const airplane = gltf.scene;
        airplane.scale.set(100, 100, 100);
        airplane.position.set(0, 0, 0);
        scene.add(airplane);

        const box = new THREE.Box3().setFromObject(airplane);
        const boxSize = box.getSize(new THREE.Vector3());
        const boxCenter = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
        const distance = maxDim * 2.5;

        camera.position.set(boxCenter.x, boxCenter.y, boxCenter.z + distance);
        camera.lookAt(boxCenter);

        setModel(airplane);

        // Set the OrbitControls' target to the center of the model
        controls.target.copy(boxCenter);
        controls.update();
      },
      (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
      (error) => console.error('An error happened', error)
    );

    // Additional lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1);
    pointLight1.position.set(500, 500, 500);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1);
    pointLight2.position.set(-500, 500, -500);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 1);
    pointLight3.position.set(0, -500, 500);
    scene.add(pointLight3);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 5000;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      if (model) {
        const { position, rotation, scale } = model;
        setModelProps({
          positionX: position.x,
          positionY: position.y,
          positionZ: position.z,
          rotationX: THREE.MathUtils.radToDeg(rotation.x),
          rotationY: THREE.MathUtils.radToDeg(rotation.y),
          rotationZ: THREE.MathUtils.radToDeg(rotation.z),
          scaleX: scale.x,
          scaleY: scale.y,
          scaleZ: scale.z,
        });
      }
      renderer.render(scene, camera);
    };

    animate();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (model) {
      model.position.set(modelProps.positionX, modelProps.positionY, modelProps.positionZ);
      model.rotation.set(THREE.MathUtils.degToRad(modelProps.rotationX), THREE.MathUtils.degToRad(modelProps.rotationY), THREE.MathUtils.degToRad(modelProps.rotationZ));
      model.scale.set(modelProps.scaleX, modelProps.scaleY, modelProps.scaleZ);
    }
  }, [modelProps, model]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModelProps({ ...modelProps, [name]: parseFloat(value) });
  };

  const handleZoomIn = () => {
    setModelProps((prevProps) => ({
      ...prevProps,
      scaleX: prevProps.scaleX * 1.1,
      scaleY: prevProps.scaleY * 1.1,
      scaleZ: prevProps.scaleZ * 1.1,
    }));
  };

  const handleZoomOut = () => {
    setModelProps((prevProps) => ({
      ...prevProps,
      scaleX: prevProps.scaleX / 1.1,
      scaleY: prevProps.scaleY / 1.1,
      scaleZ: prevProps.scaleZ / 1.1,
    }));
  };

  return (
    <div style={{ display: 'flex' }}>
      <div id="container3D" ref={containerRef} style={{ width: '80%', height: '100vh' }} />
      {showPanel && (
        <div style={{ width: '20%', padding: '10px', background: '#f0f0f0', zIndex: 1000, position: 'relative' }}>
          <h2>Model Controls</h2>
          {['positionX', 'positionY', 'positionZ', 'rotationX', 'rotationY', 'rotationZ', 'scaleX', 'scaleY', 'scaleZ'].map(prop => (
            <div key={prop} style={{ marginBottom: '10px' }}>
              <label>
                {prop.charAt(0).toUpperCase() + prop.slice(1).replace(/[A-Z]/g, ' $&')}:
                <input
                  type="number"
                  name={prop}
                  value={modelProps[prop]}
                  onChange={handleInputChange}
                  style={{ marginLeft: '10px', width: '60%' }}
                />
              </label>
            </div>
          ))}
          <button onClick={handleZoomIn} style={{ margin: '5px', padding: '10px' }}>Zoom In</button>
          <button onClick={handleZoomOut} style={{ margin: '5px', padding: '10px' }}>Zoom Out</button>
        </div>
      )}
      <button
        onClick={() => setShowPanel(!showPanel)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1001,
          padding: '10px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        {showPanel ? 'Hide Panel' : 'Show Panel'}
      </button>
    </div>
  );
};

export default ThreeDModel;
