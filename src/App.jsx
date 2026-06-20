import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { color } from "three/tsl";

// ======================================================
// ================ FBX UTILITY FUNCTIONS ===============
// ======================================================

function normalizePivotForAllMeshes(root) {
  const box = new THREE.Box3().setFromObject(root);
  const center = new THREE.Vector3();
  box.getCenter(center);
  const minY = box.min.y;

  root.traverse((obj) => {
    if (obj.isMesh) {
      obj.position.x -= center.x;
      obj.position.z -= center.z;
      obj.position.y -= minY;
    }
  });
}

function enableShadows(object) {
  object.traverse((c) => {
    if (c.isMesh) {
      c.castShadow = true;
      c.receiveShadow = true;
    }
  });
}

// ======================================================
// ================ FBX TRANSFORM FLATTENER =============
// ======================================================

function prepareFBX(original) {
  const root = original.clone(true);
  root.updateMatrixWorld(true);
  const wrapper = new THREE.Group();

  root.traverse((child) => {
    if (child.isMesh) {
      const geom = child.geometry.clone(true);
      geom.computeVertexNormals();
      let mat = child.material ? child.material.clone() : null;

      const name = child.name.toLowerCase();
      const parentName = child.parent?.name?.toLowerCase() || "";
      const isMetal =
        name.includes("leg") ||
        name.includes("frame") ||
        name.includes("support") ||
        parentName.includes("leg") ||
        parentName.includes("frame") ||
        parentName.includes("support");

      if (mat && mat.map) {
        // Dark wood texture for shelves
        mat = new THREE.MeshStandardMaterial({
          color: 0xEDE5C9,
          roughness: 0.85,
          metalness: 0.0,
        });

      } else if (isMetal) {
        mat = new THREE.MeshStandardMaterial({
          color: 0xFFFFFF,
          roughness: 0.4,
          metalness: 0.05,
        });
      } else {

        //////// METAL COLOR ////////
        mat = new THREE.MeshStandardMaterial({
          color: 0x858585,
          roughness: 0.8,
          metalness: 0,
        });
      }

      mat.side = THREE.DoubleSide;
      const mesh = new THREE.Mesh(geom, mat);
      mesh.applyMatrix4(child.matrixWorld);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      wrapper.add(mesh);
    }
  });

  const box = new THREE.Box3().setFromObject(wrapper);
  const center = new THREE.Vector3();
  box.getCenter(center);
  const minY = box.min.y;

  wrapper.children.forEach((m) => {
    m.position.x -= center.x;
    m.position.z -= center.z;
    m.position.y -= minY;
  });

  wrapper.userData = {
    width: box.max.x - box.min.x,
    depth: box.max.z - box.min.z,
    height: box.max.y - box.min.y,
  };

  return wrapper;
}

// ======================================================
// ====================== MODELS =========================
// ======================================================

export function ShelfModel(props) {
  const fbx = useLoader(FBXLoader, "/models/Living Forest Shelf.fbx");
  const prepared = React.useMemo(() => prepareFBX(fbx), [fbx]);

  return (
    <group {...props}>
      <primitive object={prepared} scale={0.001} position={[0, -0.168, 0]} />
    </group>
  );
}

function createLegModel(path) {
  return function LegModel(props) {
    const fbx = useLoader(FBXLoader, path);
    const prepared = React.useMemo(() => prepareFBX(fbx), [fbx]);
    return (
      <group {...props} rotation={[0, 0, 0]}>
        <primitive object={prepared} scale={0.001} />
      </group>
    );
  };
}

export const Leg50Model = createLegModel("/models/Living Forest Leg 50.fbx");
export const Leg100Model = createLegModel("/models/Living Forest Leg 100.fbx");
export const Leg150Model = createLegModel("/models/Living Forest Leg 150.fbx");

// ======================================================
// ===================== CURTAIN ========================
// ======================================================

function Curtain({ curtain, modulePosition }) {
  const MODULE_WIDTH = 0.6;
  
  // Determine position and rotation based on side
  let position = [0, 0, 0];
  let rotation = [0, 0, 0];
  
  const heightM = curtain.heightCm * 0.01;
  const lengthM = curtain.lengthCm * 0.01;
  
  switch (curtain.side) {
    case 'front':
      position = [0, heightM - lengthM / 2, MODULE_WIDTH / 2];
      break;
    case 'back':
      position = [0, heightM - lengthM / 2, -MODULE_WIDTH / 2];
      break;
    case 'left':
      position = [-MODULE_WIDTH / 2, heightM - lengthM / 2, 0];
      rotation = [0, Math.PI / 2, 0];
      break;
    case 'right':
      position = [MODULE_WIDTH / 2, heightM - lengthM / 2, 0];
      rotation = [0, Math.PI / 2, 0];
      break;
  }
  
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[MODULE_WIDTH, lengthM]} />
      <meshStandardMaterial 
        color="#f4e8d8" 
        side={THREE.DoubleSide}
        transparent
        opacity={0.98}
      />
    </mesh>
  );
}

// ======================================================
// ===================== SHELF ==========================
// ======================================================

function Shelf({
  moduleId,
  shelf,
  moduleHeight,
  onMoveShelf,
  onDragStart,
  onDragEnd,
  onSelectShelf,
  isSelected,
}) {
  const ref = React.useRef();
  const hitboxRef = React.useRef();
  const { camera, gl } = useThree();

  const dragging = React.useRef(false);
  const dragStartY = React.useRef(0);
  const startHeightCm = React.useRef(0);

  // Position shelf based on its heightCm (distance from bottom)
  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.position.y = shelf.heightCm * 0.01;
  }, [shelf.heightCm]);

  const handlePointerDown = (e) => {
    e.stopPropagation();

    if (!isSelected) {
      onSelectShelf(moduleId, shelf.id);
      return;
    }

    dragging.current = true;
    dragStartY.current = e.clientY;
    startHeightCm.current = shelf.heightCm;
    document.body.style.cursor = "grabbing";
    onDragStart?.();
  };

  React.useEffect(() => {
    const handlePointerMove = (ev) => {
      if (!dragging.current) return;

      // Simple pixel-to-cm conversion
      const deltaY = dragStartY.current - ev.clientY;
      const cmPerPixel = 0.2; // Adjust this for sensitivity
      const deltaCm = deltaY * cmPerPixel;
      
      let newHeightCm = startHeightCm.current + deltaCm;

      // Clamp to bounds - 15cm minimum, module height maximum
      const MIN = 15;
      const MAX = moduleHeight;
      newHeightCm = Math.max(MIN, Math.min(newHeightCm, MAX));

      // Round to nearest 5cm
      newHeightCm = Math.round(newHeightCm / 5) * 5;

      onMoveShelf(moduleId, shelf.id, newHeightCm);
    };

    const handlePointerUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "default";
      onDragEnd?.();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [moduleId, moduleHeight, onMoveShelf, onDragEnd, shelf.id]);

  return (
    <group ref={ref}>
      {/* BIG HITBOX */}
      <mesh
        ref={hitboxRef}
        position={[0, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (isSelected) document.body.style.cursor = "grab";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "default";
        }}
      >
        <boxGeometry args={[0.7, 0.2, 0.7]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>

      {/* Visible shelf model */}
      <group pointerEvents="none">
        <Suspense fallback={null}>
          <ShelfModel />
        </Suspense>
      </group>

      {/* Selection highlight */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[0.62, 0.05, 0.62]} />
          <meshBasicMaterial color="#f6ae3bff" opacity={0.15} transparent />
        </mesh>
      )}
    </group>
  );
}

// ======================================================
// ======================= LEGS ==========================
// ======================================================

function Legs({ modules }) {
  const legs = new Map();

  Object.entries(modules).forEach(([id, mod]) => {
    const [gx, gz] = id.split(",").map(Number);
    const height = mod.height;
    const corners = [
      [gx - 0.5, gz - 0.5],
      [gx + 0.5, gz - 0.5],
      [gx - 0.5, gz + 0.5],
      [gx + 0.5, gz + 0.5],
    ];

    corners.forEach(([cx, cz]) => {
      const key = `${cx},${cz}`;
      legs.set(key, Math.max(legs.get(key) || 0, height));
    });
  });

  return (
    <group>
      {[...legs.entries()].map(([cornerKey, height]) => {
        const [cx, cz] = cornerKey.split(",").map(Number);
        let Model = Leg150Model;
        if (height === 50) Model = Leg50Model;
        if (height === 100) Model = Leg100Model;

        return (
          <Suspense key={cornerKey} fallback={null}>
            <Model position={[cx * 0.6, 0, cz * 0.6]} />
          </Suspense>
        );
      })}
    </group>
  );
}


function Room({ width, depth, height }) {
  const wallThickness = 0.05;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#b3ac9eff" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, height / 2, -depth / 2]}>
        <boxGeometry args={[width, height, wallThickness]} />
        <meshStandardMaterial color="#d6d1c4ff" />
      </mesh>

      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color="#d6d1c4ff" />
      </mesh>

      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[wallThickness, height, depth]} />
        <meshStandardMaterial color="#d6d1c4ff" />
      </mesh>
    </group>
  );
}

// ======================================================
// ======================== APP ==========================
// ======================================================

export default function App() {
  // BACKGROUND COLORS - Edit these to change colors
  const UI_BACKGROUND_COLOR = "#e5e5e5ff";
  const TEXT_COLOR = "#393939ff";
  const BUTTON_COLOR = "#d4d4d4ff";
  const [roomSize, setRoomSize] = React.useState({
    width: 5,  // meters (X)
    depth: 3,  // meters (Z)
    height: 2.6, // meters (Y)
  });

  // FONT FAMILY - Edit this to change the font
  const FONT_FAMILY = "Arial, sans-serif";

  const [showHelp, setShowHelp] = React.useState(false);
  const [modules, setModules] = React.useState({
    "0,0": {
      height: 150,
      shelves: [{ id: crypto.randomUUID(), heightCm: 150 }],
      curtains: [],
    },
  });

  const [selectedModule, setSelectedModule] = React.useState("0,0");
  const [selectedShelf, setSelectedShelf] = React.useState(null);
  const [selectedCurtain, setSelectedCurtain] = React.useState(null);
  const [isDraggingShelf, setIsDraggingShelf] = React.useState(false);
  const [shift, setShift] = React.useState(false);

  React.useEffect(() => {
    const down = (e) => e.key === "Shift" && setShift(true);
    const up = (e) => e.key === "Shift" && setShift(false);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const moduleKey = (x, z) => `${x},${z}`;
  const parseKey = (id) => id.split(",").map(Number);

  const createModule = (x, z, height = 150) => {
    const id = moduleKey(x, z);
    setModules((prev) => {
      if (prev[id]) return prev;
      return {
        ...prev,
        [id]: { height, shelves: [{ id: crypto.randomUUID(), heightCm: height }], curtains: [] },
      };
    });
    setSelectedModule(id);
    setSelectedShelf(null);
  };

  const removeModule = () => {
    if (!selectedModule) return;
    setModules((prev) => {
      if (Object.keys(prev).length <= 1) return prev;
      
      const next = { ...prev };
      delete next[selectedModule];
      setSelectedModule(Object.keys(next)[0] || null);
      setSelectedShelf(null);
      return next;
    });
  };

  const setModuleHeight = (height) => {
    if (!selectedModule) return;
    setModules((prev) => {
      const mod = prev[selectedModule];
      const shelves = mod.shelves.filter((s) => s.heightCm <= height);
      if (shelves.length === 0) shelves.push({ id: crypto.randomUUID(), heightCm: height });
      return { ...prev, [selectedModule]: { ...mod, height, shelves } };
    });
  };

  const addShelf = () => {
    if (!selectedModule) return;
    setModules((prev) => {
      const mod = prev[selectedModule];
      const shelves = [...mod.shelves].sort((a, b) => a.heightCm - b.heightCm);
      let newY = shelves.length ? shelves[shelves.length - 1].heightCm + 20 : mod.height / 2;
      newY = Math.min(newY, mod.height - 15);
      shelves.push({ id: crypto.randomUUID(), heightCm: newY });
      return { ...prev, [selectedModule]: { ...mod, shelves } };
    });
  };

  const removeShelf = (shelfId) => {
    if (!selectedModule) return;
    setModules((prev) => {
      const mod = prev[selectedModule];
      let shelves = mod.shelves.filter((s) => s.id !== shelfId);
      if (!shelves.length) shelves = [{ id: crypto.randomUUID(), heightCm: mod.height }];
      return { ...prev, [selectedModule]: { ...mod, shelves } };
    });
    setSelectedShelf(null);
  };

  const addCurtain = (side) => {
    if (!selectedModule) return;
    const newCurtain = {
      id: crypto.randomUUID(),
      side, // 'front', 'back', 'left', 'right'
      heightCm: modules[selectedModule].height - 20,
      lengthCm: 100,
    };
    setModules((prev) => {
      const mod = prev[selectedModule];
      const curtains = [...mod.curtains];
      curtains.push(newCurtain);
      return { ...prev, [selectedModule]: { ...mod, curtains } };
    });
    setSelectedCurtain(newCurtain.id);
  };

  const removeCurtain = (curtainId) => {
    if (!selectedModule) return;
    setModules((prev) => {
      const mod = prev[selectedModule];
      const curtains = mod.curtains.filter((c) => c.id !== curtainId);
      return { ...prev, [selectedModule]: { ...mod, curtains } };
    });
    setSelectedCurtain(null);
  };

  const updateCurtain = (curtainId, field, value) => {
    if (!selectedModule) return;
    setModules((prev) => {
      const mod = prev[selectedModule];
      const curtains = mod.curtains.map((c) =>
        c.id === curtainId ? { ...c, [field]: value } : c
      );
      return { ...prev, [selectedModule]: { ...mod, curtains } };
    });
  };

  const moveShelf = (moduleId, shelfId, newHeightCm) => {
    setModules((prev) => {
      const mod = prev[moduleId];
      const shelves = [...mod.shelves];
      const index = shelves.findIndex((s) => s.id === shelfId);
      if (index === -1) return prev;

      // Clamp between 15cm minimum and module height maximum
      const MIN = 15;
      const MAX = mod.height;
      const clamped = Math.max(MIN, Math.min(newHeightCm, MAX));

      shelves[index] = { ...shelves[index], heightCm: clamped };

      return { ...prev, [moduleId]: { ...mod, shelves } };
    });
  };

  const keys = Object.keys(modules);
  const coords = keys.map(parseKey);
  const ROOM_OFFSET_Z = -roomSize.depth / 2 + 0.36; // 30cm from wall

  const CELL_SIZE = 52;

  const minX = Math.min(...coords.map(c => c[0])) - 1;
  const maxX = Math.max(...coords.map(c => c[0])) + 1;
  const minZ = Math.min(...coords.map(c => c[1])) - 1;
  const maxZ = Math.max(...coords.map(c => c[1])) + 1;

  const gridXs = [];
  for (let x = minX; x <= maxX; x++) gridXs.push(x);
  const gridZs = [];
  for (let z = minZ; z <= maxZ; z++) gridZs.push(z);

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", fontFamily: FONT_FAMILY }}>
      {/* SIDEBAR */}
      <div style={{ width: 500, display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: UI_BACKGROUND_COLOR }} className="border-r">
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <h1 className="text-2xl font-bold mb-3" style={{ color: TEXT_COLOR }}>Living Structure</h1>

          <h2 className="font-semibold mt-6 mb-2" style={{ color: TEXT_COLOR }}>
            Room
          </h2>
          <div> 
            <label style={{color: TEXT_COLOR}}>Width (m)</label>
            <input
              type="number"
              step="0.1"
              value={roomSize.width}
              onChange={(e) =>
                setRoomSize({ ...roomSize, width: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label style={{color: TEXT_COLOR}}>Depth (m)</label>
            <input
              type="number"
              step="0.1"
              value={roomSize.depth}
              onChange={(e) =>
                setRoomSize({ ...roomSize, depth: Number(e.target.value) })
              }
            />
          </div>

          {/* MODULE GRID */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2" style={{ color: TEXT_COLOR }}>Modules</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridXs.length}, ${CELL_SIZE}px)`,
                gap: 2,
              }}
            >
              {gridZs.map((z) =>
                gridXs.map((x) => {
                  const id = moduleKey(x, z);
                  const exists = Boolean(modules[id]);
                  const isSelected = selectedModule === id;

                  const hasNeighbor = 
                    modules[moduleKey(x-1, z)] ||
                    modules[moduleKey(x+1, z)] ||
                    modules[moduleKey(x, z-1)] ||
                    modules[moduleKey(x, z+1)];

                  if (!exists && hasNeighbor) {
                    return (
                      <button
                        key={id}
                        onClick={() => createModule(x, z)}
                        title="Add module"
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                          border: "2px dashed #b3b3b3ff",
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          color: "#b3b3b3ff",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    );
                  }

                  if (!exists) {
                    return (
                      <div
                        key={id}
                        style={{
                          width: CELL_SIZE,
                          height: CELL_SIZE,
                        }}
                      />
                    );
                  }

                  return (
                    <div
                      key={id}
                      style={{
                        position: "relative",
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                      }}
                    >
                      <button
                        onClick={() => {
                          setSelectedModule(id);
                          setSelectedShelf(null);
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                          background: isSelected ? TEXT_COLOR : BUTTON_COLOR,
                          cursor: "pointer",
                        }}
                      />

                      {isSelected && Object.keys(modules).length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeModule();
                          }}
                          title="Remove module"
                          style={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            width: 25,
                            height: 25,
                            borderRadius: "50%",
                            background: "#531f0cff",
                            color: "white",
                            fontSize: 15,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid white",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* MODULE SETTINGS */}
          {selectedModule && (
            <div>
              <div className="mb-4">
                <div className="font-semibold mb-1" style={{ color: TEXT_COLOR, marginTop: "10px", paddingRight: "5px" }}>Height:  

                <select
                  value={modules[selectedModule].height}
                  onChange={(e) => setModuleHeight(Number(e.target.value))}
                  className="w-full border p-2 rounded"
                >
                  <option value={50}>50 cm</option> 
                  <option value={100}>100 cm</option>
                  <option value={150}>150 cm</option>
                </select>
              </div>
              </div>

              {/* SHELVES LIST */}
              <div>
                <h2 className="font-semibold mb-1" style={{color: TEXT_COLOR, marginTop: "20px" }}>Levels</h2>
                {modules[selectedModule].shelves
                  .sort((a, b) => b.heightCm - a.heightCm)
                  .map((s) => {
                    const isSel =
                      selectedShelf &&
                      selectedShelf.moduleId === selectedModule &&
                      selectedShelf.shelfId === s.id;

                    return (
                      <div
                        key={s.id}
                        className={`flex justify-between items-center mt-1 text-sm ${
                          isSel ? "bg-gray-200 rounded px-1" : ""
                        }`}
                        style={{ color: isSel ? TEXT_COLOR : TEXT_COLOR }}
                      >
                        <button
                          className="flex-1 text-left"
                          style={{marginBottom: "5px", marginRight: "5px", color: isSel ? TEXT_COLOR : TEXT_COLOR, background: BUTTON_COLOR }}
                          onClick={() =>
                            setSelectedShelf({ moduleId: selectedModule, shelfId: s.id })
                          }
                        >
                          {s.heightCm} cm
                        </button>
                        <div className="flex gap-1">
                          <button
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            style={{marginBottom: "10px", marginRight: "5px", color: TEXT_COLOR, background: BUTTON_COLOR }}
                            onClick={() =>
                              moveShelf(selectedModule, s.id, s.heightCm + 5)
                            }
                          >
                            ▲
                          </button>
                          <button
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            style={{marginBottom: "10px", marginRight: "5px", color: TEXT_COLOR, background: BUTTON_COLOR }}
                            onClick={() =>
                              moveShelf(selectedModule, s.id, s.heightCm - 5)
                            }
                          >
                            ▼
                          </button>
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            style={{marginBottom: "10px", marginRight: "5px", color: TEXT_COLOR, background: BUTTON_COLOR }}
                            onClick={() => removeShelf(s.id)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}

                <button
                  onClick={addShelf}
                  style={{marginBottom: "5px", marginRight: "5px", color: TEXT_COLOR, background: BUTTON_COLOR}}
                  className="mt-2 w-full bg-green-600 text-white py-1.5 rounded hover:bg-green-700"
                >
                  +
                </button>
              </div>

              {/* CURTAINS SECTION */}
              <div style={{ marginTop: "30px" }}>
                <h2 className="font-semibold mb-2" style={{ color: TEXT_COLOR }}>Curtains</h2>
                
                {/* Side selector grid */}
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(3, 1fr)", 
                  gap: "0px",
                  marginBottom: "12px",
                  width: "120px",
                  height: "120px"
                }}>
                  <div></div>
                  <button
                    onClick={() => {
                      const hasCurtain = modules[selectedModule].curtains.find(c => c.side === 'back');
                      if (hasCurtain) {
                        setSelectedCurtain(hasCurtain.id);
                      } else {
                        addCurtain('back');
                      }
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title={modules[selectedModule].curtains.some(c => c.side === 'back') ? "Select back curtain" : "Add curtain to back"}
                  >
                    {modules[selectedModule].curtains.find(c => c.side === 'back') ? (
                      <div style={{
                        width: "100%",
                        height: "10px",
                        background: selectedCurtain === modules[selectedModule].curtains.find(c => c.side === 'back')?.id ? TEXT_COLOR : "#d4d4d4ff",
                        borderRadius: "5px"
                      }}></div>
                    ) : (
                      <span style={{ fontSize: "24px", color: "#b3b3b3ff" }}>+</span>
                    )}
                  </button>
                  <div></div>
                  
                  <button
                    onClick={() => {
                      const hasCurtain = modules[selectedModule].curtains.find(c => c.side === 'left');
                      if (hasCurtain) {
                        setSelectedCurtain(hasCurtain.id);
                      } else {
                        addCurtain('left');
                      }
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title={modules[selectedModule].curtains.some(c => c.side === 'left') ? "Select left curtain" : "Add curtain to left"}
                  >
                    {modules[selectedModule].curtains.find(c => c.side === 'left') ? (
                      <div style={{
                        width: "10px",
                        height: "100%",
                        background: selectedCurtain === modules[selectedModule].curtains.find(c => c.side === 'left')?.id ? TEXT_COLOR : "#d4d4d4ff",
                        borderRadius: "5px"
                      }}></div>
                    ) : (
                      <span style={{ fontSize: "24px", color: "#b3b3b3ff" }}>+</span>
                    )}
                  </button>
                  <div style={{ 
                    background: "transparent"
                  }}></div>
                  <button
                    onClick={() => {
                      const hasCurtain = modules[selectedModule].curtains.find(c => c.side === 'right');
                      if (hasCurtain) {
                        setSelectedCurtain(hasCurtain.id);
                      } else {
                        addCurtain('right');
                      }
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title={modules[selectedModule].curtains.some(c => c.side === 'right') ? "Select right curtain" : "Add curtain to right"}
                  >
                    {modules[selectedModule].curtains.find(c => c.side === 'right') ? (
                      <div style={{
                        width: "10px",
                        height: "100%",
                        background: selectedCurtain === modules[selectedModule].curtains.find(c => c.side === 'right')?.id ? TEXT_COLOR : "#d4d4d4ff",
                        borderRadius: "5px"
                      }}></div>
                    ) : (
                      <span style={{ fontSize: "24px", color: "#b3b3b3ff" }}>+</span>
                    )}
                  </button>
                  
                  <div></div>
                  <button
                    onClick={() => {
                      const hasCurtain = modules[selectedModule].curtains.find(c => c.side === 'front');
                      if (hasCurtain) {
                        setSelectedCurtain(hasCurtain.id);
                      } else {
                        addCurtain('front');
                      }
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    title={modules[selectedModule].curtains.some(c => c.side === 'front') ? "Select front curtain" : "Add curtain to front"}
                  >
                    {modules[selectedModule].curtains.find(c => c.side === 'front') ? (
                      <div style={{
                        width: "100%",
                        height: "10px",
                        background: selectedCurtain === modules[selectedModule].curtains.find(c => c.side === 'front')?.id ? TEXT_COLOR : "#d4d4d4ff",
                        borderRadius: "5px"
                      }}></div>
                    ) : (
                      <span style={{ fontSize: "24px", color: "#b3b3b3ff" }}>+</span>
                    )}
                  </button>
                  <div></div>
                </div>

                {/* Curtain controls - only show when one is selected */}
                {selectedCurtain && modules[selectedModule].curtains.find(c => c.id === selectedCurtain) && (() => {
                  const curtain = modules[selectedModule].curtains.find(c => c.id === selectedCurtain);
                  const sideLabel = curtain.side.charAt(0).toUpperCase() + curtain.side.slice(1);
                  
                  return (
                    <div style={{
                      background: "#00000011",
                      padding: "12px",
                      borderRadius: "4px",
                      marginBottom: "8px"
                    }}>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        marginBottom: "12px"
                      }}>
                        <span style={{ color: TEXT_COLOR, fontWeight: "bold" }}>
                          {sideLabel} Curtain
                        </span>
                        <button
                          onClick={() => {
                            removeCurtain(curtain.id);
                          }}
                          style={{
                            background: BUTTON_COLOR,
                            color: TEXT_COLOR,
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            cursor: "pointer"
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div style={{ marginBottom: "8px" }}>
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center",
                          marginBottom: "4px"
                        }}>
                          <span style={{ color: TEXT_COLOR, fontSize: "14px" }}>
                            Height: {curtain.heightCm} cm
                          </span>
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button
                              style={{
                                padding: "4px 8px",
                                color: TEXT_COLOR,
                                background: BUTTON_COLOR,
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                              }}
                              onClick={() =>
                                updateCurtain(curtain.id, 'heightCm', Math.min(curtain.heightCm + 5, modules[selectedModule].height))
                              }
                            >
                              ▲
                            </button>
                            <button
                              style={{
                                padding: "4px 8px",
                                color: TEXT_COLOR,
                                background: BUTTON_COLOR,
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                              }}
                              onClick={() =>
                                updateCurtain(curtain.id, 'heightCm', Math.max(curtain.heightCm - 5, 15))
                              }
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label style={{ color: TEXT_COLOR, fontSize: "14px" }}>Length (cm): </label>
                        <input
                          type="number"
                          value={curtain.lengthCm}
                          onChange={(e) => updateCurtain(curtain.id, 'lengthCm', Number(e.target.value))}
                          style={{
                            width: "80px",
                            marginLeft: "4px",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid #ccc"
                          }}
                          min={10}
                          max={200}
                          step={5}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
        
        {/* Ergonomics button at bottom */}
        <div style={{ padding: '16px', borderTop: '1px solid #1c1c1cff' }}>
          <button
            onClick={() => setShowHelp(true)}
            style={{ color: TEXT_COLOR, background: BUTTON_COLOR }}
            className="w-full bg-blue-600 color: TEXT_COLOR py-2 rounded hover:bg-blue-700"
          >
            Ergonomics Guide
          </button>
        </div>
      </div>

      {/* 3D VIEW */}
      <div style={{ flex: 1, backgroundColor: UI_BACKGROUND_COLOR }}>
        <Canvas
          shadows
          camera={{ position: [2, 2, 3], fov: 50 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[4, 10, 4]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-3}
            shadow-camera-right={3}
            shadow-camera-top={3}
            shadow-camera-bottom={-3}
            shadow-bias={-0.0005}
            shadow-normalBias={0.05}
          />
          <Suspense fallback={null}>
            <Room
              width={roomSize.width}
              depth={roomSize.depth}
              height={roomSize.height}
            />
          </Suspense>

          <group position={[0, 0, ROOM_OFFSET_Z]}>
            {/* LEGS */}
            <Suspense fallback={null}>
              <Legs modules={modules} />
            </Suspense>

            {/* SHELVES / MODULES */}
            {Object.entries(modules).map(([id, mod]) => {
              const [gx, gz] = parseKey(id);
              const MODULE_SPACING = 0.6;
              const posX = gx * MODULE_SPACING;
              const posZ = gz * MODULE_SPACING;

              return (
                <group
                  key={id}
                  position={[posX, 0, posZ]}
                  onClick={(e) => {
                    if (!e.object.userData.fromShelf) {
                      setSelectedModule(id);
                      setSelectedShelf(null);
                    }
                  }}
                >
                  {mod.shelves.map((sh) => (
                    <Suspense key={sh.id} fallback={null}>
                      <Shelf
                        moduleId={id}
                        shelf={sh}
                        moduleHeight={mod.height}
                        onMoveShelf={moveShelf}
                        onDragStart={() => setIsDraggingShelf(true)}
                        onDragEnd={() => setIsDraggingShelf(false)}
                        onSelectShelf={(moduleId, shelfId) =>
                          setSelectedShelf({ moduleId, shelfId })
                        }
                        isSelected={
                          selectedShelf &&
                          selectedShelf.moduleId === id &&
                          selectedShelf.shelfId === sh.id
                        }
                      />
                    </Suspense>
                  ))}
                  
                  {/* Render curtains */}
                  {mod.curtains.map((curtain) => (
                    <Suspense key={curtain.id} fallback={null}>
                      <Curtain curtain={curtain} modulePosition={[posX, 0, posZ]} />
                    </Suspense>
                  ))}
                </group>
              );
            })}
          </group>

          <OrbitControls
            enabled={!isDraggingShelf}
            enablePan={shift}
            enableRotate={!shift}
            maxPolarAngle={Math.PI / 2.1}
            makeDefault
          />
        </Canvas>
      </div>

      {/* HELP MODAL */}
      {showHelp && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowHelp(false)}
        >
          <div
            style={{ background: UI_BACKGROUND_COLOR, padding: 20, maxWidth: 420, borderRadius: 8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{color: TEXT_COLOR}} className="text-lg font-bold mb-2">Table surface</h2>
            <ul style={{color: TEXT_COLOR}} className="text-sm text-black-700 list-disc pl-5 space-y-1">
              <div>For the height of a table surface, measure your elbow height from your seating surface. Relax your shoulders under a 90 to 110 degree angle.</div>
              <div> Use this height for the distance between your seating surface and table surface.</div>
            </ul>
            <h2 style={{color: TEXT_COLOR}} className="text-lg font-bold mb-2">Seating surface</h2>
            <ul style={{color: TEXT_COLOR}} className="text-sm text-black-700 list-disc pl-5 space-y-1">
              <div>For the height of a seating surface, measure your knee height from the ground. Your knees should have a 90 degree angle with feet flat on the ground.</div>
              <div> Use this height for the distance between your seating surface and the surface below.</div>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 w-full bg-blue-600 text-black py-1.5 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}