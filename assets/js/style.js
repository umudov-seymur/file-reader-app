const uploadArea = document.querySelector(".upload-area");
const uploadInput = uploadArea.querySelector(".file-input");
const uploadedArea = document.querySelector(".uploaded-area");
const uploadedFileTab = uploadedArea.querySelector("ul");
const uploadedFileContent = uploadedArea.querySelector(".tab-content");

let uploadedFiles = [];
const validExtensions = ["image/jpeg", "image/jpg", "image/png", "text/plain"];

class UI {
  static displayUploadedFiles() {
    if (uploadedFiles.length > 0) {
      uploadedArea.classList.remove("d-none");
    }

    uploadedFiles.forEach((file, fileIndex) => {
      if (validExtensions.includes(file.type)) {
        UI.readUploadedFile(file, fileIndex);
      }
    });
  }

  static readUploadedFile(file, fileIndex) {
    const fileReader = new FileReader();
    const fileType = file.type;

    uploadedFileTab.innerHTML += UI.createFileTabLinkHtml(file, fileIndex);

    fileReader.onload = () => {
      uploadedFileContent.innerHTML += UI.createFileTabContentHtml(
        fileType,
        fileReader.result,
        fileIndex
      );
    };

    if (fileType.match("image.*")) {
      fileReader.readAsDataURL(file);
    } else {
      fileReader.readAsText(file);
    }
  }

  static resetUploadedFileHtml() {
    uploadedFileTab.innerHTML = "";
    uploadedFileContent.innerHTML = "";
  }

  static createFileTabLinkHtml(file, fileIndex) {
    return `
      <li class="nav-item" onclick="UI.openTabContent(this, ${fileIndex})">
          <a href="#" class="nav-link ${fileIndex == 0 ? "active" : null}">
            ${file.name}
          </a> 
      </li>
    `;
  }

  static createFileTabContentHtml(fileType, fileResult, fileIndex) {
    const fileContent = fileType.match("image.*")
      ? `<img class="img-fluid" src="${fileResult}" />`
      : `<textarea name="" id="" class="w-100 shadow-sm p-3" rows="10" readonly>${fileResult}</textarea>`;

    return `
      <div class="tab-pane ${
        fileIndex == 0 ? "show active" : null
      }" id="file_${fileIndex}">
          ${fileContent}
      </div>
    `;
  }

  static removeActiveTabs() {
    [...uploadedFileTab.querySelectorAll(".nav-link")].map((navLink) =>
      navLink.classList.remove("active")
    );

    [...uploadedFileContent.querySelectorAll(".tab-pane")].map((navLink) =>
      navLink.classList.remove("active", "show")
    );
  }

  static openTabContent(fileTab, fileIndex) {
    UI.removeActiveTabs();

    const fileTabLink = fileTab.querySelector(".nav-link");
    const fileTabContent = uploadedFileContent.querySelector(
      `#file_${fileIndex}`
    );

    fileTabLink.classList.add("active");
    fileTabContent.classList.add("show", "active");
  }
}

class FileStorage {
  static setFiles(files) {
    // && uploadedFiles.findIndex((upFile) => upFile.name == file.name) == -1
    const filteredFiles = [...files].filter((file) =>
      validExtensions.includes(file.type)
    );

    uploadedFiles = [...uploadedFiles, ...filteredFiles];
  }
}

uploadInput.addEventListener("change", (event) => {
  FileStorage.setFiles(event.target.files);
  UI.resetUploadedFileHtml();
  UI.displayUploadedFiles();
});

uploadArea.addEventListener("click", () => {
  uploadInput.click();
});

uploadArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  uploadArea.classList.add("active");
});

uploadArea.addEventListener("dragleave", (event) => {
  event.preventDefault();
  uploadArea.classList.remove("active");
});

uploadArea.addEventListener("drop", (event) => {
  event.preventDefault();

  uploadArea.classList.remove("active");

  FileStorage.setFiles(event.dataTransfer.files);
  UI.resetUploadedFileHtml();
  UI.displayUploadedFiles();
});
