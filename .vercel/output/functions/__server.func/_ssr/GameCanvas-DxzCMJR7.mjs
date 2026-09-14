import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as useGLTF, d as useThree, i as OrbitControls, l as Canvas, m as require_jsx_runtime, n as ContactShadows, o as useProgress, r as Environment, s as Html, t as Lightformer, u as useFrame } from "../_libs/@react-three/drei+[...].mjs";
import { a as STEPS, i as useGame, n as CODEX_ENTRIES, r as MODEL } from "./routes-CrhU_R2-.mjs";
import { Nt as Vector3, c as Box3, l as BufferAttribute, u as BufferGeometry } from "../_libs/monogrid__gainmap-js+three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GameCanvas-DxzCMJR7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
if (typeof window !== "undefined") {
	useGLTF.preload(MODEL.cylinder);
	useGLTF.preload(MODEL.regulator);
	useGLTF.preload(MODEL.wrench);
	useGLTF.preload(MODEL.hose);
	useGLTF.preload(MODEL.n2Reg);
	useGLTF.preload(MODEL.n2RegHose);
}
function geometryBounds(root) {
	const box = new Box3();
	let first = true;
	root.traverse((o) => {
		const mesh = o;
		if (!mesh.isMesh || !mesh.geometry) return;
		mesh.geometry.computeBoundingBox();
		const b = mesh.geometry.boundingBox;
		if (!b || b.isEmpty()) return;
		if (first) {
			box.copy(b);
			first = false;
		} else box.union(b);
	});
	return first ? null : box;
}
function cloneScene(src) {
	const scene = src.clone(true);
	scene.traverse((o) => {
		const mesh = o;
		if (!mesh.isMesh) return;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.frustumCulled = false;
		const apply = (mat) => {
			const m = mat.clone();
			if (m.metalness !== void 0) m.metalness = Math.min(.28, m.metalness || .25);
			if (m.roughness !== void 0) m.roughness = Math.max(.36, m.roughness || .48);
			m.envMapIntensity = 1.15;
			m.needsUpdate = true;
			return m;
		};
		if (Array.isArray(mesh.material)) mesh.material = mesh.material.map(apply);
		else if (mesh.material) mesh.material = apply(mesh.material);
	});
	return scene;
}
var LONG = {
	"/models/cylinder.glb": 1.903,
	"/models/regulator.glb": 1.902,
	"/models/wrench.glb": 1.885,
	"/models/hose.glb": 1.903,
	"/models/n2-reg.glb": 1.903,
	"/models/n2-reg-hose.glb": 1.903
};
/** Sit the model on y=0 of this group and scale so its longest side equals `size`. */
function FittedGltf({ url, size }) {
	const { scene } = useGLTF(url);
	const obj = (0, import_react.useMemo)(() => cloneScene(scene), [scene]);
	const box = (0, import_react.useMemo)(() => geometryBounds(obj), [obj]);
	const { s, pos } = (0, import_react.useMemo)(() => {
		const dim = box?.getSize(new Vector3());
		const measured = dim ? Math.max(dim.x, dim.y, dim.z) : 0;
		const scale = size / (measured > .4 && measured < 4 ? measured : LONG[url] ?? 1.9);
		return {
			s: scale,
			pos: box ? [
				-(box.min.x + box.max.x) * .5 * scale,
				-box.min.y * scale,
				-(box.min.z + box.max.z) * .5 * scale
			] : [
				0,
				0,
				0
			]
		};
	}, [
		box,
		url,
		size
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		scale: s,
		position: pos,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("primitive", { object: obj })
	});
}
function Highlight({ active, children }) {
	const ref = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		const g = ref.current;
		if (!g) return;
		const em = active ? .32 + Math.sin(clock.elapsedTime * 4.2) * .22 : 0;
		g.traverse((o) => {
			const mesh = o;
			if (!mesh.isMesh) return;
			const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
			for (const mat of mats) {
				const m = mat;
				if (!m?.emissive) continue;
				m.emissive.set(active ? "#4aa3b0" : "#000000");
				m.emissiveIntensity = em;
			}
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref,
		children
	});
}
function GhostHit({ radius = .1 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
		radius,
		10,
		10
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
		transparent: true,
		opacity: 0,
		depthWrite: false
	})] });
}
var CAM = {
	wide: {
		pos: [
			1.95,
			1.48,
			2.35
		],
		target: [
			.18,
			.9,
			0
		]
	},
	cyl: {
		pos: [
			.52,
			1.38,
			.78
		],
		target: [
			.07,
			1.18,
			.03
		]
	},
	flow: {
		pos: [
			.64,
			1.42,
			.68
		],
		target: [
			.18,
			1.22,
			.02
		]
	},
	inspect: {
		pos: [
			1.65,
			1.15,
			2.05
		],
		target: [
			0,
			.62,
			0
		]
	}
};
function shotFor(step, inspect) {
	if (inspect) return CAM.inspect;
	if (step === "open_cyl" || step === "check_psi") return CAM.cyl;
	if (step === "open_flow" || step === "check_flow") return CAM.flow;
	return CAM.wide;
}
function CameraDirector() {
	const stepId = useGame((s) => s.stepId);
	const grab = useGame((s) => s.valveGrab);
	const inspect = useGame((s) => s.codexOpen);
	const codexId = useGame((s) => s.codexId);
	const { camera, controls } = useThree();
	const focus = (0, import_react.useRef)({
		key: "",
		t: 0
	});
	useFrame((_, dt) => {
		const d = Math.min(dt, .1);
		const key = inspect ? `codex:${codexId}` : stepId;
		if (focus.current.key !== key) focus.current = {
			key,
			t: 0
		};
		focus.current.t += d;
		const shot = shotFor(stepId, inspect);
		const k = 1 - Math.exp(-3.4 * d);
		if (focus.current.t < 1.25) {
			camera.position.x += (shot.pos[0] - camera.position.x) * k;
			camera.position.y += (shot.pos[1] - camera.position.y) * k;
			camera.position.z += (shot.pos[2] - camera.position.z) * k;
			const c = controls;
			if (c?.target) {
				c.target.x += (shot.target[0] - c.target.x) * k;
				c.target.y += (shot.target[1] - c.target.y) * k;
				c.target.z += (shot.target[2] - c.target.z) * k;
				c.update?.();
			}
		}
		const c = controls;
		if (c) c.enabled = inspect || !grab;
	});
	return null;
}
var CYL_H = 1.28;
var REG_SIZE = .5;
var HOSE_SIZE = .82;
var WRENCH_SIZE = .52;
function useCombo() {
	return useGame((s) => {
		if (s.hoseFitted && s.hoseProgress > .88) return "hose";
		if (s.regulatorFitted && s.regulatorProgress > .88) return "reg";
		return "parts";
	});
}
function pulse(mat, active, t, color) {
	if (!mat) return;
	mat.emissive.set(active ? color : "#000000");
	mat.emissiveIntensity = active ? .28 + Math.sin(t * 4.2) * .22 : 0;
}
function Clickable({ id, children, position, rotation }) {
	const active = useGame((s) => STEPS.find((x) => x.id === s.stepId).highlights).includes(id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position,
		rotation,
		onClick: active ? (e) => {
			e.stopPropagation();
			useGame.getState().interact(id);
		} : void 0,
		onPointerOver: active ? (e) => {
			e.stopPropagation();
			document.body.style.cursor = "pointer";
		} : void 0,
		onPointerOut: active ? () => {
			document.body.style.cursor = "default";
		} : void 0,
		children
	});
}
function Floor() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			receiveShadow: true,
			position: [
				0,
				0,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [14, 14] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#1a2228",
				roughness: .92,
				metalness: .05
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				.002,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				.78,
				.88,
				48
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#c47b48",
				roughness: .7
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			rotation: [
				-Math.PI / 2,
				0,
				0
			],
			position: [
				0,
				.003,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
				.88,
				.96,
				48
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#1a1612",
				roughness: .8
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("gridHelper", {
			args: [
				14,
				28,
				"#243038",
				"#1c262c"
			],
			position: [
				0,
				.004,
				0
			]
		})
	] });
}
function Room() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				1.6,
				-3.4
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				10,
				3.2,
				.12
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#151c22",
				roughness: .9
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-3.6,
				1.6,
				0
			],
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.12,
				3.2,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#12181d",
				roughness: .9
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				3.15,
				0
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				10,
				.08,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#0e1418",
				roughness: 1
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				-1.6,
				1.35,
				-3.28
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.1, .7] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#1e2a30",
				roughness: .5
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				.2,
				1.35,
				-3.28
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [1.1, .7] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#243036",
				roughness: .5
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				1.85,
				1.55,
				-3.32
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("planeGeometry", { args: [.7, .38] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#4aa3b0",
				roughness: .45,
				metalness: .1
			})]
		})
	] });
}
function Bench() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		position: [
			1.5,
			0,
			.12
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				0,
				.42,
				0
			],
			castShadow: true,
			receiveShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				1.55,
				.08,
				1.1
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
				color: "#3a2a1c",
				roughness: .75
			})]
		}), [
			[-.68, -.46],
			[.68, -.46],
			[-.68, .46],
			[.68, .46]
		].map(([x, z]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				x,
				.2,
				z
			],
			castShadow: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("boxGeometry", { args: [
				.08,
				.4,
				.08
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2a2118" })]
		}, `${x}-${z}`))]
	});
}
function PopIn({ children }) {
	const ref = (0, import_react.useRef)(null);
	const born = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		if (born.current == null) born.current = clock.elapsedTime;
		const t = Math.min(1, (clock.elapsedTime - born.current) * 4.8);
		const k = 1 - (1 - t) * (1 - t) * (1 - t);
		if (ref.current) ref.current.scale.setScalar(.94 + .06 * k);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		ref,
		children
	});
}
function CombinedAssembly({ url, hose }) {
	const stepId = useGame((s) => s.stepId);
	const highlights = STEPS.find((x) => x.id === stepId).highlights;
	const meshActive = highlights.some((h) => [
		"regulator",
		"hose",
		"joint_reg",
		"joint_hose",
		"valve_cyl",
		"valve_flow",
		"hp_gauge",
		"flowmeter"
	].includes(h));
	const redirect = highlights.find((h) => h !== "wrench" && h !== "soap") ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopIn, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		onClick: redirect ? (e) => {
			e.stopPropagation();
			useGame.getState().interact(redirect);
		} : void 0,
		onPointerOver: redirect ? (e) => {
			e.stopPropagation();
			document.body.style.cursor = "pointer";
		} : void 0,
		onPointerOut: redirect ? () => {
			document.body.style.cursor = "default";
		} : void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlight, {
			active: meshActive,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FittedGltf, {
				url,
				size: CYL_H
			})
		})
	}), highlights.includes("hose") && hose ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clickable, {
		id: "hose",
		position: [
			.28,
			.72,
			.12
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostHit, { radius: .18 })
	}) : null] });
}
function CylinderRig() {
	const combo = useCombo();
	const capOff = useGame((s) => s.capOff);
	if (combo !== "parts") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FittedGltf, {
			url: MODEL.cylinder,
			size: CYL_H
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cap, {}),
		capOff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clickable, {
			id: "valve_cyl",
			position: [
				0,
				1.2,
				0
			],
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostHit, { radius: .14 })
		}) : null
	] });
}
function Cap() {
	const capOff = useGame((s) => s.capOff);
	const p = useGame((s) => s.capProgress);
	const mat = (0, import_react.useRef)(null);
	const active = useGame((s) => STEPS.find((x) => x.id === s.stepId).highlights).includes("cap");
	useFrame(({ clock }) => pulse(mat.current, active && !capOff, clock.elapsedTime, "#4aa3b0"));
	if (p >= 1) return null;
	const y = 1.12 + p * .55;
	const rot = p * Math.PI * 4;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Clickable, {
		id: "cap",
		position: [
			0,
			y,
			0
		],
		rotation: [
			0,
			rot,
			0
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.1,
					.112,
					.26,
					20
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					ref: mat,
					color: "#2a3c38",
					metalness: .35,
					roughness: .5
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.15,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.04,
					.04,
					.05,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#1a2826" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostHit, { radius: .2 })
		]
	});
}
function Regulator() {
	const combo = useCombo();
	const fitted = useGame((s) => s.regulatorFitted);
	const p = useGame((s) => s.regulatorProgress);
	const highlights = useGame((s) => STEPS.find((x) => x.id === s.stepId).highlights);
	const active = highlights.includes("regulator") || highlights.includes("hp_gauge") || highlights.includes("valve_flow") || highlights.includes("flowmeter");
	if (fitted && combo !== "parts") return null;
	const bench = [
		1.32,
		.46,
		-.12
	];
	const seated = [
		.012,
		1.1400000000000001,
		0
	];
	const pos = fitted ? [
		bench[0] + (seated[0] - bench[0]) * p,
		bench[1] + (seated[1] - bench[1]) * p,
		bench[2] + (seated[2] - bench[2]) * p
	] : bench;
	const yaw = fitted ? .55 * p + .35 * (1 - p) : .55;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position: pos,
		rotation: [
			0,
			yaw,
			0
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Clickable, {
			id: "regulator",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlight, {
				active,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FittedGltf, {
					url: MODEL.regulator,
					size: REG_SIZE
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostHit, { radius: .22 })]
		})
	});
}
function Hose() {
	const combo = useCombo();
	const fitted = useGame((s) => s.hoseFitted);
	const p = useGame((s) => s.hoseProgress);
	const flow = useGame((s) => s.flowLpm);
	const highlights = useGame((s) => STEPS.find((x) => x.id === s.stepId).highlights);
	const active = highlights.includes("hose") || highlights.includes("joint_hose");
	if (fitted && combo === "hose") return null;
	const bench = [
		1.46,
		.46,
		.36
	];
	const seated = [
		.17,
		1.04,
		.03
	];
	const pos = fitted ? [
		bench[0] + (seated[0] - bench[0]) * p,
		bench[1] + (seated[1] - bench[1]) * p,
		bench[2] + (seated[2] - bench[2]) * p
	] : bench;
	const rot = fitted ? [
		-Math.PI / 2 * p,
		.15 - .4 * p,
		0
	] : [
		0,
		.28,
		0
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Clickable, {
		id: "hose",
		position: pos,
		rotation: rot,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlight, {
			active,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FittedGltf, {
				url: MODEL.hose,
				size: HOSE_SIZE
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostHit, { radius: .2 })]
	}), flow > 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		position: [
			.42,
			.72,
			.18
		],
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			.03,
			8,
			8
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
			color: "#9fd2dc",
			transparent: true,
			opacity: .35
		})]
	}) : null] });
}
function Wrench() {
	const swing = useGame((s) => s.wrenchSwing);
	const fitted = useGame((s) => s.regulatorFitted);
	const hoseFitted = useGame((s) => s.hoseFitted);
	const combo = useCombo();
	const highlights = useGame((s) => STEPS.find((x) => x.id === s.stepId).highlights);
	const active = highlights.includes("wrench");
	const using = swing > 0 && fitted;
	const onHose = using && hoseFitted && highlights.includes("hose");
	const pos = using ? onHose ? combo === "hose" ? [
		.26,
		1.06,
		.12
	] : [
		.22,
		1.24,
		.1
	] : combo !== "parts" ? [
		.16,
		1.12,
		.08
	] : [
		.16,
		1.22,
		.1
	] : [
		1.62,
		.46,
		-.4
	];
	const rot = using ? [
		.2,
		.7,
		Math.sin(swing * Math.PI) * .55
	] : [
		0,
		.85,
		0
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Clickable, {
		id: "wrench",
		position: pos,
		rotation: rot,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlight, {
			active,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FittedGltf, {
				url: MODEL.wrench,
				size: WRENCH_SIZE
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostHit, { radius: .18 })]
	});
}
function SoapBottle() {
	const mat = (0, import_react.useRef)(null);
	const active = useGame((s) => STEPS.find((x) => x.id === s.stepId).highlights).includes("soap");
	useFrame(({ clock }) => pulse(mat.current, active, clock.elapsedTime, "#4aa3b0"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Clickable, {
		id: "soap",
		position: [
			.92,
			.55,
			.22
		],
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				castShadow: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.035,
					.04,
					.12,
					12
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
					ref: mat,
					color: "#d5e4ea",
					transparent: true,
					opacity: .7,
					roughness: .2
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.075,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.018,
					.022,
					.04,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#2a333a" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.1,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("coneGeometry", { args: [
					.012,
					.03,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", { color: "#4aa3b0" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostHit, { radius: .1 })
		]
	});
}
function Bubbles() {
	const amount = useGame((s) => s.bubbles);
	const leak = useGame((s) => s.leak);
	const fitted = useGame((s) => s.regulatorFitted);
	const hoseFitted = useGame((s) => s.hoseFitted);
	const pts = (0, import_react.useMemo)(() => {
		return Array.from({ length: 14 }, () => ({
			a: Math.random() * Math.PI * 2,
			r: .02 + Math.random() * .05,
			s: .6 + Math.random() * .8
		}));
	}, []);
	const ref = (0, import_react.useRef)(null);
	useFrame(({ clock }) => {
		if (!ref.current) return;
		ref.current.children.forEach((c, i) => {
			const p = pts[i];
			c.position.y = (clock.elapsedTime * p.s * .12 + i * .03) % .28;
			const sc = .6 + Math.sin(clock.elapsedTime * 3 + i) * .2;
			c.scale.setScalar(sc);
		});
	});
	if (amount < .05 || !fitted) return null;
	const positions = [];
	if (leak.reg) positions.push([
		.08,
		1.16,
		0
	]);
	if (leak.hose && hoseFitted) positions.push([
		.22,
		1.06,
		.08
	]);
	if (positions.length === 0 && amount > 0) positions.push([
		.08,
		1.14,
		.04
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: positions.map((pos, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", {
		position: pos,
		ref: i === 0 ? ref : void 0,
		children: pts.map((p, n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
			position: [
				Math.cos(p.a) * p.r,
				0,
				Math.sin(p.a) * p.r
			],
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
				.012,
				8,
				8
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshPhysicalMaterial", {
				color: "#dbeff2",
				transparent: true,
				opacity: .55,
				roughness: .1
			})]
		}, n))
	}, i)) });
}
function GasJet() {
	const gas = useGame((s) => s.gasLeak);
	const ref = (0, import_react.useRef)(null);
	const geo = (0, import_react.useMemo)(() => {
		const g = new BufferGeometry();
		const n = 80;
		const arr = /* @__PURE__ */ new Float32Array(240);
		for (let i = 0; i < n; i++) {
			arr[i * 3] = (Math.random() - .5) * .1;
			arr[i * 3 + 1] = Math.random() * .4;
			arr[i * 3 + 2] = (Math.random() - .5) * .1;
		}
		g.setAttribute("position", new BufferAttribute(arr, 3));
		return g;
	}, []);
	useFrame((_, dt) => {
		if (!ref.current) return;
		const pos = ref.current.geometry.getAttribute("position");
		for (let i = 0; i < pos.count; i++) {
			let y = pos.getY(i) + dt * (.6 + i % 5 * .15);
			if (y > .5) y = 0;
			pos.setY(i, y);
			pos.setX(i, pos.getX(i) * .98 + (Math.random() - .5) * .01);
		}
		pos.needsUpdate = true;
	});
	if (gas < .05) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("points", {
		ref,
		position: [
			.02,
			CYL_H,
			0
		],
		geometry: geo,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointsMaterial", {
			color: "#cfe8ec",
			size: .025,
			transparent: true,
			opacity: .55 * gas,
			depthWrite: false
		})
	});
}
function Rig() {
	const trauma = useGame((s) => s.trauma);
	useFrame((state, delta) => {
		const d = Math.min(delta, .1);
		useGame.getState().tick(d);
		const shake = trauma * trauma;
		if (shake > .002) {
			state.camera.position.x += (Math.random() - .5) * shake * .08;
			state.camera.position.y += (Math.random() - .5) * shake * .05;
		}
	});
	return null;
}
function Lights() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
			"#d7e2e8",
			"#3a3228",
			.85
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", { intensity: .55 }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
			castShadow: true,
			position: [
				3.4,
				6.2,
				2.8
			],
			intensity: 1.65,
			"shadow-mapSize": [1024, 1024],
			"shadow-camera-near": 1,
			"shadow-camera-far": 16,
			"shadow-camera-left": -4,
			"shadow-camera-right": 4,
			"shadow-camera-top": 4,
			"shadow-camera-bottom": -4
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("spotLight", {
			position: [
				-1.6,
				4.4,
				3.2
			],
			intensity: .95,
			angle: .55,
			penumbra: .7,
			color: "#e7eef2"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pointLight", {
			position: [
				.6,
				2.1,
				1.4
			],
			intensity: .55,
			color: "#f3efe6",
			distance: 6
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Environment, {
			frames: 1,
			resolution: 256,
			environmentIntensity: .55,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
					intensity: 2.2,
					rotation: [
						Math.PI / 2,
						0,
						0
					],
					position: [
						0,
						5,
						0
					],
					scale: [
						12,
						12,
						1
					],
					color: "#eef3f6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
					intensity: 1.3,
					position: [
						4,
						2,
						3
					],
					scale: [
						4,
						7,
						1
					],
					color: "#d5e4ec"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
					intensity: .7,
					position: [
						-3.5,
						1.6,
						2
					],
					scale: [
						3,
						5,
						1
					],
					color: "#f0e4d4"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightformer, {
					intensity: .45,
					position: [
						0,
						1.2,
						-4
					],
					scale: [
						8,
						3,
						1
					],
					color: "#8a9aa6"
				})
			]
		})
	] });
}
function Assembly() {
	const combo = useCombo();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CylinderRig, {}),
		combo === "reg" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CombinedAssembly, {
			url: MODEL.n2Reg,
			hose: false
		}) : null,
		combo === "hose" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CombinedAssembly, {
			url: MODEL.n2RegHose,
			hose: true
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Regulator, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hose, {})
	] });
}
function World() {
	const grab = useGame((s) => s.valveGrab);
	const inspect = useGame((s) => s.codexOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
			attach: "background",
			args: ["#0b0f12"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("fog", {
			attach: "fog",
			args: [
				"#0b0f12",
				8,
				16
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lights, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrbitControls, {
			makeDefault: true,
			enabled: !grab || inspect,
			enablePan: false,
			minPolarAngle: .2,
			maxPolarAngle: Math.PI / 1.9,
			minDistance: inspect ? .4 : 1.5,
			maxDistance: inspect ? 5.5 : 5.5,
			target: inspect ? [
				0,
				.62,
				0
			] : [
				.18,
				.9,
				0
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraDirector, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rig, {}),
		inspect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodexStage, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Floor, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Room, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bench, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Assembly, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoapBottle, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bubbles, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GasJet, {})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactShadows, {
			position: [
				0,
				.01,
				0
			],
			opacity: .42,
			scale: 8,
			blur: 2.4,
			far: 4
		})
	] });
}
function CodexStage() {
	const id = useGame((s) => s.codexId);
	const entry = CODEX_ENTRIES.find((e) => e.id === id) ?? CODEX_ENTRIES[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
		rotation: [
			-Math.PI / 2,
			0,
			0
		],
		position: [
			0,
			0,
			0
		],
		receiveShadow: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circleGeometry", { args: [2.4, 48] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshStandardMaterial", {
			color: "#161c20",
			roughness: .92
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FittedGltf, {
		url: entry.url,
		size: 1.42
	}, entry.url)] });
}
function Loader3D() {
	const { progress } = useProgress();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Html, {
		center: true,
		wrapperClass: "pointer-events-none",
		style: { pointerEvents: "none" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none rounded-md border border-border bg-surface/90 px-3 py-2 font-mono text-xs text-muted",
			children: [
				"장비 ",
				progress.toFixed(0),
				"%"
			]
		})
	});
}
function GameCanvas() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Canvas, {
		camera: {
			position: [
				1.95,
				1.48,
				2.35
			],
			fov: 40,
			near: .1,
			far: 40
		},
		shadows: true,
		dpr: [1, 1.75],
		gl: {
			antialias: true,
			alpha: false,
			toneMapping: 4
		},
		onCreated: ({ gl }) => {
			gl.shadowMap.enabled = true;
			gl.shadowMap.type = 1;
			gl.toneMappingExposure = 1.28;
		},
		className: "h-full w-full touch-none",
		style: { touchAction: "none" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
			fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader3D, {}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(World, {})
		})
	});
}
//#endregion
export { GameCanvas as default };
