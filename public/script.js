// Fetch and display all uploaded files when the page loads
async function fetchUploadedFiles() {
    try {
      const response = await fetch("http://localhost:5000/files");
      const data = await response.json();
  
      const fileList = document.getElementById("fileList");
      fileList.innerHTML = ""; // Clear existing list
  
      // Display songs
      data.songs.forEach(song => {
        const listItem = document.createElement("li");
        const songLink = document.createElement("a");
        songLink.href = song.url;
        songLink.textContent = song.name;
        songLink.target = "_blank";
        listItem.innerHTML = `<strong>Song:</strong> ${songLink.outerHTML}`;
        fileList.appendChild(listItem);
      });
  
      // Display images
      data.images.forEach(image => {
        const listItem = document.createElement("li");
        const imageLink = document.createElement("a");
        imageLink.href = image.url;
        imageLink.textContent = image.name;
        imageLink.target = "_blank";
        listItem.innerHTML = `<strong>Image:</strong> ${imageLink.outerHTML}`;
        fileList.appendChild(listItem);
      });
    } catch (error) {
      console.error("Error fetching uploaded files:", error);
    }
  }
  
  // Handle file upload
  document.getElementById("uploadForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("song", document.getElementById("songUpload").files[0]);
    formData.append("image", document.getElementById("imageUpload").files[0]);
  
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Refresh the list of uploaded files
        fetchUploadedFiles();
  
        // Clear form
        document.getElementById("uploadForm").reset();
      } else {
        alert(data.error || "Failed to upload files.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred while uploading files.");
    }
  });
  
  // Fetch uploaded files when the page loads
  fetchUploadedFiles();