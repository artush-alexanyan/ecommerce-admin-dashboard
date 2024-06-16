// tensorflowImageClassifier.js

import * as tf from '@tensorflow/tfjs';

let model;
let labelsArray;

async function loadModel() {
    try {
        model = await tf.loadGraphModel('https://www.kaggle.com/models/google/mobilenet-v2/frameworks/TfJs/variations/035-128-classification/versions/3', { fromTFHub: true });
        const response = await fetch('https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt');
        const text = await response.text();
        labelsArray = text.split('\n').map(label => label.trim()).filter(label => label !== '');
    } catch (error) {
        console.error('Error loading model or labels:', error);
    }
}

async function classifyImage(image) {
    if (!model || !labelsArray) {
        console.error('Model or labels not loaded yet.');
        return [];
    }

    const imgTensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([128, 128])
        .toFloat()
        .div(tf.scalar(255))
        .expandDims();

    const predictions = await model.predict(imgTensor);
    const topPredictions = Array.from(predictions.dataSync())
        .map((probability, index) => ({ probability, label: labelsArray[index] }))
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 3);

    return topPredictions;
}

export { loadModel, classifyImage };
