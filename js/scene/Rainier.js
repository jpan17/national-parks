function Rainier(scene) {
  let loader = new THREE.STLLoader();
  loader.load('objects/rainier.stl', function (geometry) {

    var material = new THREE.MeshPhongMaterial( { color: 0x00AAFF, shininess: 30, specular: 0x111111 } );
    
    geometry.faces[0].normal;
    geometry.computeFaceNormals(); 

    rainier = new THREE.Mesh( geometry, material );
    
    rainier.position.set(0,0,0);
    rainier.rotation.set(180,0,0);
    rainier.scale.set(1,1,1);
    
    rainier.castShadow = true;
    rainier.receiveShadow = true;
    scene.add(rainier);

  });
}
