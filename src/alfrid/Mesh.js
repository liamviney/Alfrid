// Mesh.js

import GL from './GLTool';

let gl;

class Mesh {
	constructor(mDrawType = GL.gl.TRIANGLES) {
		gl = GL.gl;
		this.drawType = mDrawType;
		this._attributes = [];
	}


	bufferVertex(mArrayVertices, isDynamic=false) {

		this.bufferData(mArrayVertices, 'aVertexPosition', 3, isDynamic);

	}


	bufferTexCoords(mArrayTexCoords, isDynamic=false) {

		this.bufferData(mArrayTexCoords, 'aTextureCoord', 2, isDynamic);

	}


	bufferIndices(mArrayIndices, isDynamic=false) {

		var drawType          = isDynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
		this._indices         = mArrayIndices;
		this.iBuffer          = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mArrayIndices), drawType);
		this.iBuffer.itemSize = 1;
		this.iBuffer.numItems = mArrayIndices.length;

	}


	bufferData(mData, mName, mItemSize, isDynamic=false) {
		let index = -1, i=0;
		let drawType   = isDynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
		let bufferData = [];
		let buffer, dataArray;

		//	Check for existing attributes
		for(i=0; i<this._attributes.length; i++) {
			if(this._attributes[i].name === mName) {
				this._attributes[i].data = mData;
				index = i;
				break;
			}
		}

		//	flatten buffer data		
		for(i=0; i<mData.length; i++) {
			for(let j=0; j<mData[i].length; j++) {
				bufferData.push(mData[i][j]);
			}
		}

		
		if(index === -1) {	

			//	attribute not exist yet, create new buffer
			buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

			dataArray = new Float32Array(bufferData);
			gl.bufferData(gl.ARRAY_BUFFER, dataArray, drawType);
			this._attributes.push({name:mName, data:mData, itemSize: mItemSize, buffer:buffer, dataArray:dataArray});

		} else {

			//	attribute existed, replace with new data
			buffer = this._attributes[index].buffer;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			dataArray = this._attributes[index].dataArray;
			for(i=0; i<bufferData.length; i++) {
				dataArray[i] = bufferData[i];
			}
			gl.bufferData(gl.ARRAY_BUFFER, dataArray, drawType);

		}

	}


	get attributes() {
		return this._attributes;
	}


}


export default Mesh;