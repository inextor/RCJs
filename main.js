

window.addEventListener("load",()=>{
	let input = document.getElementById('file');
	input.addEventListener('change',(f)=>{
		let reader = new FileReader();
		reader.readAsArrayBuffer(f.target.files[0]);

		reader.addEventListener('load',(e)=>{
			let arrayBuffer = reader.result;
			console.log( reader.result );

		});
	});

});
