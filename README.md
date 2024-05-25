# Aircraft Damage Analysis with 3D GLTF Models

This React application visualizes 3D GLTF models created using blender, by rendering them using Three.js and WebGL to analyze and understand the structural damages of an aircraft. The app allows users to interact with the 3D model, modify its properties, and adjust the camera view.

## Table of Contents

- [Getting Started](#getting-started)
- [Dependencies](#dependencies)
- [Code Overview](#code-overview)
  - [ThreeDModel Component](#threedmodel-component)
  - [Model Controls](#model-controls)
- [Usage](#usage)
- [License](#license)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js and npm installed on your local machine.

### Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/aircraft-damage-analysis.git
cd aircraft-damage-analysis
```

2. Install the dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm start
```

The application will run on `http://localhost:3000`.

## Dependencies

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Three.js](https://threejs.org/) - A JavaScript 3D library that makes WebGL simpler.
- [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls) - Enables orbiting around objects.
- [GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader) - Loads GLTF 3D models.

## Code Overview

### ThreeDModel Component

The `ThreeDModel` component is responsible for setting up the Three.js scene, loading the GLTF model, and rendering the 3D visualization. Key features include:

- **Scene Setup**: Initializes the scene, camera, and renderer.
- **GLTF Model Loading**: Loads the GLTF model and adds it to the scene. It sets the initial position, rotation, and scale of the model.
- **Lighting**: Adds ambient and point lights to the scene for better visualization.
- **Orbit Controls**: Enables camera control for rotating, zooming, and panning around the model.
- **Animation Loop**: Continuously renders the scene and updates the model's properties based on user input.
- **Responsive Design**: Adjusts the renderer size and camera aspect ratio on window resize.

### Model Controls

A control panel allows users to interact with the model:

- **Position**: Adjust the X, Y, and Z coordinates.
- **Rotation**: Modify the rotation angles around the X, Y, and Z axes.
- **Scale**: Scale the model along the X, Y, and Z axes.
- **Zoom**: Buttons to zoom in and out by scaling the model.
- **Show/Hide Panel**: Toggle the visibility of the control panel.

## Usage

To use this project, follow the instructions in the [Getting Started](#getting-started) section. Ensure your GLTF models are placed in the `public/models` directory. You can change the model definition in the loader to render different models.

### Example Directory Structure

```
public/
├── models/
│   ├── airplane1/
│   │   └── scene.gltf
│   ├── airplane2/
│   │   └── scene.gltf
│   └── airplane3/
│       └── scene.gltf
```

### Changing the Loaded Model

In the `ThreeDModel` component, update the loader path to the desired model:

```javascript
loader.load(
  '/models/airplane2/scene.gltf', // Change this path to load a different model
  (gltf) => {
    // Model loading and scene setup code
  }
);
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
