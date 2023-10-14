const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const { ImageAnnotatorClient } = require('@google-cloud/documentai');

const app = express();
const upload = multer({ dest: 'uploads/' });
const storage = new Storage();
const client = new ImageAnnotatorClient();

// Configure Google Cloud Storage bucket
const bucketName = 'your-bucket-name';
const bucket = storage.bucket(bucketName);

// Process bill image
async function processBillImage(imagePath) {
  // Upload the image file to Google Cloud Storage
  const uploadedImage = await bucket.upload(imagePath);

  // Construct the request payload for Document AI
  const request = {
    image: {
      content: uploadedImage[0].metadata.mediaLink,
    },
    feature: {
      name: 'document_text_detection',
    },
  };

  // Call the Document AI API to process the image
  const [response] = await client.documentTextDetection(request);

  // Parse the extracted text from the response
  const extractedText = response.fullTextAnnotation.text;
  // Implement parsing logic to extract relevant bill information from the text

  // Return the parsed bill information
  return {
    totalAmount: 100.0, // Replace with your parsed value
    // Add more extracted fields as needed
  };
}

// Handle bill processing request
app.post('/process-bill', upload.single('billImage'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const billInfo = await processBillImage(imagePath);
    res.json(billInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the bill image' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});