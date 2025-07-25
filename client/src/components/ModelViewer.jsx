import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ModelViewer = () => {
  const containerRef = useRef();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/models/${id}`);
        initThreeJS(response.data.url);
      } catch (err) {
        setError('Failed to load model');
        setIsLoading(false);
      }
    };

    const initThreeJS = (modelUrl) => {
      if (!containerRef.current) return;

      // Setup scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      
      // Setup camera
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // Setup renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      // Add controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      // Load model
      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          scene.add(gltf.scene);
          setIsLoading(false);
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error);
          setError('Failed to load 3D model');
          setIsLoading(false);
        }
      );

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        containerRef.current?.removeChild(renderer.domElement);
      };
    };

    fetchModel();
  }, [id]);

  return (
    <div className="model-viewer">
      <button onClick={() => navigate('/')} className="back-btn">
        ← Back to Dashboard
      </button>
      
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading 3D Model...</p>
        </div>
      )}
      
      {error && (
        <div className="error-overlay">
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Go Back</button>
        </div>
      )}
      
      <div ref={containerRef} className="model-container"></div>
    </div>
  );
};

export default ModelViewer;