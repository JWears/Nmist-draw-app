import tensorflow as tf
import numpy as np

# Build a Model: Use TensorFlow's high-level APIs like Keras to build models. For example, a simple neural network:
model = tf.keras.Sequential([ # Sequential model is a linear stack of layers of a neural network
    tf.keras.layers.Dense(64, activation='relu', input_shape=(784,)), # 64 neurons, ReLU activation, input shape of 784 (28 x 28 pixels)
    tf.keras.layers.Dense(10, activation='softmax') # 10 neurons (one for each digit), softmax activation creates value between 0 and 1
])

# Compile the Model: Specify the optimizer, loss function, and metrics for training.
model.compile(optimizer='adam', # Adam optimizer is a popular choice for training neural networks it adjusts the learning rate during training
              loss='sparse_categorical_crossentropy', # Sparse categorical crossentropy is used for multiclass classification problems
              metrics=['accuracy']) # Accuracy is a common metric for classification problems it measures the proportion of correct predictions
# Train the Model: Fit the model to your training data.
# For demonstration purposes, let's use the MNIST dataset, which is a collection of handwritten digits.
# TensorFlow provides a convenient way to load this dataset.

# Load the MNIST dataset
mnist = tf.keras.datasets.mnist
(train_data, train_labels), (test_data, test_labels) = mnist.load_data()

# Normalize the data to the range [0, 1]
train_data = train_data / 255.0
test_data = test_data / 255.0
# Why do we normalize the data?
# For convergence purposes. Neural networks are sensitive to the scale of input data, so normalizing it helps the model learn better.

# Flatten the images to 1D vectors of size 784 (28x28)
train_data = train_data.reshape(-1, 784)
test_data = test_data.reshape(-1, 784)
# Train the model
history = model.fit(train_data, train_labels, epochs=8, validation_data=(test_data, test_labels))

# Evaluate the Model: Assess the model's performance on test data.
model.evaluate(test_data, test_labels)
