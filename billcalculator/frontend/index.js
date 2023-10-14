import firebase from 'firebase/app';
import 'firebase/storage';
import $ from 'jquery';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// Handle form submission
$('#billingForm').submit(function(e) {
  e.preventDefault();

  // Get the selected bill image file
  const billImage = $('#billImage')[0].files[0];

  // Generate a unique filename for the bill image
  const filename = `${Date.now()}_${billImage.name}`;

  // Upload the bill image file to Firebase Storage
  const storageRef = storage.ref(filename);
  const uploadTask = storageRef.put(billImage);

  // Listen to upload progress events
  uploadTask.on(
    'state_changed',
    function(snapshot) {
      // Show upload progress if needed
    },
    function(error) {
      console.error('Upload error:', error);
    },
    function() {
      // Upload completed successfully
      // Get the download URL of the uploaded image
      storageRef.getDownloadURL()
        .then(function(url) {
          // Send the download URL to the server for processing
          $.ajax({
            url: '/process-bill',
            type: 'POST',
            data: { imageUrl: url },
            success: function(response) {
              displayBillInfo(response);
            },
            error: function(error) {
              console.error(error);
            }
          });
        })
        .catch(function(error) {
          console.error('Error getting download URL:', error);
        });
    }
  );
});

// Display parsed bill information
function displayBillInfo(billInfo) {
  const billInfoContainer = $('#billInfo');
  billInfoContainer.empty();

  // Iterate over the parsed information and create list items
  for (const [key, value] of Object.entries(billInfo)) {
    const listItem = $('<li></li>').text(`${key}: ${value}`);
    billInfoContainer.append(listItem);
  }

  // Show the result container
  $('#resultContainer').show();
}

