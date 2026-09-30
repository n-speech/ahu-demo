/*
  Builds one air handling unit as a THREE.Group.
  Shared by index.html (site planner) and ar.html (AR view),
  so both always show the same unit.

  Origin: centre of the unit's footprint, on the floor. Length runs along Z. Metres.

  buildAhuUnit(THREE, unit, mats, options)
    unit    — AHU_CONFIG.unit
    mats    — { body, fans, clearance, clearanceLine? }
    options — { sections: true, clearance: true, edges: true }
*/
window.buildAhuUnit = function (THREE, unit, mats, options) {
  const opt = Object.assign({ sections: true, clearance: true, edges: true }, options || {});
  const L = unit.lengthM, W = unit.widthM, H = unit.heightM;
  const C = unit.clearanceM || 0;
  const g = new THREE.Group();

  function box(w, h, d, mat, x, y, z) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true; m.receiveShadow = true;
    g.add(m);
    return m;
  }

  // Body, split into shipping sections
  const secN = Math.max(1, Math.ceil(L / unit.maxSectionM));
  if (opt.sections && secN > 1) {
    const sl = L / secN, gap = 0.12;
    for (let s = 0; s < secN; s++) box(W, H, sl - gap, mats.body, 0, H / 2, -L / 2 + sl * s + sl / 2);
  } else {
    box(W, H, L, mats.body, 0, H / 2, 0);
  }

  // Fans on top
  const fans = unit.fansOnTop || Math.max(1, Math.round(L / 6));
  const r = Math.min(W * 0.33, 1.6);
  for (let f = 0; f < fans; f++) {
    const fan = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.3, 32), mats.fans);
    fan.position.set(0, H + 0.15, -L / 2 + L * (f + 0.5) / fans);
    g.add(fan);
  }

  // Service clearance along both long sides
  if (opt.clearance && C > 0) {
    [-1, 1].forEach(function (side) {
      const geo = new THREE.BoxGeometry(C, 0.25, L);
      const pad = new THREE.Mesh(geo, mats.clearance);
      pad.position.set(side * (W / 2 + C / 2), 0.13, 0);
      g.add(pad);
      if (opt.edges && mats.clearanceLine) {
        const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), mats.clearanceLine);
        e.position.copy(pad.position);
        g.add(e);
      }
    });
  }

  g.userData.sections = secN;
  return g;
};
