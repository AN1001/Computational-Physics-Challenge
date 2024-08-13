import { useEffect, useRef } from "react";
// @ts-ignore
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface Props {
  long: number;
  lat: number;
  angle: number;
}

function Globe({ long, lat, angle }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer;
    let sphere: THREE.Mesh,
      controls: OrbitControls,
      skybox: THREE.Mesh,
      projectilePath: THREE.Line;

    const skyboxImage = "space";

    const createPathStrings = (filename: string): string[] => {
      const basePath = "../img/skybox/";
      const baseFilename = basePath + filename;
      const fileType = ".png";
      const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
      const pathStrings = sides.map(
        (side) => baseFilename + "_" + side + fileType
      );
      return pathStrings;
    };

    const createMaterialArray = (
      filename: string
    ): THREE.MeshBasicMaterial[] => {
      const skyboxImagepaths = createPathStrings(filename);
      const materialArray = skyboxImagepaths.map((image) => {
        const texture = new THREE.TextureLoader().load(image);
        return new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide,
        });
      });
      return materialArray;
    };

    const setSkyBox = () => {
      const materialArray = createMaterialArray(skyboxImage);
      const skyboxGeo = new THREE.BoxGeometry(200, 200, 200);
      skybox = new THREE.Mesh(skyboxGeo, materialArray);
      scene.add(skybox);
    };

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        85,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      setSkyBox();
      loadTexture("../img/earth_texture.jpg");
      scene.add(sphere);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current?.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.minDistance = 5;
      controls.maxDistance = 100;

      camera.position.z = 20;

      drawProjectilePath({ a: 4, b: 8 }, { x: long, y: lat, z: angle });
    };

    const loadTexture = (texture: string) => {
      const geometry = new THREE.SphereGeometry(5, 32, 32);
      const loader = new THREE.TextureLoader();
      const earthTexture = loader.load(texture);
      const material = new THREE.MeshBasicMaterial({ map: earthTexture });

      sphere = new THREE.Mesh(geometry, material);
    };

    const drawProjectilePath = (
      size = { a: 2, b: 1 },
      rotation = { x: 0, y: 0, z: 0 }
    ) => {
      const points: THREE.Vector3[] = [];
      const { a, b } = size;

      for (let t = 0; t <= Math.PI; t += 0.1) {
        const x = a * Math.cos(t);
        const y = b * Math.sin(t);
        points.push(new THREE.Vector3(x, y, 0));
      }

      const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      projectilePath = new THREE.Line(pathGeometry, pathMaterial);

      // Apply rotations
      projectilePath.rotation.x = rotation.x;
      projectilePath.rotation.y = rotation.y;
      projectilePath.rotation.z = rotation.z;

      scene.add(projectilePath);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      if (projectilePath) {
        // Example: Rotate line around the Y-axis
        projectilePath.rotation.y += 0.001;
        projectilePath.rotation.x += 0.001;
        projectilePath.rotation.z += 0.001;
      }
      controls.update();
      renderer.render(scene, camera);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize, false);

    init();
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div ref={mountRef} />
    </>
  );
}

export default Globe;
