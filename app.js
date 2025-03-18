// Load face-api.js models
const MODEL_URL = '/models'; // Set this path if you host the models yourself (for example, in a local /models folder)

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  console.log('Models loaded');
}

// Intro section navigation
document.getElementById('go-to-details').addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const rollNo = document.getElementById('rollNo').value;
  const branch = document.getElementById('branch').value;

  if (name && rollNo && branch) {
    // Show details section
    document.getElementById('detail-name').textContent = name;
    document.getElementById('detail-rollNo').textContent = rollNo;
    document.getElementById('detail-branch').textContent = branch;

    document.getElementById('intro').style.display = 'none';
    document.getElementById('details').style.display = 'block';
  } else {
    alert('Please fill in all the details.');
  }
});

// Details section navigation
document.getElementById('next-btn').addEventListener('click', () => {
  document.getElementById('details').style.display = 'none';
  document.getElementById('face-recognition').style.display = 'block';
  startVideo(); // Start video for face recognition
});

// Initialize video stream for face recognition
async function startVideo() {
  const video = document.getElementById('video');
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  video.srcObject = stream;

  video.onplay = () => {
    detectFace(video);
  };
}

// Detect face in the video feed
async function detectFace(video) {
  const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

  if (detections.length > 0) {
    // Draw detections (Optional)
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    faceapi.matchDimensions(canvas, video);
    canvas?.detectAllFaces(video);

    const name = document.getElementById('name').value;
    const rollNo = document.getElementById('rollNo').value;
    const branch = document.getElementById('branch').value;

    if (name && rollNo && branch) {
      // Register attendance
      const attendanceList = document.getElementById('attendance-record');
      const newRecord = document.createElement('li');
      newRecord.textContent = `${name} (Roll No: ${rollNo}, Branch: ${branch}) - Attendance Captured`;
      attendanceList.appendChild(newRecord);
    }
  }

  setTimeout(() => detectFace(video), 100); // Repeat detection every 100ms
}

// Capture Attendance Button
document.getElementById('capture-btn').addEventListener('click', () => {
  alert('Attendance has been captured');
  document.getElementById('done-btn').style.display = 'block'; // Show the Done button after capturing attendance
});

// Done Button
document.getElementById('done-btn').addEventListener('click', () => {
  const attendanceRecords = document.getElementById('attendance-record').children.length;
  document.getElementById('attendance-count').style.display = 'block';
  document.getElementById('count').textContent = attendanceRecords;
  document.getElementById('done-btn').style.display = 'none'; // Hide Done button after it's clicked
});

// Start everything
async function init() {
  await loadModels();
}

init();