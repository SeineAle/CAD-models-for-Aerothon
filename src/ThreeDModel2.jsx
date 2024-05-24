import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

const ThreeDModel = () => {
  const containerRef = useRef(null);
  const [model, setModel] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
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
    renderer.setSize(window.innerWidth, window.innerHeight/2);

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

        controls.target.copy(boxCenter);
        controls.update();
      },
      (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
      (error) => console.error('An error happened', error)
    );

    const ambientLight = new THREE.AmbientLight(0x404040, 1);
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
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', position: 'relative', flexDirection: 'column' }}>
      <div id="container3D" ref={containerRef} style={{ width: '100%', height: '100vh' }} />
      <div style={{ ...styles.panel, right: showPanel ? '20px' : '-300px' }}>
        <h2 style={styles.heading}>Model Controls</h2>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Location X:</label>
          <input type="number" name="positionX" value={modelProps.positionX} onChange={handleInputChange} style={styles.input} />
        </div>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Location Y:</label>
          <input type="number" name="positionY" value={modelProps.positionY} onChange={handleInputChange} style={styles.input} />
        </div>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Location Z:</label>
          <input type="number" name="positionZ" value={modelProps.positionZ} onChange={handleInputChange} style={styles.input} />
        </div>
        <div style={{ ...styles.controlGroup, marginTop: '20px' }}>
          <label style={styles.label}>Rotation X:</label>
          <input type="number" name="rotationX" value={modelProps.rotationX} onChange={handleInputChange} style={styles.input} />
        </div>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Rotation Y:</label>
          <input type="number" name="rotationY" value={modelProps.rotationY} onChange={handleInputChange} style={styles.input} />
        </div>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Rotation Z:</label>
          <input type="number" name="rotationZ" value={modelProps.rotationZ} onChange={handleInputChange} style={styles.input} />
        </div>
        <div style={{ ...styles.controlGroup, marginTop: '20px' }}>
          <label style={styles.label}>Scale X:</label>
          <input type="number" name="scaleX" value={modelProps.scaleX} onChange={handleInputChange} style={styles.input} />
        </div>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Scale Y:</label>
          <input type="number" name="scaleY" value={modelProps.scaleY} onChange={handleInputChange} style={styles.input} />
        </div>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Scale Z:</label>
          <input type="number" name="scaleZ" value={modelProps.scaleZ} onChange={handleInputChange} style={styles.input} />
        </div>
        <div style={{ ...styles.zoomControl, marginTop: '20px' }}>
          <button onClick={handleZoomIn} style={{ ...styles.zoomButton, ...styles.button31 }}>
            +
          </button>
          <span style={styles.zoomLabel}>ZOOM</span>
          <button onClick={handleZoomOut} style={{ ...styles.zoomButton, ...styles.button31 }}>
            -
          </button>
        </div>
      </div>
      <div style={{display : 'flex', flexDirection : 'row', justifyContent : 'right'}}>
        <button 
            onClick={() => setShowPanel(!showPanel)}
            style={{ ...styles.toggleButton, ...styles.button31 }}
        >
            {showPanel ? 'Hide Panel' : 'Show Panel'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  panel: {
    width: '280px',
    padding: '10px',
    background: '#2c2c2c',
    color: '#fff',
    position: 'fixed',
    top: '20px',
    maxHeight: 'calc(100vh - 40px)',
    overflowY: 'auto',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
    borderRadius: '10px',
    transition: 'right 0.3s ease-in-out',
  },
  heading: {
    margin: '10px 0',
    fontSize: '18px',
    textAlign: 'center',
  },
  controlGroup: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    flex: '1',
    fontSize: '14px',
  },
  input: {
    flex: '1',
    marginLeft: '10px',
    padding: '5px',
    fontSize: '14px',
    background: '#333',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '3px',
  },
  zoomControl: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
  },
  zoomLabel: {
    margin: '0 10px',
    fontSize: '14px',
  },
  zoomButton: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: '#707070',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    lineHeight: '30px',
  },
  toggleButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '100px',
    height: '40px',
    background: '#707070',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    zIndex: 1001,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button31: {
    backgroundColor: '#222',
    borderRadius: '4px',
    borderStyle: 'none',
    boxSizing: 'border-box',
    color: '#fff',
    cursor: 'pointer',
    display: 'inline-block',
    fontFamily: '"Farfetch Basis","Helvetica Neue",Arial,sans-serif',
    fontSize: '16px',
    fontWeight: '700',
    lineHeight: '1.5',
    margin: '0',
    maxWidth: '150px',
    minHeight: '44px',
    minWidth: '10px',
    outline: 'none',
    overflow: 'hidden',
    padding: '9px 20px 8px',
    position: 'relative',
    textAlign: 'center',
    textTransform: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    touchAction: 'manipulation',
    width: '100%',
    transition: 'opacity 0.3s ease',
  },
  button31HoverFocus: {
    opacity: '0.75',
  },
};

export default ThreeDModel;
