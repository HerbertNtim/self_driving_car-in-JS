/* 
  A level has a much of input neurons and output neurons
  The numbers for these don't necessary match. Example 5 inputs to 4 outputs 

  0 0 0 0 
    4 outputs

    5 inputs
  0 0 0 0 0
*/

class Level {
  constructor(inputCount, outputCount) {
    // Defining the actual neurons
    this.inputs = new Array(inputCount); // Values from the car sensors
    this.outputs = new Array(outputCount);

    this.biases = new Array(outputCount); // Each output neuron have a biases.

    // These connections between the inputs and outputs have weights. Each input node has output counts of connections
    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  // Random brain to begin with
  static #randomize(level) {
    // A walk through to get level inputs and outputs
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1; // Getting values between -1 and 1
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1;
    }
  }

  // Computing the outputs with the feed forward algorithm.
  static feedForward(givenInputs, level) {
    // Getting inputs
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    // Getting outputs;
    // Hyperplane Equation
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.outputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    } 

    return level.outputs;
  }
}
